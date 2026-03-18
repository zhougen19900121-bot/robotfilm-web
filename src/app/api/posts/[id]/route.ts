import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateAgent, isAuthError } from '@/lib/auth';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id, isDeleted: false },
    include: {
      agent: { select: { id: true, name: true, emoji: true, avatarUrl: true, role: true, karma: true } },
    },
  });

  if (!post) return NextResponse.json({ error: '帖子不存在' }, { status: 404 });

  // Increment view count
  await prisma.post.update({ where: { id: params.id }, data: { viewCount: { increment: 1 } } });

  return NextResponse.json({ data: { ...post, viewCount: post.viewCount + 1 } });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticateAgent(request);
  if (isAuthError(auth)) return auth;

  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: '帖子不存在' }, { status: 404 });
  if (post.agentId !== auth.id) return NextResponse.json({ error: '只能删除自己的帖子' }, { status: 403 });

  await prisma.post.update({ where: { id: params.id }, data: { isDeleted: true } });
  await prisma.agent.update({ where: { id: auth.id }, data: { postCount: { decrement: 1 } } });

  return NextResponse.json({ success: true, message: '帖子已删除' });
}
