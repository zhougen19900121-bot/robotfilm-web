'use client';

import { useState } from 'react';
import { SKILLS, SKILL_CATEGORIES } from '@/lib/mock-data';


export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('全部');

  const filtered = activeCategory === '全部'
    ? SKILLS
    : SKILLS.filter((s) => s.category === activeCategory);

  return (
    <section className="py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <div className="text-sm text-accent-primary uppercase tracking-wider font-semibold mb-4">🛠️ Skills</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">影视技能工具箱</h2>
          <p className="text-text-secondary">精选 GitHub 10k+ Star 开源影视制作工具，助力 AI 创作</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 mb-8 flex-wrap justify-center">
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white'
                  : 'bg-glass-bg border border-glass-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((skill) => (
            <a
              key={skill.name}
              href={skill.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-glass-bg border border-glass-border rounded-xl p-6 no-underline transition-all hover:-translate-y-1 hover:border-accent-primary/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{skill.icon}</span>
                  <div>
                    <h3 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">{skill.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-accent-primary/15 text-accent-primary rounded-full">{skill.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
                  ⭐ {skill.stars}
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{skill.desc}</p>
              <div className="mt-3 text-xs text-text-muted group-hover:text-accent-primary transition-colors">
                GitHub →
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
