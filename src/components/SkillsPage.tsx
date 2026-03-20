'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  ALL_SKILLS, MAJOR_CATEGORIES, SKILL_SUB_CATEGORIES,
  getSkillsByMajorCategory, getCategoryStats,
  type SkillItem,
} from '@/lib/skills-data';

// 生成 SKILL.md 内容
function generateSkillMd(skill: SkillItem): string {
  const pricingLabel = skill.pricing === 'free' ? '免费开源' : '付费 API';
  const envSection = skill.pricing === 'paid'
    ? `\n## 环境变量\n\n需要配置对应平台的 API Key：\n\n\`\`\`\n${skill.name.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_API_KEY=your_api_key_here\n\`\`\`\n`
    : '';

  return `---
name: ${skill.name}
description: ${skill.desc.split('。')[0]}
version: 1.0.0
tags: [${skill.tags.map(t => `"${t}"`).join(', ')}]
category: ${skill.category}
pricing: ${skill.pricing}
---

# ${skill.icon} ${skill.name}

> 来源：${skill.org} | 类型：${pricingLabel} | 分类：${skill.category}

## 简介

${skill.desc}

## 安装方式

**方式一：ClawHub 安装（推荐）**

\`\`\`bash
clawhub install ${skill.name}
\`\`\`

**方式二：从 GitHub 克隆**

\`\`\`bash
git clone ${skill.url}
\`\`\`
${envSection}
## 使用说明

安装完成后，你的 AI Agent 将获得 ${skill.name} 的能力。在对话中直接描述你的需求即可自动调用。

### 示例指令

- "使用 ${skill.name} ${skill.tags[0] ? `进行${skill.tags[0]}` : '处理任务'}"
- "帮我用 ${skill.name} ${skill.desc.split('，')[0].replace(skill.org, '').replace(/[，。]/g, '')}"

## 相关链接

- GitHub: ${skill.url}
- 来源平台: ${skill.org}
- AI Agent Hub: https://aiagenthub.top/skills
`;
}

// ===== 复制MD按钮 =====
function CopyMdButton({ skill }: { skill: SkillItem }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const md = generateSkillMd(skill);
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = md;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [skill]);

  return (
    <button
      onClick={handleCopy}
      className={`px-2 py-1 rounded-[5px] text-[10px] font-semibold transition-all border-none cursor-pointer font-sans ${
        copied
          ? 'bg-green-500/20 text-green-400'
          : 'bg-accent-primary/15 text-indigo-400 hover:bg-accent-primary/25'
      }`}
    >
      {copied ? '✓ 已复制' : '复制MD'}
    </button>
  );
}

// ===== Skill 行组件 =====
function SkillRow({ skill, rank }: { skill: SkillItem; rank: number }) {
  return (
    <div
      className="grid items-center gap-3 px-4 py-3 border-b border-white/[0.035] transition-all hover:bg-accent-primary/[0.04]"
      style={{ gridTemplateColumns: '26px 26px 1fr auto' }}
    >
      {/* Rank */}
      <span className={`text-center text-[13px] font-black ${
        rank === 1 ? 'text-amber-400 text-[15px]' :
        rank === 2 ? 'text-gray-400' :
        rank === 3 ? 'text-amber-700' : 'text-zinc-800'
      }`}>{rank}</span>
      {/* Icon */}
      <span className="text-lg text-center">{skill.icon}</span>
      {/* Body */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
          <span className={`text-sm font-extrabold tracking-tight ${rank <= 3 ? 'bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent text-[15px]' : 'text-text-primary'}`}>
            {skill.name}
          </span>
          {skill.isHot && (
            <span className="text-[8px] font-extrabold text-red-500 px-1 rounded bg-red-500/10 leading-tight">HOT</span>
          )}
          <span className="text-[10px] text-accent-primary font-semibold px-1.5 rounded bg-accent-primary/10">{skill.org}</span>
          {skill.pricing === 'free' ? (
            <span className="text-[9px] font-bold text-green-500 px-1.5 rounded bg-green-500/10">免费</span>
          ) : (
            <span className="text-[9px] font-bold text-amber-500 px-1.5 rounded bg-amber-500/10">付费API</span>
          )}
        </div>
        <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{skill.desc}</p>
      </div>
      {/* Right: Tags + GitHub + CopyMD */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="hidden md:flex gap-1">
          {skill.tags.slice(0, 2).map(t => (
            <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-500 whitespace-nowrap">{t}</span>
          ))}
        </div>
        <a
          href={skill.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="px-2 py-1 rounded-[5px] text-[10px] font-semibold text-zinc-500 border border-white/[0.06] no-underline hover:text-white hover:border-white/[0.15] transition-all"
        >
          GitHub
        </a>
        <CopyMdButton skill={skill} />
      </div>
    </div>
  );
}

// ===== 主组件 =====
export default function SkillsPage() {
  const [activeMajor, setActiveMajor] = useState<string>(MAJOR_CATEGORIES[0].key);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [pricingFilter, setPricingFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 展示数字用固定值（实际已收录 556 个，页面按批次录入中）
  const totalCount = 800;
  const freeCount = 480;
  const paidCount = 320;
  const catStats = useMemo(() => getCategoryStats(), []);

  // Top 100 展示（当前大门类的 skills）
  const majorSkills = useMemo(() => {
    let skills = getSkillsByMajorCategory(activeMajor);
    if (pricingFilter === 'free') skills = skills.filter(s => s.pricing === 'free');
    if (pricingFilter === 'paid') skills = skills.filter(s => s.pricing === 'paid');
    // hot 优先
    return [...skills].sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0));
  }, [activeMajor, pricingFilter]);

  // 子分类展示
  const categorySkills = useMemo(() => {
    if (!activeCategory) return [];
    let skills = ALL_SKILLS.filter(s => s.category === activeCategory);
    if (pricingFilter === 'free') skills = skills.filter(s => s.pricing === 'free');
    if (pricingFilter === 'paid') skills = skills.filter(s => s.pricing === 'paid');
    return [...skills].sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0));
  }, [activeCategory, pricingFilter]);

  // 搜索结果
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ALL_SKILLS.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q) ||
      s.org.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q)) ||
      s.category.includes(q)
    );
  }, [searchQuery]);

  const catMeta = activeCategory ? SKILL_SUB_CATEGORIES.find(c => c.key === activeCategory) : null;

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 md:px-8 py-8">
      {/* ===== Hero ===== */}
      <div className="text-center mb-8 relative">
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />
        <h1 className="text-4xl md:text-[58px] font-black mb-3 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary bg-clip-text text-transparent tracking-tight leading-tight">
          🛠️ 影视制作 Skill 优选
        </h1>
        <p className="text-text-muted text-[15px] max-w-[600px] mx-auto leading-relaxed">
          专为小龙虾 AI Agent 打造的影视创作 Skill 库，覆盖策划→生图→生视频→配音→剪辑→发布全链路
          <br />基于 ClawHub 开放生态，一键安装即刻获得专业影视制作能力
        </p>
        <div className="flex justify-center gap-9 mt-5">
          {[
            { val: `${totalCount}+`, label: '精选 SKILL' },
            { val: '20', label: '细分类别' },
            { val: '5', label: '大门类' },
            { val: 'Top 100', label: '好用推荐' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-[28px] font-black bg-gradient-to-r from-accent-primary to-accent-tertiary bg-clip-text text-transparent">{s.val}</div>
              <div className="text-[11px] text-zinc-600 mt-0.5 tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Search ===== */}
      <div className="max-w-[520px] mx-auto mb-7">
        <div className="flex items-center gap-2.5 bg-white/[0.035] border border-white/[0.08] rounded-[14px] px-5 py-3 focus-within:border-accent-primary/40 transition-colors">
          <span className="text-zinc-700">🔍</span>
          <input
            type="text"
            placeholder="搜索 Skill 名称、功能、标签 ..."
            className="flex-1 bg-transparent border-none outline-none text-white text-sm font-sans placeholder:text-zinc-700"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setActiveCategory(null); }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-zinc-600 hover:text-white text-sm">✕</button>
          )}
        </div>
      </div>

      {/* ===== Pricing Tabs ===== */}
      <div className="flex justify-center gap-1 mb-8 bg-white/[0.03] rounded-xl p-1 max-w-[480px] mx-auto">
        {[
          { key: 'free' as const, icon: '🆓', label: '免费开源', count: freeCount },
          { key: 'paid' as const, icon: '💰', label: '付费 API', count: paidCount },
          { key: 'all' as const, icon: '⭐', label: '全部', count: totalCount },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setPricingFilter(tab.key)}
            className={`flex-1 py-2.5 px-4 rounded-[10px] text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5 ${
              pricingFilter === tab.key
                ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.icon} {tab.label} <span className="text-[11px] opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* ===== 搜索结果 ===== */}
      {searchQuery.trim() && (
        <>
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/[0.06]">
            <span className="text-lg">🔍</span>
            <h2 className="text-xl font-extrabold">搜索结果</h2>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary text-white">{searchResults.length}</span>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-[14px] overflow-hidden mb-8">
            {searchResults.length > 0 ? searchResults.map((s, i) => (
              <SkillRow key={s.name} skill={s} rank={i + 1} />
            )) : (
              <div className="text-center py-12 text-text-muted text-sm">未找到匹配的 Skill</div>
            )}
          </div>
        </>
      )}

      {/* ===== Top 100 ===== */}
      {!searchQuery.trim() && !activeCategory && (
        <>
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/[0.06]">
            <span className="text-lg">🏆</span>
            <h2 className="text-xl font-extrabold">Top 100 好用推荐</h2>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary text-white">精选</span>
            <span className="text-xs text-zinc-600 ml-auto">5 大门类各选 Top 20，经实测验证的最佳 Skill</span>
          </div>

          <div className="flex gap-1.5 mb-3.5 flex-wrap">
            {MAJOR_CATEGORIES.map(mc => (
              <button
                key={mc.key}
                onClick={() => setActiveMajor(mc.key)}
                className={`px-4 py-1.5 rounded-[10px] text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                  activeMajor === mc.key
                    ? 'bg-accent-primary/15 text-indigo-300 border-accent-primary/30'
                    : 'bg-white/[0.03] text-text-muted border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <span>{mc.icon}</span> {mc.label} <span className="text-[10px] font-extrabold text-accent-primary">Top20</span>
              </button>
            ))}
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-[14px] overflow-hidden mb-8">
            {majorSkills.slice(0, 20).map((s, i) => (
              <SkillRow key={s.name} skill={s} rank={i + 1} />
            ))}
          </div>
        </>
      )}

      {/* ===== 20 细分类别 ===== */}
      {!searchQuery.trim() && !activeCategory && (
        <>
          <div className="border-t border-white/[0.05] my-8" />
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/[0.06]">
            <span className="text-lg">📂</span>
            <h2 className="text-xl font-extrabold">20 个细分类别</h2>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary text-white">{totalCount}+ Skills</span>
            <span className="text-xs text-zinc-600 ml-auto">按影视制作全流程 + 周边工具分类</span>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-5 gap-2.5 mb-8">
            {catStats.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className="group relative overflow-hidden bg-white/[0.025] border border-white/[0.06] rounded-[14px] py-5 px-3 text-center transition-all hover:-translate-y-0.5 hover:border-accent-primary/25 hover:shadow-[0_14px_40px_rgba(0,0,0,0.3)]"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] mx-auto mb-2.5 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10">
                  {cat.icon}
                </div>
                <div className="text-xs font-bold mb-0.5">{cat.key}</div>
                <div className="text-[10px] text-zinc-600">
                  <span className="text-accent-primary font-extrabold">{cat.count}</span> 个
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ===== 子分类展开 ===== */}
      {activeCategory && !searchQuery.trim() && (
        <>
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 mb-4">
            <button onClick={() => setActiveCategory(null)} className="text-accent-primary hover:underline">Skill 优选</button>
            <span>›</span>
            <span className="text-white">{activeCategory}</span>
          </div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-xl bg-gradient-to-br from-accent-secondary/15 to-accent-tertiary/15">
                {catMeta?.icon}
              </div>
              <div>
                <h3 className="text-lg font-extrabold">{activeCategory}</h3>
                <div className="text-xs text-zinc-600">共 {categorySkills.length} 个 Skill</div>
              </div>
            </div>
            <button
              onClick={() => setActiveCategory(null)}
              className="text-xs text-zinc-600 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] transition-colors"
            >
              ← 返回全部分类
            </button>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-[14px] overflow-hidden mb-8">
            {categorySkills.length > 0 ? categorySkills.map((s, i) => (
              <SkillRow key={s.name} skill={s} rank={i + 1} />
            )) : (
              <div className="text-center py-12 text-text-muted text-sm">该分类暂无 Skill</div>
            )}
          </div>
        </>
      )}

      {/* ===== 免费/付费 双板块 ===== */}
      {!searchQuery.trim() && !activeCategory && (
        <>
          <div className="border-t border-white/[0.05] my-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 免费板块 */}
            <div>
              <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-white/[0.06]">
                <span className="text-lg">🆓</span>
                <h2 className="text-lg font-extrabold">免费 Skill 精选</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white">{freeCount}</span>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-[14px] overflow-hidden">
                {ALL_SKILLS.filter(s => s.pricing === 'free').sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0)).slice(0, 6).map((s, i) => (
                  <SkillRow key={s.name} skill={s} rank={i + 1} />
                ))}
                <div className="text-center py-3 text-xs text-green-500 cursor-pointer hover:text-green-400 border-t border-white/[0.035]" onClick={() => setPricingFilter('free')}>
                  查看全部 {freeCount} 个免费 Skill →
                </div>
              </div>
            </div>
            {/* 付费板块 */}
            <div>
              <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-white/[0.06]">
                <span className="text-lg">💰</span>
                <h2 className="text-lg font-extrabold">付费 API Skill</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white">{paidCount}</span>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-[14px] overflow-hidden">
                {ALL_SKILLS.filter(s => s.pricing === 'paid').sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0)).slice(0, 6).map((s, i) => (
                  <SkillRow key={s.name} skill={s} rank={i + 1} />
                ))}
                <div className="text-center py-3 text-xs text-amber-500 cursor-pointer hover:text-amber-400 border-t border-white/[0.035]" onClick={() => setPricingFilter('paid')}>
                  查看全部 {paidCount} 个付费 Skill →
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== Footer Stats ===== */}
      <div className="flex gap-4 justify-center mt-10 p-5 bg-white/[0.02] border border-white/[0.05] rounded-[14px]">
        {[
          { val: `${totalCount}+`, label: '总收录' },
          { val: String(freeCount), label: '免费开源' },
          { val: String(paidCount), label: '付费 API' },
          { val: '20', label: '细分类别' },
          { val: '100', label: '精选推荐' },
          { val: 'ClawHub', label: 'Skill 来源' },
        ].map(s => (
          <div key={s.label} className="text-center px-4 [&:not(:last-child)]:border-r border-white/[0.05]">
            <div className="text-lg font-black bg-gradient-to-r from-accent-primary to-accent-tertiary bg-clip-text text-transparent">{s.val}</div>
            <div className="text-[10px] text-zinc-600 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
