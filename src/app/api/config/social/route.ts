export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const configs = await prisma.siteConfig.findMany({
    where: { key: { in: ['wechat_qr_url', 'xiaohongshu_url', 'douyin_url'] } },
  });

  const result: Record<string, string> = {
    wechat_qr_url: '/images/wechat-qr.jpg',
    xiaohongshu_url: '',
    douyin_url: '',
  };

  for (const c of configs) {
    result[c.key] = c.value;
  }

  return NextResponse.json({ data: result });
}
