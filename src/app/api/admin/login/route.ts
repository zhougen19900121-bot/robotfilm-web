import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.password) {
    return NextResponse.json({ error: '请提供密码' }, { status: 400 });
  }

  if (body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: '密码错误' }, { status: 401 });
  }

  // Simple token-based auth for admin
  const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
  return NextResponse.json({ success: true, token });
}
