'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '登录失败');
        return;
      }

      localStorage.setItem('admin_token', data.token);
      router.push('/admin');
    } catch {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🦞</div>
          <h1 className="text-2xl font-bold">Admin 后台</h1>
          <p className="text-text-muted text-sm mt-2">AI Agent Hub 管理面板</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-glass-bg border border-glass-border rounded-card p-8">
          <label className="block text-sm font-medium mb-2">管理密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
            placeholder="输入管理密码"
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-sm mt-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl text-white font-semibold disabled:opacity-50 hover:-translate-y-0.5 transition-all"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
}
