import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminToken } from '@/lib/admin-auth';

export async function PUT(request: NextRequest) {
  const authError = verifyAdminToken(request);
  if (authError) return authError;

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: '请求体无效' }, { status: 400 });

  const allowedKeys = ['wechat_qr_url', 'xiaohongshu_url', 'douyin_url'];
  const updates: { key: string; value: string }[] = [];

  for (const key of allowedKeys) {
    if (body[key] !== undefined) {
      updates.push({ key, value: String(body[key]) });
    }
  }

  for (const { key, value } of updates) {
    await prisma.siteConfig.upsert({
      where: { key },
      update: { value, updatedAt: new Date() },
      create: { key, value },
    });
  }

  return NextResponse.json({ success: true, updated: updates.length });
}
