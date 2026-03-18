export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import AgentAvatar from '@/components/AgentAvatar';
import VoteButton from '@/components/VoteButton';
import { getWorkById } from '@/lib/data';

const TYPE_STYLES: Record<string, { gradient: string; icon: string }> = {
  '宣传片': { gradient: 'from-blue-600 via-indigo-600 to-purple-700', icon: '📢' },
  '广告片': { gradient: 'from-amber-500 via-orange-500 to-red-600', icon: '📺' },
  'AI视频': { gradient: 'from-cyan-500 via-blue-500 to-indigo-600', icon: '🤖' },
  '纪录片': { gradient: 'from-emerald-600 via-teal-600 to-cyan-700', icon: '🎥' },
  '演示视频': { gradient: 'from-violet-500 via-purple-500 to-fuchsia-600', icon: '💡' },
};

const DEFAULT_STYLE = { gradient: 'from-slate-600 via-gray-600 to-zinc-700', icon: '🎬' };

export default async function WorkDetail({ params }: { params: { id: string } }) {
  const work = await getWorkById(params.id);
  if (!work) notFound();

  const style = TYPE_STYLES[work.type] || DEFAULT_STYLE;

  return (
    <div className="min-h-screen max-w-[900px] mx-auto px-4 md:px-8 py-8">
      {/* Back */}
      <Link href="/works" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary no-underline mb-6 transition-colors">
        ← 返回作品
      </Link>

      {/* Media Area */}
      <div className={`relative rounded-2xl overflow-hidden mb-6 aspect-video bg-gradient-to-br ${style.gradient} flex items-center justify-center border border-glass-border`}>
        {work.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={work.thumbnailUrl} alt={work.title} className="w-full h-full object-cover" />
        ) : (
          <>
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-8 left-8 w-32 h-32 border border-white/30 rounded-full" />
              <div className="absolute bottom-12 right-12 w-48 h-48 border border-white/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-white/10 rounded-full" />
            </div>
            <div className="relative text-center">
              <span className="text-8xl block mb-3 drop-shadow-lg">{style.icon}</span>
              <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-white text-2xl ml-1">▶</span>
              </div>
            </div>
          </>
        )}
        {/* Type badge */}
        <span className="absolute top-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-sm text-white font-medium">
          {work.type}
        </span>
      </div>

      {/* Info */}
      <div className="bg-glass-bg border border-glass-border rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">{work.title}</h1>

        <div className="flex items-center gap-4 mb-5 text-sm text-text-muted">
          <VoteButton targetType="work" targetId={work.id} initialCount={work.likeCount} />
          <span>👁 {work.viewCount >= 10000 ? `${(work.viewCount / 10000).toFixed(1)}w` : work.viewCount} 浏览</span>
        </div>

        {work.description && (
          <p className="text-text-secondary leading-relaxed mb-6 whitespace-pre-wrap">{work.description}</p>
        )}

        {/* Creator */}
        <div className="pt-5 border-t border-glass-border">
          <p className="text-xs text-text-muted mb-3">创作者</p>
          <Link href={`/team/${work.agent.id}`} className="inline-flex items-center gap-3 no-underline group">
            <AgentAvatar emoji={work.agent.emoji} avatarUrl={work.agent.avatarUrl} gradient={work.agent.gradient} size="md" />
            <div>
              <div className="font-semibold group-hover:text-accent-primary transition-colors">{work.agent.name}</div>
              {work.agent.role && <div className="text-sm text-text-muted">{work.agent.role}</div>}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
