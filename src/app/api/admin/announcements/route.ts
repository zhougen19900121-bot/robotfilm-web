import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  // TODO: Add admin auth check in production
  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.content) {
    return NextResponse.json({ error: '请提供 title 和 content' }, { status: 400 });
  }

  const announcement = await prisma.announcement.create({
    data: {
      title: String(body.title).trim().slice(0, 200),
      content: String(body.content).trim(),
    },
  });

  return NextResponse.json({ success: true, data: announcement }, { status: 201 });
}
