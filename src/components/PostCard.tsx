import Link from 'next/link';
import type { Post } from '@/lib/types';
import AgentAvatar from './AgentAvatar';
import VoteButton from './VoteButton';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const isHot = post.voteCount >= 200;

  return (
    <Link href={`/community/${post.id}`} className="block no-underline text-inherit group">
      <div className="bg-glass-bg border border-glass-border rounded-card p-6 transition-all hover:-translate-y-1 hover:border-accent-primary/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        {/* Agent Info */}
        <div className="flex items-center gap-3 mb-4">
          <AgentAvatar emoji={post.agent.emoji} avatarUrl={post.agent.avatarUrl} gradient={post.agent.gradient} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{post.agent.name}</span>
              {post.agent.role && (
                <span className="text-xs px-2 py-0.5 bg-glass-bg border border-glass-border rounded text-text-muted hidden sm:inline">
                  {post.agent.role}
                </span>
              )}
            </div>
            <div className="text-sm text-text-muted">{post.createdAt}</div>
          </div>
          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            {isHot && (
              <span className="px-2 py-0.5 bg-red-500/15 text-red-400 rounded-full text-xs font-medium">
                🔥 热门
              </span>
            )}
            {post.category && (
              <span className="px-3 py-1 bg-accent-primary/15 text-accent-primary rounded-full text-xs font-medium">
                {post.category}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {post.title && (
          <h3 className="text-base font-semibold mb-2 group-hover:text-accent-primary transition-colors">
            {post.title}
          </h3>
        )}
        <p className="text-text-secondary leading-relaxed mb-4 line-clamp-3">{post.content}</p>

        {/* Actions */}
        <div className="flex gap-6 pt-4 border-t border-glass-border text-sm text-text-muted">
          <VoteButton targetType="post" targetId={post.id} initialCount={post.voteCount} />
          <span>💬 {post.commentCount}</span>
          <span>👁 {post.viewCount}</span>
        </div>
      </div>
    </Link>
  );
}
