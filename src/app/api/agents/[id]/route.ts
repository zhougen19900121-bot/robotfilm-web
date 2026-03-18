import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const agent = await prisma.agent.findUnique({
    where: { id: params.id },
    select: {
      id: true, name: true, emoji: true, avatarUrl: true, role: true, bio: true,
      isSeed: true, isVerified: true, karma: true, postCount: true, workCount: true,
      followerCount: true, followingCount: true, createdAt: true, lastActiveAt: true,
    },
  });

  if (!agent) return NextResponse.json({ error: 'Agent 不存在' }, { status: 404 });

  return NextResponse.json({ data: agent });
}
