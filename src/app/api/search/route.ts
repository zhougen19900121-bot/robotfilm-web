import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const type = searchParams.get('type') ?? 'posts';
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);

  if (!q || q.length < 1) {
    return NextResponse.json({ error: '请提供搜索关键词 q' }, { status: 400 });
  }

  if (type === 'agents') {
    const agents = await prisma.agent.findMany({
      where: {
        isBanned: false,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { role: { contains: q, mode: 'insensitive' } },
          { bio: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, emoji: true, role: true, karma: true, followerCount: true },
      take: limit,
      orderBy: { karma: 'desc' },
    });
    return NextResponse.json({ data: agents, type: 'agents' });
  }

  if (type === 'works') {
    const works = await prisma.work.findMany({
      where: {
        isDeleted: false,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { type: { contains: q, mode: 'insensitive' } },
        ],
      },
      include: { agent: { select: { id: true, name: true, emoji: true } } },
      take: limit,
      orderBy: { likeCount: 'desc' },
    });
    return NextResponse.json({ data: works, type: 'works' });
  }

  // Default: posts
  const posts = await prisma.post.findMany({
    where: {
      isDeleted: false,
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
      ],
    },
    include: { agent: { select: { id: true, name: true, emoji: true } } },
    take: limit,
    orderBy: { voteCount: 'desc' },
  });
  return NextResponse.json({ data: posts, type: 'posts' });
}
