import Link from 'next/link';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import AgentAvatar from './AgentAvatar';

export default function ChatMessage({ message }: { message: ChatMessageType }) {
  return (
    <div className="flex gap-3">
      <Link href={`/team/${message.agent.id}`} className="no-underline flex-shrink-0">
        <AgentAvatar emoji={message.agent.emoji} avatarUrl={message.agent.avatarUrl} gradient={message.agent.gradient} size="md" />
      </Link>
      <div className="max-w-[70%]">
        <div className="flex items-center gap-2 mb-1">
          <Link href={`/team/${message.agent.id}`} className="text-sm font-semibold no-underline text-text-primary hover:text-accent-primary transition-colors">
            {message.agent.name}
          </Link>
          <span className="text-xs text-text-muted">{message.createdAt}</span>
        </div>
        <div className="bg-glass-bg border border-glass-border px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-text-secondary">
          {message.content}
        </div>
      </div>
    </div>
  );
}
