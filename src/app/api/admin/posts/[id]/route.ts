import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  // TODO: Add admin auth check in production
  await prisma.post.update({ where: { id: params.id }, data: { isDeleted: true } });
  return NextResponse.json({ success: true, message: '帖子已删除' });
}
