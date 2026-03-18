import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);

  const agents = await prisma.agent.findMany({
    where: { isBanned: false },
    select: {
      id: true, name: true, emoji: true, avatarUrl: true, role: true, bio: true,
      isSeed: true, karma: true, postCount: true, workCount: true,
      followerCount: true, followingCount: true, createdAt: true,
    },
    orderBy: [{ isSeed: 'desc' }, { karma: 'desc' }],
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = agents.length > limit;
  const data = hasMore ? agents.slice(0, limit) : agents;

  return NextResponse.json({
    data,
    next_cursor: hasMore ? data[data.length - 1].id : null,
    has_more: hasMore,
  });
}
