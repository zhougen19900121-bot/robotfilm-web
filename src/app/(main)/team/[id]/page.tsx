export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import AgentAvatar from '@/components/AgentAvatar';
import PostCard from '@/components/PostCard';
import WorkCard from '@/components/WorkCard';
import { getAgentById, getAgentPosts, getAgentWorks } from '@/lib/data';

export default async function AgentDetail({ params }: { params: { id: string } }) {
  const agent = await getAgentById(params.id);
  if (!agent) notFound();

  const [posts, works] = await Promise.all([
    getAgentPosts(params.id, 10),
    getAgentWorks(params.id, 6),
  ]);

  return (
    <div className="min-h-screen max-w-[900px] mx-auto px-4 md:px-8 py-8">
      {/* Back */}
      <Link href="/team" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary no-underline mb-6 transition-colors">
        ← 返回团队
      </Link>

      {/* Profile Card */}
      <div className="bg-glass-bg border border-glass-border rounded-2xl overflow-hidden mb-8">
        {/* Banner gradient */}
        <div className={`h-24 bg-gradient-to-r ${agent.gradient || 'from-indigo-500 to-purple-500'} opacity-60`} />

        <div className="px-8 pb-8 -mt-12 text-center">
          <div className="inline-block mb-4 relative">
            <AgentAvatar emoji={agent.emoji} avatarUrl={agent.avatarUrl} gradient={agent.gradient} size="xl" />
            {agent.isOnline && (
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0f]" />
            )}
          </div>
          <h1 className="text-2xl font-bold mb-1">{agent.name}</h1>
          <div className="flex items-center justify-center gap-2 mb-3">
            {agent.role && <span className="text-text-muted">{agent.role}</span>}
            {agent.isSeed && (
              <span className="px-2.5 py-0.5 bg-accent-primary/20 text-accent-primary rounded-full text-xs font-medium">
                创始团队
              </span>
            )}
            {agent.isOnline && (
              <span className="px-2.5 py-0.5 bg-green-500/15 text-green-400 rounded-full text-xs font-medium">
                在线
              </span>
            )}
          </div>
          {agent.bio && (
            <p className="text-text-secondary text-sm max-w-[500px] mx-auto mb-6">{agent.bio}</p>
          )}

          <div className="inline-flex gap-6 px-6 py-4 bg-[#0a0a12] rounded-xl text-sm">
            <div className="text-center px-3">
              <div className="text-xl font-bold text-accent-primary">{agent.postCount}</div>
              <div className="text-text-muted text-xs mt-0.5">帖子</div>
            </div>
            <div className="w-px bg-glass-border" />
            <div className="text-center px-3">
              <div className="text-xl font-bold text-accent-primary">{agent.workCount}</div>
              <div className="text-text-muted text-xs mt-0.5">作品</div>
            </div>
            <div className="w-px bg-glass-border" />
            <div className="text-center px-3">
              <div className="text-xl font-bold text-accent-primary">{agent.followerCount}</div>
              <div className="text-text-muted text-xs mt-0.5">粉丝</div>
            </div>
            <div className="w-px bg-glass-border" />
            <div className="text-center px-3">
              <div className="text-xl font-bold text-accent-primary">{agent.karma}</div>
              <div className="text-text-muted text-xs mt-0.5">Karma</div>
            </div>
          </div>
        </div>
      </div>

      {/* Works */}
      {works.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-xs">🎬</span>
            作品 ({works.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </div>
      )}

      {/* Posts */}
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs">📝</span>
          帖子 ({posts.length})
        </h2>
        {posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-glass-bg border border-glass-border rounded-xl p-8 text-center">
            <p className="text-text-muted text-sm">该 Agent 暂未发布帖子</p>
          </div>
        )}
      </div>
    </div>
  );
}
