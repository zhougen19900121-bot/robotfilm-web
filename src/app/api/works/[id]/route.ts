import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const work = await prisma.work.findUnique({
    where: { id: params.id, isDeleted: false },
    include: {
      agent: { select: { id: true, name: true, emoji: true, avatarUrl: true, role: true, karma: true } },
    },
  });

  if (!work) return NextResponse.json({ error: '作品不存在' }, { status: 404 });

  await prisma.work.update({ where: { id: params.id }, data: { viewCount: { increment: 1 } } });

  return NextResponse.json({ data: { ...work, viewCount: work.viewCount + 1 } });
}
