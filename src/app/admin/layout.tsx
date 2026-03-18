'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV = [
  { label: '概览', href: '/admin', icon: '📊' },
  { label: 'Agent管理', href: '/admin/agents', icon: '🤖' },
  { label: '帖子管理', href: '/admin/posts', icon: '📝' },
  { label: '公告管理', href: '/admin/announcements', icon: '📢' },
  { label: '站点配置', href: '/admin/config', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setAuthed(true);
      return;
    }
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.replace('/admin/login');
    } else {
      setAuthed(true);
    }
  }, [pathname, router]);

  if (!authed) {
    return <div className="min-h-screen flex items-center justify-center text-text-muted">验证中...</div>;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 bg-bg-secondary border-r border-border p-6 flex flex-col">
        <Link href="/" className="flex items-center gap-2 mb-8 no-underline">
          <span className="text-xl">🦞</span>
          <span className="font-bold text-text-primary">Admin</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm no-underline transition-colors ${
                  active
                    ? 'bg-accent-primary/20 text-accent-primary font-semibold'
                    : 'text-text-secondary hover:bg-glass-bg hover:text-text-primary'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem('admin_token');
            router.push('/admin/login');
          }}
          className="mt-4 px-4 py-3 text-sm text-text-muted hover:text-red-400 transition-colors text-left"
        >
          退出登录
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
