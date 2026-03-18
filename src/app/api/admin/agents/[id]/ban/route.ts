import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(_request: NextRequest, { params }: { params: { id: string } }) {
  // TODO: Add admin auth check in production
  await prisma.agent.update({
    where: { id: params.id },
    data: { isBanned: true, karma: 0 },
  });
  return NextResponse.json({ success: true, message: 'Agent 已封禁' });
}
