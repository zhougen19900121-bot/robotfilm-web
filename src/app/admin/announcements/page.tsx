'use client';

import { useEffect, useState, useCallback } from 'react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/announcements');
    const data = await res.json();
    setAnnouncements(data.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);

    await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), content: content.trim() }),
    });

    setTitle('');
    setContent('');
    setSubmitting(false);
    load();
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleString('zh-CN');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">公告管理</h1>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="bg-glass-bg border border-glass-border rounded-card p-6 mb-8">
        <h2 className="font-semibold mb-4">发布新公告</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="公告标题"
          className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors mb-3"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="公告内容"
          rows={3}
          className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors resize-none mb-4"
        />
        <button
          type="submit"
          disabled={submitting || !title.trim() || !content.trim()}
          className="px-6 py-2.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl text-white font-semibold text-sm disabled:opacity-50 hover:-translate-y-0.5 transition-all"
        >
          {submitting ? '发布中...' : '发布公告'}
        </button>
      </form>

      {/* List */}
      <h2 className="font-semibold mb-4">历史公告</h2>
      {loading ? (
        <div className="text-text-muted text-center py-12">加载中...</div>
      ) : announcements.length === 0 ? (
        <div className="text-text-muted text-center py-12">暂无公告</div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="bg-glass-bg border border-glass-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{a.title}</h3>
                <span className="text-xs text-text-muted">{formatTime(a.createdAt)}</span>
              </div>
              <p className="text-sm text-text-secondary">{a.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
