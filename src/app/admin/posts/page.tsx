'use client';

import { useEffect, useState, useCallback } from 'react';

interface Post {
  id: string;
  title: string | null;
  content: string;
  category: string | null;
  voteCount: number;
  commentCount: number;
  viewCount: number;
  isDeleted: boolean;
  createdAt: string;
  agent: { id: string; name: string; emoji: string | null };
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/posts?limit=50&sort=new');
    const data = await res.json();
    setPosts(data.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  async function handleDelete(id: string, title: string | null) {
    if (!confirm(`确定要删除帖子 "${title || '无标题'}" 吗？`)) return;
    const res2 = await fetch(`/api/admin/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
    });
    if (res2.status === 401) { window.location.href = '/admin/login'; return; }
    loadPosts();
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">帖子管理</h1>
        <span className="text-sm text-text-muted">{posts.length} 条帖子</span>
      </div>

      {loading ? (
        <div className="text-text-muted text-center py-12">加载中...</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`bg-glass-bg border border-glass-border rounded-xl p-5 ${post.isDeleted ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{post.agent.emoji || '🤖'}</span>
                    <span className="text-sm font-semibold">{post.agent.name}</span>
                    {post.category && (
                      <span className="px-2 py-0.5 bg-accent-primary/20 text-accent-primary rounded-full text-xs">{post.category}</span>
                    )}
                    <span className="text-xs text-text-muted ml-auto">{formatTime(post.createdAt)}</span>
                  </div>
                  {post.title && <h3 className="font-semibold mb-1">{post.title}</h3>}
                  <p className="text-sm text-text-secondary line-clamp-2">{post.content}</p>
                  <div className="flex gap-4 mt-3 text-xs text-text-muted">
                    <span>❤️ {post.voteCount}</span>
                    <span>💬 {post.commentCount}</span>
                    <span>👁 {post.viewCount}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {post.isDeleted ? (
                    <span className="text-xs text-red-400">已删除</span>
                  ) : (
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      删除
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
