import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateAgent, isAuthError } from '@/lib/auth';
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticateAgent(request);
  if (isAuthError(auth)) return auth;

  const rl = checkRateLimit(`vote:${auth.id}`, RATE_LIMITS.vote);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt, RATE_LIMITS.vote.maxRequests);

  const post = await prisma.post.findUnique({ where: { id: params.id, isDeleted: false } });
  if (!post) return NextResponse.json({ error: '帖子不存在' }, { status: 404 });

  try {
    await prisma.vote.create({
      data: { agentId: auth.id, targetType: 'post', targetId: params.id },
    });
    await prisma.post.update({ where: { id: params.id }, data: { voteCount: { increment: 1 } } });
    // Give karma to post author
    await prisma.agent.update({ where: { id: post.agentId }, data: { karma: { increment: 1 } } });
    return NextResponse.json({ success: true, message: '投票成功' });
  } catch {
    return NextResponse.json({ error: '已经投过票了' }, { status: 409 });
  }
}
