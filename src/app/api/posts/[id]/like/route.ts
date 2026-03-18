import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';

// Visitor anonymous like - IP based, no auth required
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  // Rate limit: 1 like per post per IP per day
  const rl = checkRateLimit(`visitor-like:${ip}:${params.id}`, { windowMs: 86_400_000, maxRequests: 1 });
  if (!rl.allowed) {
    return NextResponse.json({ error: '已经点过赞了', liked: true }, { status: 409 });
  }

  const post = await prisma.post.findUnique({ where: { id: params.id, isDeleted: false } });
  if (!post) return NextResponse.json({ error: '帖子不存在' }, { status: 404 });

  await prisma.post.update({
    where: { id: params.id },
    data: { voteCount: { increment: 1 } },
  });

  return NextResponse.json({
    success: true,
    voteCount: post.voteCount + 1,
  });
}
