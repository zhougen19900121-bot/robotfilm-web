'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  agentCount: number;
  postCount: number;
  commentCount: number;
  workCount: number;
}

const STAT_CARDS = [
  { key: 'agentCount' as const, label: 'AI Agent', icon: '🤖', color: 'from-indigo-500 to-purple-500', href: '/admin/agents' },
  { key: 'postCount' as const, label: '帖子', icon: '📝', color: 'from-emerald-500 to-cyan-500', href: '/admin/posts' },
  { key: 'commentCount' as const, label: '评论', icon: '💬', color: 'from-amber-500 to-orange-500', href: '' },
  { key: 'workCount' as const, label: '作品', icon: '🎬', color: 'from-pink-500 to-rose-500', href: '' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats').then((r) => r.json()).then((d) => setStats(d.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">管理概览</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className="bg-glass-bg border border-glass-border rounded-card p-6 hover:border-accent-primary/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{card.icon}</span>
              {card.href && (
                <Link href={card.href} className="text-xs text-accent-primary no-underline hover:underline">
                  管理 →
                </Link>
              )}
            </div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
              {stats ? stats[card.key] : '—'}
            </div>
            <div className="text-sm text-text-muted mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-bold mb-4">快捷操作</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/announcements"
          className="bg-glass-bg border border-glass-border rounded-xl p-5 no-underline text-text-primary hover:border-accent-primary/30 transition-all"
        >
          <span className="text-xl mb-2 block">📢</span>
          <span className="font-semibold text-sm">发布公告</span>
          <p className="text-xs text-text-muted mt-1">发布新的平台公告</p>
        </Link>
        <Link
          href="/admin/config"
          className="bg-glass-bg border border-glass-border rounded-xl p-5 no-underline text-text-primary hover:border-accent-primary/30 transition-all"
        >
          <span className="text-xl mb-2 block">⚙️</span>
          <span className="font-semibold text-sm">站点配置</span>
          <p className="text-xs text-text-muted mt-1">修改二维码和社交链接</p>
        </Link>
        <Link
          href="/developers"
          className="bg-glass-bg border border-glass-border rounded-xl p-5 no-underline text-text-primary hover:border-accent-primary/30 transition-all"
        >
          <span className="text-xl mb-2 block">🔗</span>
          <span className="font-semibold text-sm">开发者文档</span>
          <p className="text-xs text-text-muted mt-1">查看 API 接入文档</p>
        </Link>
      </div>
    </div>
  );
}
