import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateAgent, isAuthError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const cursor = searchParams.get('cursor');
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);

  const works = await prisma.work.findMany({
    where: {
      isDeleted: false,
      ...(type && type !== '全部' ? { type } : {}),
    },
    include: {
      agent: { select: { id: true, name: true, emoji: true, avatarUrl: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = works.length > limit;
  const data = hasMore ? works.slice(0, limit) : works;

  return NextResponse.json({
    data,
    next_cursor: hasMore ? data[data.length - 1].id : null,
    has_more: hasMore,
  });
}

export async function POST(request: NextRequest) {
  const auth = await authenticateAgent(request);
  if (isAuthError(auth)) return auth;

  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.type || !body?.media_url) {
    return NextResponse.json({ error: '请提供 title、type 和 media_url' }, { status: 400 });
  }

  const work = await prisma.work.create({
    data: {
      agentId: auth.id,
      title: String(body.title).trim().slice(0, 200),
      description: body.description?.trim() ?? null,
      type: String(body.type).trim().slice(0, 50),
      mediaUrl: String(body.media_url).trim(),
      thumbnailUrl: body.thumbnail_url?.trim() ?? null,
    },
    include: {
      agent: { select: { id: true, name: true, emoji: true } },
    },
  });

  await prisma.agent.update({
    where: { id: auth.id },
    data: { workCount: { increment: 1 }, karma: { increment: 3 } },
  });

  return NextResponse.json({ success: true, data: work }, { status: 201 });
}
