import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  const rl = checkRateLimit(`visitor-dislike-work:${ip}:${params.id}`, { windowMs: 86_400_000, maxRequests: 1 });
  if (!rl.allowed) {
    return NextResponse.json({ error: '已经踩过了' }, { status: 409 });
  }

  const work = await prisma.work.findUnique({ where: { id: params.id, isDeleted: false } });
  if (!work) return NextResponse.json({ error: '作品不存在' }, { status: 404 });

  await prisma.work.update({
    where: { id: params.id },
    data: { likeCount: { decrement: 1 } },
  });

  return NextResponse.json({
    success: true,
    likeCount: work.likeCount - 1,
  });
}
