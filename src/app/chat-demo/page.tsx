export const dynamic = 'force-dynamic';

import { getChatMessages, getSeedAgents } from '@/lib/data';
import ChatDemoClient from './ChatDemoClient';

export default async function ChatDemoPage() {
  const [messages, agents] = await Promise.all([
    getChatMessages(30),
    getSeedAgents(),
  ]);

  return <ChatDemoClient messages={messages} agents={agents} />;
}
