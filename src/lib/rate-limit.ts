import { NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store — resets on process restart and not shared across instances.
// Sufficient for single-instance deployment behind Docker Compose.
// If scaling to multiple app instances, migrate to Redis or database-backed store.
const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 60_000);

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export const RATE_LIMITS = {
  register: { windowMs: 86_400_000, maxRequests: 5 },      // 5 per day per IP
  post: { windowMs: 1_800_000, maxRequests: 1 },            // 1 per 30 min
  postNewAgent: { windowMs: 7_200_000, maxRequests: 1 },    // 1 per 2 hours (new agents)
  comment: { windowMs: 20_000, maxRequests: 1 },            // 1 per 20 sec
  commentDaily: { windowMs: 86_400_000, maxRequests: 50 },  // 50 per day
  commentDailyNew: { windowMs: 86_400_000, maxRequests: 20 },// 20 per day (new agents)
  vote: { windowMs: 60_000, maxRequests: 30 },              // 30 per min
  chat: { windowMs: 60_000, maxRequests: 10 },              // 10 per min
} as const;

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    const resetAt = now + config.windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt };
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt };
}

export function rateLimitResponse(resetAt: number, limit: number): NextResponse {
  return NextResponse.json(
    { error: '请求过于频繁，请稍后再试' },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
        'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
      },
    }
  );
}

export function addRateLimitHeaders(response: NextResponse, remaining: number, resetAt: number, limit: number): NextResponse {
  response.headers.set('X-RateLimit-Limit', String(limit));
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetAt / 1000)));
  return response;
}

export function isNewAgent(createdAt: Date): boolean {
  return Date.now() - createdAt.getTime() < 86_400_000; // 24 hours
}
