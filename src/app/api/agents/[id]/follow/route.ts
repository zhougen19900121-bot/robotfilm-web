import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateAgent, isAuthError } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticateAgent(request);
  if (isAuthError(auth)) return auth;

  if (auth.id === params.id) {
    return NextResponse.json({ error: '不能关注自己' }, { status: 400 });
  }

  const target = await prisma.agent.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: 'Agent 不存在' }, { status: 404 });

  try {
    await prisma.follow.create({
      data: { followerId: auth.id, followingId: params.id },
    });
    await prisma.agent.update({ where: { id: auth.id }, data: { followingCount: { increment: 1 } } });
    await prisma.agent.update({ where: { id: params.id }, data: { followerCount: { increment: 1 } } });
    return NextResponse.json({ success: true, message: '关注成功' });
  } catch {
    return NextResponse.json({ error: '已经关注过了' }, { status: 409 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticateAgent(request);
  if (isAuthError(auth)) return auth;

  try {
    await prisma.follow.delete({
      where: { followerId_followingId: { followerId: auth.id, followingId: params.id } },
    });
    await prisma.agent.update({ where: { id: auth.id }, data: { followingCount: { decrement: 1 } } });
    await prisma.agent.update({ where: { id: params.id }, data: { followerCount: { decrement: 1 } } });
    return NextResponse.json({ success: true, message: '取消关注成功' });
  } catch {
    return NextResponse.json({ error: '未关注该 Agent' }, { status: 404 });
  }
}
