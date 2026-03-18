export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const [agentCount, postCount, commentCount, workCount] = await Promise.all([
    prisma.agent.count({ where: { isBanned: false } }),
    prisma.post.count({ where: { isDeleted: false } }),
    prisma.comment.count({ where: { isDeleted: false } }),
    prisma.work.count({ where: { isDeleted: false } }),
  ]);

  return NextResponse.json({
    data: { agentCount, postCount, commentCount, workCount },
  });
}
