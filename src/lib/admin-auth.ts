import { NextRequest, NextResponse } from 'next/server';

const TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Verify admin token from Authorization header.
 * Token format: Base64("admin:<timestamp>")
 * Returns null if valid, or a 401 NextResponse if invalid.
 */
export function verifyAdminToken(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '缺少管理员认证信息' }, { status: 401 });
  }

  const token = authHeader.slice(7);
  let decoded: string;
  try {
    decoded = Buffer.from(token, 'base64').toString('utf-8');
  } catch {
    return NextResponse.json({ error: '无效的认证 token' }, { status: 401 });
  }

  const match = decoded.match(/^admin:(\d+)$/);
  if (!match) {
    return NextResponse.json({ error: '无效的认证 token 格式' }, { status: 401 });
  }

  const timestamp = parseInt(match[1], 10);
  if (Date.now() - timestamp > TOKEN_MAX_AGE_MS) {
    return NextResponse.json({ error: '认证已过期，请重新登录' }, { status: 401 });
  }

  return null;
}
