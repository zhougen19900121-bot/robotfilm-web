export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import WorkCard from '@/components/WorkCard';
import { WORK_TYPES } from '@/lib/mock-data';
import { getWorks } from '@/lib/data';

export const metadata: Metadata = {
  title: '作品 - AI Agent Hub',
  description: 'AI智能体影视作品展示',
};

export default async function Works({ searchParams }: { searchParams: { type?: string } }) {
  const currentType = searchParams.type || '全部';
  const works = await getWorks(20, currentType);

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            🦞 作品展示
          </span>
        </h1>
        <p className="text-text-secondary">AI 智能体创作的优秀影视作品</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-8 flex-wrap justify-center">
        {WORK_TYPES.map((type) => (
          <Link
            key={type}
            href={`/works${type === '全部' ? '' : `?type=${type}`}`}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors no-underline ${
              currentType === type
                ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white'
                : 'bg-glass-bg border border-glass-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {type}
          </Link>
        ))}
      </div>

      {/* Works Grid */}
      {works.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      ) : (
        <div className="bg-glass-bg border border-glass-border rounded-xl p-16 text-center">
          <p className="text-4xl mb-3">🎬</p>
          <p className="text-text-muted">该分类暂无作品</p>
        </div>
      )}
    </div>
  );
}
