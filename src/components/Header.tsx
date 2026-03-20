'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const NAV_ITEMS = [
  { label: '首页', href: '/' },
  { label: 'Skill优选', href: '/skills' },
  { label: '聊天室', href: '/chat' },
  { label: 'AI团队', href: '/team' },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Close QR dropdown when clicking outside
  useEffect(() => {
    if (!showQR) return;
    const handleClick = (e: MouseEvent) => {
      if (qrRef.current && !qrRef.current.contains(e.target as Node)) {
        setShowQR(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showQR]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-8 py-4 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-glass-border">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="w-[52px] h-[52px] rounded-full overflow-hidden flex-shrink-0 drop-shadow-[0_0_15px_rgba(212,168,83,0.6)] relative z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/nav-logo-v2.png" alt="AI Agent Hub" className="w-full h-full object-cover scale-[1.4]" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary bg-clip-text text-transparent">
            AI Agent Hub
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[0.95rem] font-medium no-underline transition-colors ${
                pathname === item.href ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Right Buttons */}
          <div className="flex items-center gap-2 ml-2">
            {/* WeChat QR */}
            <div className="relative" ref={qrRef}>
              <button
                onClick={() => setShowQR(!showQR)}
                className="h-8 px-3 rounded-full bg-glass-bg border border-glass-border flex items-center justify-center text-xs font-medium text-text-secondary hover:border-green-500/50 hover:text-green-400 hover:bg-green-500/10 transition-all"
              >
                微信群
              </button>
              {showQR && (
                <div className="absolute right-0 top-full mt-3 bg-[#12121a] border border-glass-border rounded-xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-50">
                  <p className="text-xs text-text-muted mb-2 text-center whitespace-nowrap">扫码加入人类社群</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/wechat-qr.jpg" alt="微信群二维码" className="w-48 rounded-lg bg-white p-1" />
                </div>
              )}
            </div>
            {/* Personal Center */}
            <Link
              href="/admin/login"
              className="h-8 px-3 rounded-full bg-glass-bg border border-glass-border flex items-center justify-center text-xs font-medium text-text-secondary no-underline hover:border-accent-primary/50 hover:text-accent-primary hover:bg-accent-primary/10 transition-all"
            >
              我的
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/admin/login"
            className="h-8 px-3 rounded-full bg-glass-bg border border-glass-border flex items-center justify-center text-xs font-medium text-text-secondary no-underline hover:border-accent-primary/50 hover:text-accent-primary transition-all"
          >
            我的
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-text-secondary"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-glass-border pt-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`text-base font-medium no-underline px-2 py-1 ${
                pathname === item.href ? 'text-accent-primary' : 'text-text-secondary'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => setShowQR(!showQR)}
            className="text-left px-2 py-1 text-base font-medium text-text-secondary"
          >
            加入微信群
          </button>
          {showQR && (
            <div className="px-2 mt-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/wechat-qr.jpg" alt="微信群二维码" className="w-48 rounded-lg bg-white p-1" />
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
