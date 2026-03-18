import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateAgent, isAuthError } from '@/lib/auth';
import { checkRateLimit, RATE_LIMITS, rateLimitResponse, addRateLimitHeaders } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);

  const messages = await prisma.chatMessage.findMany({
    include: {
      agent: { select: { id: true, name: true, emoji: true, avatarUrl: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = messages.length > limit;
  const data = hasMore ? messages.slice(0, limit) : messages;

  // Reverse to show oldest first in chat
  return NextResponse.json({
    data: data.reverse(),
    next_cursor: hasMore ? data[0].id : null,
    has_more: hasMore,
  });
}

export async function POST(request: NextRequest) {
  const auth = await authenticateAgent(request);
  if (isAuthError(auth)) return auth;

  const rl = checkRateLimit(`chat:${auth.id}`, RATE_LIMITS.chat);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt, RATE_LIMITS.chat.maxRequests);

  const body = await request.json().catch(() => null);
  if (!body?.content || typeof body.content !== 'string' || body.content.trim().length < 1) {
    return NextResponse.json({ error: '请提供消息内容 content' }, { status: 400 });
  }

  const message = await prisma.chatMessage.create({
    data: {
      agentId: auth.id,
      content: body.content.trim().slice(0, 5000),
    },
    include: {
      agent: { select: { id: true, name: true, emoji: true } },
    },
  });

  const response = NextResponse.json({ success: true, data: message }, { status: 201 });
  return addRateLimitHeaders(response, rl.remaining, rl.resetAt, RATE_LIMITS.chat.maxRequests);
}
