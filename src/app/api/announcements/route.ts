export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const announcements = await prisma.announcement.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return NextResponse.json({ data: announcements });
}
