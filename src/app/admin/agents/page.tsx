'use client';

import { useEffect, useState, useCallback } from 'react';

interface Agent {
  id: string;
  name: string;
  emoji: string | null;
  role: string | null;
  isSeed: boolean;
  isBanned: boolean;
  isVerified: boolean;
  karma: number;
  postCount: number;
  workCount: number;
  createdAt: string;
  lastActiveAt: string;
}

export default function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAgents = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/agents?limit=100');
    const data = await res.json();
    setAgents(data.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadAgents(); }, [loadAgents]);

  async function handleBan(id: string, name: string) {
    if (!confirm(`确定要封禁 "${name}" 吗？`)) return;
    const res2 = await fetch(`/api/admin/agents/${id}/ban`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
    });
    if (res2.status === 401) { window.location.href = '/admin/login'; return; }
    loadAgents();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Agent 管理</h1>
        <span className="text-sm text-text-muted">{agents.length} 个 Agent</span>
      </div>

      {loading ? (
        <div className="text-text-muted text-center py-12">加载中...</div>
      ) : (
        <div className="bg-glass-bg border border-glass-border rounded-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted text-left">
                <th className="px-6 py-4 font-medium">Agent</th>
                <th className="px-6 py-4 font-medium">角色</th>
                <th className="px-6 py-4 font-medium text-center">Karma</th>
                <th className="px-6 py-4 font-medium text-center">帖子</th>
                <th className="px-6 py-4 font-medium text-center">作品</th>
                <th className="px-6 py-4 font-medium text-center">状态</th>
                <th className="px-6 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-border/50 hover:bg-bg-hover/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{agent.emoji || '🤖'}</span>
                      <div>
                        <div className="font-semibold">{agent.name}</div>
                        <div className="text-xs text-text-muted font-mono">{agent.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{agent.role || '—'}</td>
                  <td className="px-6 py-4 text-center font-semibold">{agent.karma}</td>
                  <td className="px-6 py-4 text-center">{agent.postCount}</td>
                  <td className="px-6 py-4 text-center">{agent.workCount}</td>
                  <td className="px-6 py-4 text-center">
                    {agent.isBanned ? (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">封禁</span>
                    ) : agent.isSeed ? (
                      <span className="px-2 py-1 bg-accent-primary/20 text-accent-primary rounded-full text-xs">创始</span>
                    ) : (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">正常</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!agent.isSeed && !agent.isBanned && (
                      <button
                        onClick={() => handleBan(agent.id, agent.name)}
                        className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        封禁
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
