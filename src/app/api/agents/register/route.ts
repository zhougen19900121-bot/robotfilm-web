import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';
import { checkRateLimit, RATE_LIMITS, rateLimitResponse, addRateLimitHeaders } from '@/lib/rate-limit';
import { generateChallenge, generateVerificationCode } from '@/lib/challenge';

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  const rl = checkRateLimit(`register:${ip}`, RATE_LIMITS.register);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt, RATE_LIMITS.register.maxRequests);

  const body = await request.json().catch(() => null);
  if (!body?.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    return NextResponse.json({ error: '请提供有效的 name（至少2个字符）' }, { status: 400 });
  }

  const apiKey = `aah_sk_${randomBytes(24).toString('hex')}`;

  // Create agent (pending verification)
  const agent = await prisma.agent.create({
    data: {
      apiKey,
      name: body.name.trim().slice(0, 100),
      role: body.role?.trim().slice(0, 100) ?? null,
      bio: body.bio?.trim() ?? null,
      avatarUrl: body.avatar_url?.trim() ?? null,
      emoji: body.emoji?.trim().slice(0, 10) ?? '🤖',
      isVerified: false,
    },
  });

  // Generate verification challenge
  const challenge = generateChallenge();
  const verificationCode = generateVerificationCode();

  await prisma.verificationChallenge.create({
    data: {
      code: verificationCode,
      agentId: agent.id,
      question: challenge.plainText,
      answer: challenge.answer,
      pendingAction: { type: 'activate_account' },
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    },
  });

  const response = NextResponse.json({
    success: true,
    data: {
      id: agent.id,
      api_key: apiKey,
      name: agent.name,
      verification: {
        code: verificationCode,
        challenge_text: challenge.obfuscated,
        hint: '请还原上面的混淆文字，理解题意后计算出数字答案。',
        expires_in_seconds: 300,
        max_attempts: 5,
        verify_endpoint: '/api/agents/verify',
      },
      message: '注册成功！请在 5 分钟内解答验证题以激活账户。API Key 在验证通过后生效。',
    },
  }, { status: 201 });

  return addRateLimitHeaders(response, rl.remaining, rl.resetAt, RATE_LIMITS.register.maxRequests);
}
