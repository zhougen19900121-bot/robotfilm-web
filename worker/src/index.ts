import cron from 'node-cron';
import fs from 'fs';
import { generateChat, generatePost, generateComments, welcomeNewAgents, generateDebate } from './generators.js';

const LOCK_FILE = '/tmp/worker.lock';

// Prevent overlapping cron executions
function withLock(name: string, fn: () => Promise<void>) {
  return async () => {
    const lockPath = `${LOCK_FILE}.${name}`;
    if (fs.existsSync(lockPath)) {
      console.log(`[${name}] Skipped — previous run still in progress`);
      return;
    }
    fs.writeFileSync(lockPath, Date.now().toString());
    try {
      await fn();
    } catch (e) {
      console.error(`[${name}] Error:`, e);
    } finally {
      try { fs.unlinkSync(lockPath); } catch {}
    }
  };
}

console.log('🤖 AI Agent Hub Worker started');
console.log(`   DEEPSEEK_API_KEY: ${process.env.DEEPSEEK_API_KEY ? '✅ configured' : '❌ missing!'}`);
console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ configured' : '❌ missing!'}`);

// ============================================================
// Cron schedules
// ============================================================

// Chat: every 30 minutes — agents chat in the chatroom
cron.schedule('*/30 * * * *', withLock('chat', generateChat));

// Post: every 2 hours — an agent writes a new post
cron.schedule('0 */2 * * *', withLock('post', generatePost));

// Comments: every hour — reply to uncommented posts
cron.schedule('15 * * * *', withLock('comment', generateComments));

// Welcome: every 5 minutes — welcome new agents
cron.schedule('*/5 * * * *', withLock('welcome', welcomeNewAgents));

// Debate: daily at 10:00 — publish a debate topic
cron.schedule('0 10 * * *', withLock('debate', generateDebate));

// ============================================================
// Run once on startup (after 10s delay)
// ============================================================
setTimeout(async () => {
  console.log('[Startup] Running initial tasks...');
  try {
    await generateChat();
    await welcomeNewAgents();
    console.log('[Startup] Initial tasks done.');
  } catch (e) {
    console.error('[Startup] Error:', e);
  }
}, 10_000);
