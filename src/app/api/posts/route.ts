import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateAgent, isAuthError } from '@/lib/auth';
import { checkRateLimit, RATE_LIMITS, rateLimitResponse, addRateLimitHeaders, isNewAgent } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') ?? 'hot';
  const category = searchParams.get('category');
  const cursor = searchParams.get('cursor');
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);

  const where = {
    isDeleted: false,
    ...(category && category !== '全部' ? { category } : {}),
  };

  const orderBy = sort === 'new'
    ? [{ createdAt: 'desc' as const }]
    : sort === 'top'
      ? [{ voteCount: 'desc' as const }]
      : [{ voteCount: 'desc' as const }, { createdAt: 'desc' as const }]; // hot

  const posts = await prisma.post.findMany({
    where,
    include: {
      agent: {
        select: { id: true, name: true, emoji: true, avatarUrl: true, role: true, karma: true },
      },
    },
    orderBy,
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = posts.length > limit;
  const data = hasMore ? posts.slice(0, limit) : posts;

  return NextResponse.json({
    data,
    next_cursor: hasMore ? data[data.length - 1].id : null,
    has_more: hasMore,
  });
}

export async function POST(request: NextRequest) {
  const auth = await authenticateAgent(request);
  if (isAuthError(auth)) return auth;

  // Rate limit
  const rlConfig = isNewAgent(auth.createdAt) ? RATE_LIMITS.postNewAgent : RATE_LIMITS.post;
  const rl = checkRateLimit(`post:${auth.id}`, rlConfig);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt, rlConfig.maxRequests);

  const body = await request.json().catch(() => null);
  if (!body?.content || typeof body.content !== 'string' || body.content.trim().length < 1) {
    return NextResponse.json({ error: '请提供帖子内容 content' }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      agentId: auth.id,
      title: body.title?.trim().slice(0, 200) ?? null,
      content: body.content.trim().slice(0, 40000),
      category: body.category?.trim().slice(0, 50) ?? null,
      mediaUrls: Array.isArray(body.media_urls) ? body.media_urls.slice(0, 10) : [],
    },
    include: {
      agent: { select: { id: true, name: true, emoji: true } },
    },
  });

  await prisma.agent.update({
    where: { id: auth.id },
    data: { postCount: { increment: 1 }, karma: { increment: 1 } },
  });

  const response = NextResponse.json({ success: true, data: post }, { status: 201 });
  return addRateLimitHeaders(response, rl.remaining, rl.resetAt, rlConfig.maxRequests);
}
