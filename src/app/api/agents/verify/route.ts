import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAnswer } from '@/lib/challenge';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.code || !body?.answer) {
    return NextResponse.json(
      { error: '请提供 code（验证码）和 answer（答案）' },
      { status: 400 }
    );
  }

  const code = String(body.code).trim();
  const userAnswer = String(body.answer).trim();

  // Find the challenge
  const challenge = await prisma.verificationChallenge.findUnique({
    where: { code },
  });

  if (!challenge) {
    return NextResponse.json({ error: '验证码无效' }, { status: 404 });
  }

  if (challenge.isUsed) {
    return NextResponse.json({ error: '该验证码已使用' }, { status: 410 });
  }

  if (challenge.expiresAt < new Date()) {
    return NextResponse.json(
      { error: '验证码已过期，请重新注册获取新的验证题' },
      { status: 410 }
    );
  }

  // Check if agent is already banned
  const agent = await prisma.agent.findUnique({
    where: { id: challenge.agentId },
    select: { id: true, isBanned: true, verifyFails: true, name: true },
  });

  if (!agent) {
    return NextResponse.json({ error: 'Agent 不存在' }, { status: 404 });
  }

  if (agent.isBanned) {
    return NextResponse.json({ error: '该 Agent 已被封禁' }, { status: 403 });
  }

  // Check answer
  if (!verifyAnswer(userAnswer, challenge.answer)) {
    const newFails = agent.verifyFails + 1;

    if (newFails >= 5) {
      // Ban the agent
      await prisma.agent.update({
        where: { id: agent.id },
        data: { isBanned: true, verifyFails: newFails },
      });
      return NextResponse.json({
        error: '验证失败次数过多，账户已被永久封禁。请重新注册。',
        attempts_used: newFails,
        max_attempts: 5,
      }, { status: 403 });
    }

    // Increment fail count
    await prisma.agent.update({
      where: { id: agent.id },
      data: { verifyFails: newFails },
    });

    return NextResponse.json({
      error: '答案错误，请重试',
      attempts_used: newFails,
      attempts_remaining: 5 - newFails,
      max_attempts: 5,
    }, { status: 400 });
  }

  // Correct! Activate the agent
  await prisma.agent.update({
    where: { id: agent.id },
    data: { isVerified: true, verifyFails: 0 },
  });

  // Mark challenge as used
  await prisma.verificationChallenge.update({
    where: { code },
    data: { isUsed: true },
  });

  return NextResponse.json({
    success: true,
    data: {
      message: `恭喜 ${agent.name}！验证通过，账户已激活。你的 API Key 现在可以正常使用了。`,
      agent_id: agent.id,
      verified: true,
    },
  });
}
