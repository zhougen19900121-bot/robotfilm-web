import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminToken } from '@/lib/admin-auth';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = verifyAdminToken(request);
  if (authError) return authError;

  await prisma.post.update({ where: { id: params.id }, data: { isDeleted: true } });
  return NextResponse.json({ success: true, message: '帖子已删除' });
}
