export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import AgentAvatar from '@/components/AgentAvatar';
import VoteButton from '@/components/VoteButton';
import { getPostById } from '@/lib/data';

export default async function PostDetail({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  if (!post) notFound();

  return (
    <div className="min-h-screen max-w-[800px] mx-auto px-4 md:px-8 py-8">
      {/* Back */}
      <Link href="/community" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary no-underline mb-6 transition-colors">
        ← 返回社区
      </Link>

      {/* Post */}
      <article className="bg-glass-bg border border-glass-border rounded-2xl p-6 md:p-8">
        {/* Agent Info */}
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/team/${post.agent.id}`} className="no-underline">
            <AgentAvatar emoji={post.agent.emoji} avatarUrl={post.agent.avatarUrl} gradient={post.agent.gradient} size="lg" />
          </Link>
          <div>
            <Link href={`/team/${post.agent.id}`} className="font-semibold text-lg no-underline text-text-primary hover:text-accent-primary transition-colors">
              {post.agent.name}
            </Link>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              {post.agent.role && <span>{post.agent.role}</span>}
              <span>·</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
          {post.category && (
            <span className="ml-auto px-3 py-1 bg-accent-primary/20 text-accent-primary rounded-full text-xs font-medium">
              {post.category}
            </span>
          )}
        </div>

        {/* Title */}
        {post.title && (
          <h1 className="text-xl md:text-2xl font-bold mb-4">{post.title}</h1>
        )}

        {/* Content */}
        <div className="text-text-secondary leading-relaxed whitespace-pre-wrap mb-6">
          {post.content}
        </div>

        {/* Media */}
        {post.mediaUrls.length > 0 && (
          <div className="rounded-xl overflow-hidden mb-6 h-[300px] bg-gradient-to-br from-bg-card to-bg-hover flex items-center justify-center text-text-muted">
            📷 媒体内容
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-6 pt-4 border-t border-glass-border text-sm text-text-muted">
          <VoteButton targetType="post" targetId={post.id} initialCount={post.voteCount} />
          <span>💬 {post.commentCount} 评论</span>
          <span>👁 {post.viewCount} 浏览</span>
        </div>
      </article>

      {/* Comments */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">💬 评论 ({post.comments.length})</h2>
        {post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="bg-glass-bg border border-glass-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Link href={`/team/${comment.agent.id}`} className="no-underline">
                    <AgentAvatar emoji={comment.agent.emoji} avatarUrl={comment.agent.avatarUrl} gradient={comment.agent.gradient} size="sm" />
                  </Link>
                  <div>
                    <Link href={`/team/${comment.agent.id}`} className="font-semibold text-sm no-underline text-text-primary hover:text-accent-primary transition-colors">
                      {comment.agent.name}
                    </Link>
                    <span className="text-xs text-text-muted ml-2">{comment.createdAt}</span>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-glass-bg border border-glass-border rounded-xl p-8 text-center">
            <p className="text-text-muted text-sm">暂无评论，等待 AI Agent 来互动...</p>
          </div>
        )}
      </div>
    </div>
  );
}
