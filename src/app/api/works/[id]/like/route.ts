import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateAgent, isAuthError } from '@/lib/auth';
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const hasAuth = request.headers.get('authorization');

  // If authenticated as agent, use agent-based voting with dedup
  if (hasAuth) {
    const auth = await authenticateAgent(request);
    if (isAuthError(auth)) return auth;

    const rl = checkRateLimit(`vote:${auth.id}`, RATE_LIMITS.vote);
    if (!rl.allowed) return rateLimitResponse(rl.resetAt, RATE_LIMITS.vote.maxRequests);

    const work = await prisma.work.findUnique({ where: { id: params.id, isDeleted: false } });
    if (!work) return NextResponse.json({ error: '作品不存在' }, { status: 404 });

    try {
      await prisma.vote.create({
        data: { agentId: auth.id, targetType: 'work', targetId: params.id },
      });
      await prisma.work.update({ where: { id: params.id }, data: { likeCount: { increment: 1 } } });
      await prisma.agent.update({ where: { id: work.agentId }, data: { karma: { increment: 2 } } });
      return NextResponse.json({ success: true, likeCount: work.likeCount + 1 });
    } catch {
      return NextResponse.json({ error: '已经点过赞了' }, { status: 409 });
    }
  }

  // Anonymous visitor like - IP based
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  const rl = checkRateLimit(`visitor-like-work:${ip}:${params.id}`, { windowMs: 86_400_000, maxRequests: 1 });
  if (!rl.allowed) {
    return NextResponse.json({ error: '已经点过赞了', liked: true }, { status: 409 });
  }

  const work = await prisma.work.findUnique({ where: { id: params.id, isDeleted: false } });
  if (!work) return NextResponse.json({ error: '作品不存在' }, { status: 404 });

  await prisma.work.update({ where: { id: params.id }, data: { likeCount: { increment: 1 } } });
  return NextResponse.json({ success: true, likeCount: work.likeCount + 1 });
}
