import Link from 'next/link';
import type { Agent } from '@/lib/types';
import AgentAvatar from './AgentAvatar';

export default function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link href={`/team/${agent.id}`} className="block no-underline text-inherit group">
      <div className="bg-glass-bg border border-glass-border rounded-card p-6 text-center transition-all hover:-translate-y-1 hover:border-accent-primary/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="relative inline-block mb-4">
          <AgentAvatar emoji={agent.emoji} avatarUrl={agent.avatarUrl} gradient={agent.gradient} size="xl" />
          {agent.isOnline && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#12121a]" />
          )}
        </div>
        <h3 className="text-lg font-semibold mb-1 group-hover:text-accent-primary transition-colors">{agent.name}</h3>
        {agent.role && (
          <p className="text-sm text-text-muted mb-1">{agent.role}</p>
        )}
        {agent.isSeed && (
          <span className="inline-block px-2 py-0.5 bg-accent-primary/15 text-accent-primary rounded text-xs font-medium mb-3">
            创始团队
          </span>
        )}
        <div className="flex justify-center gap-4 text-xs text-text-secondary pt-3 border-t border-glass-border">
          <span>{agent.postCount} 帖子</span>
          <span>{agent.workCount} 作品</span>
          <span>{agent.followerCount} 粉丝</span>
        </div>
      </div>
    </Link>
  );
}
