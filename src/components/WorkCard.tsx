import Link from 'next/link';
import type { Work } from '@/lib/types';
import VoteButton from './VoteButton';

const TYPE_STYLES: Record<string, { gradient: string; icon: string }> = {
  '宣传片': { gradient: 'from-blue-600 via-indigo-600 to-purple-700', icon: '📢' },
  '广告片': { gradient: 'from-amber-500 via-orange-500 to-red-600', icon: '📺' },
  'AI视频': { gradient: 'from-cyan-500 via-blue-500 to-indigo-600', icon: '🤖' },
  '纪录片': { gradient: 'from-emerald-600 via-teal-600 to-cyan-700', icon: '🎥' },
  '演示视频': { gradient: 'from-violet-500 via-purple-500 to-fuchsia-600', icon: '💡' },
};

const DEFAULT_STYLE = { gradient: 'from-slate-600 via-gray-600 to-zinc-700', icon: '🎬' };

export default function WorkCard({ work }: { work: Work }) {
  const style = TYPE_STYLES[work.type] || DEFAULT_STYLE;

  return (
    <Link href={`/works/${work.id}`} className="block no-underline text-inherit group">
      <div className="bg-glass-bg border border-glass-border rounded-card overflow-hidden transition-all hover:-translate-y-1 hover:border-accent-primary/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        {/* Thumbnail */}
        <div className={`relative h-[180px] bg-gradient-to-br ${style.gradient} flex items-center justify-center overflow-hidden`}>
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 border border-white/30 rounded-full" />
            <div className="absolute bottom-6 right-6 w-32 h-32 border border-white/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/10 rounded-full" />
          </div>
          {/* Icon + play */}
          <div className="relative text-center">
            <span className="text-5xl block mb-1 drop-shadow-lg">{style.icon}</span>
            <div className="w-10 h-10 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mt-2 group-hover:bg-white/30 transition-colors">
              <span className="text-white text-sm ml-0.5">▶</span>
            </div>
          </div>
          {/* Type badge */}
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white font-medium">
            {work.type}
          </span>
          {/* View count */}
          <span className="absolute top-3 right-3 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white/80">
            👁 {work.viewCount >= 10000 ? `${(work.viewCount / 10000).toFixed(1)}w` : work.viewCount}
          </span>
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="text-base font-semibold mb-2 group-hover:text-accent-primary transition-colors line-clamp-1">{work.title}</h3>
          {work.description && (
            <p className="text-text-muted text-sm mb-3 line-clamp-2">{work.description}</p>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">by {work.agent.name}</span>
            <VoteButton targetType="work" targetId={work.id} initialCount={work.likeCount} />
          </div>
        </div>
      </div>
    </Link>
  );
}
