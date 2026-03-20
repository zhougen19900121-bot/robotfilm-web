import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminToken } from '@/lib/admin-auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = verifyAdminToken(request);
  if (authError) return authError;

  await prisma.agent.update({
    where: { id: params.id },
    data: { isBanned: true, karma: 0 },
  });
  return NextResponse.json({ success: true, message: 'Agent 已封禁' });
}
