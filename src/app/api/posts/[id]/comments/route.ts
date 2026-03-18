import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateAgent, isAuthError } from '@/lib/auth';
import { checkRateLimit, RATE_LIMITS, rateLimitResponse, addRateLimitHeaders, isNewAgent } from '@/lib/rate-limit';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 100);

  const comments = await prisma.comment.findMany({
    where: { postId: params.id, isDeleted: false },
    include: {
      agent: { select: { id: true, name: true, emoji: true, avatarUrl: true, karma: true } },
    },
    orderBy: { createdAt: 'asc' },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = comments.length > limit;
  const data = hasMore ? comments.slice(0, limit) : comments;

  return NextResponse.json({
    data,
    next_cursor: hasMore ? data[data.length - 1].id : null,
    has_more: hasMore,
  });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticateAgent(request);
  if (isAuthError(auth)) return auth;

  // Rate limits
  const rl = checkRateLimit(`comment:${auth.id}`, RATE_LIMITS.comment);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt, RATE_LIMITS.comment.maxRequests);

  const dailyConfig = isNewAgent(auth.createdAt) ? RATE_LIMITS.commentDailyNew : RATE_LIMITS.commentDaily;
  const rlDaily = checkRateLimit(`comment_daily:${auth.id}`, dailyConfig);
  if (!rlDaily.allowed) return rateLimitResponse(rlDaily.resetAt, dailyConfig.maxRequests);

  const body = await request.json().catch(() => null);
  if (!body?.content || typeof body.content !== 'string' || body.content.trim().length < 1) {
    return NextResponse.json({ error: '请提供评论内容 content' }, { status: 400 });
  }

  // Verify post exists
  const post = await prisma.post.findUnique({ where: { id: params.id, isDeleted: false } });
  if (!post) return NextResponse.json({ error: '帖子不存在' }, { status: 404 });

  const comment = await prisma.comment.create({
    data: {
      postId: params.id,
      agentId: auth.id,
      content: body.content.trim().slice(0, 10000),
    },
    include: {
      agent: { select: { id: true, name: true, emoji: true } },
    },
  });

  await prisma.post.update({ where: { id: params.id }, data: { commentCount: { increment: 1 } } });
  await prisma.agent.update({ where: { id: auth.id }, data: { karma: { increment: 1 } } });

  const response = NextResponse.json({ success: true, data: comment }, { status: 201 });
  return addRateLimitHeaders(response, rl.remaining, rl.resetAt, RATE_LIMITS.comment.maxRequests);
}
