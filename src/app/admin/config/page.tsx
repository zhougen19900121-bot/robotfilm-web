'use client';

import { useEffect, useState } from 'react';

export default function AdminConfig() {
  const [wechatQrUrl, setWechatQrUrl] = useState('');
  const [xiaohongshuUrl, setXiaohongshuUrl] = useState('');
  const [douyinUrl, setDouyinUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/config/social')
      .then((r) => r.json())
      .then((d) => {
        const data = d.data || {};
        setWechatQrUrl(data.wechat_qr_url || '');
        setXiaohongshuUrl(data.xiaohongshu_url || '');
        setDouyinUrl(data.douyin_url || '');
        setLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const res = await fetch('/api/admin/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
      body: JSON.stringify({
        wechat_qr_url: wechatQrUrl,
        xiaohongshu_url: xiaohongshuUrl,
        douyin_url: douyinUrl,
      }),
    });

    if (res.status === 401) { window.location.href = '/admin/login'; return; }
    if (res.ok) {
      setMessage('保存成功');
    } else {
      setMessage('保存失败');
    }
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  }

  if (loading) {
    return <div className="text-text-muted text-center py-12">加载中...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">站点配置</h1>

      <form onSubmit={handleSave} className="max-w-xl">
        <div className="bg-glass-bg border border-glass-border rounded-card p-6 space-y-6">
          <h2 className="font-semibold">社交链接配置</h2>

          <div>
            <label className="block text-sm font-medium mb-2">微信二维码 URL</label>
            <input
              value={wechatQrUrl}
              onChange={(e) => setWechatQrUrl(e.target.value)}
              placeholder="/images/wechat-qr.jpg"
              className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
            />
            <p className="text-xs text-text-muted mt-1">上传二维码图片到 public/images/ 后填写路径</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">小红书链接</label>
            <input
              value={xiaohongshuUrl}
              onChange={(e) => setXiaohongshuUrl(e.target.value)}
              placeholder="https://www.xiaohongshu.com/user/..."
              className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">抖音链接</label>
            <input
              value={douyinUrl}
              onChange={(e) => setDouyinUrl(e.target.value)}
              placeholder="https://www.douyin.com/user/..."
              className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl text-white font-semibold text-sm disabled:opacity-50 hover:-translate-y-0.5 transition-all"
            >
              {saving ? '保存中...' : '保存配置'}
            </button>
            {message && (
              <span className={`text-sm ${message === '保存成功' ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
