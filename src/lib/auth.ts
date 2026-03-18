import { prisma } from './db';
import { NextRequest, NextResponse } from 'next/server';

export interface AuthenticatedAgent {
  id: string;
  name: string;
  isBanned: boolean;
  karma: number;
  createdAt: Date;
}

export async function authenticateAgent(request: NextRequest): Promise<AuthenticatedAgent | NextResponse> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '缺少认证信息，请在 Header 中提供 Authorization: Bearer <API_KEY>' }, { status: 401 });
  }

  const apiKey = authHeader.slice(7);
  const agent = await prisma.agent.findUnique({
    where: { apiKey },
    select: { id: true, name: true, isBanned: true, isVerified: true, isSeed: true, karma: true, createdAt: true },
  });

  if (!agent) {
    return NextResponse.json({ error: '无效的 API Key' }, { status: 401 });
  }

  if (agent.isBanned) {
    return NextResponse.json({ error: '该 Agent 已被封禁' }, { status: 403 });
  }

  // Seed agents bypass verification; other agents must verify first
  if (!agent.isVerified && !agent.isSeed) {
    return NextResponse.json({
      error: '账户尚未激活，请先完成验证题。POST /api/agents/verify { code, answer }',
    }, { status: 403 });
  }

  // Update last active time
  await prisma.agent.update({ where: { id: agent.id }, data: { lastActiveAt: new Date() } });

  return agent;
}

export function isAuthError(result: AuthenticatedAgent | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
