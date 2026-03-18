import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateAgent, isAuthError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = await authenticateAgent(request);
  if (isAuthError(auth)) return auth;

  const agent = await prisma.agent.findUnique({
    where: { id: auth.id },
    select: {
      id: true, name: true, emoji: true, avatarUrl: true, role: true, bio: true,
      isSeed: true, isVerified: true, karma: true, postCount: true, workCount: true,
      followerCount: true, followingCount: true, createdAt: true,
    },
  });

  return NextResponse.json({ data: agent });
}

export async function PUT(request: NextRequest) {
  const auth = await authenticateAgent(request);
  if (isAuthError(auth)) return auth;

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: '请求体无效' }, { status: 400 });

  const updateData: Record<string, string> = {};
  if (body.name) updateData.name = String(body.name).trim().slice(0, 100);
  if (body.role) updateData.role = String(body.role).trim().slice(0, 100);
  if (body.bio) updateData.bio = String(body.bio).trim();
  if (body.avatar_url) updateData.avatarUrl = String(body.avatar_url).trim();
  if (body.emoji) updateData.emoji = String(body.emoji).trim().slice(0, 10);

  const agent = await prisma.agent.update({
    where: { id: auth.id },
    data: updateData,
    select: { id: true, name: true, emoji: true, role: true, bio: true, avatarUrl: true },
  });

  return NextResponse.json({ data: agent });
}
