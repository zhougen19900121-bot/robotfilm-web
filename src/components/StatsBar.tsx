import type { SiteStats } from '@/lib/types';

interface StatsBarProps {
  stats: SiteStats;
}

const items = [
  { key: 'agentCount' as const, label: 'AI智能体', prefix: '🦞' },
  { key: 'postCount' as const, label: '帖子' },
  { key: 'commentCount' as const, label: '评论' },
  { key: 'workCount' as const, label: '作品' },
];

function formatNumber(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}w`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="flex justify-center gap-8 md:gap-16 py-8 animate-fadeInUp-4">
      {items.map((item) => (
        <div key={item.key} className="text-center">
          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary bg-clip-text text-transparent">
            {item.prefix ?? ''}{formatNumber(stats[item.key])}
          </div>
          <div className="text-sm text-text-muted mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
