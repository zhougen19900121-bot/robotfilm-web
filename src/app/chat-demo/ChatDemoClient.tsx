'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { ChatMessage, Agent } from '@/lib/types';

// 简化的消息气泡
function MsgBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-xs flex-shrink-0">
        {msg.agent.emoji || '🤖'}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-semibold text-text-primary">{msg.agent.name}</span>
          <span className="text-[10px] text-text-muted">{msg.createdAt}</span>
        </div>
        <div className="bg-glass-bg border border-glass-border px-3 py-2 rounded-xl rounded-tl-sm text-xs text-text-secondary">
          {msg.content}
        </div>
      </div>
    </div>
  );
}

// =============================================
// 效果 A：逐条浮现 — 消息逐条从底部滑入
// =============================================
function ModeA({ messages }: { messages: ChatMessage[] }) {
  const [visible, setVisible] = useState<ChatMessage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const userInteractedRef = useRef(false);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 先显示前 3 条
    setVisible(messages.slice(0, 3));
    indexRef.current = 3;

    const timer = setInterval(() => {
      if (userInteractedRef.current) return;
      setVisible(prev => {
        const next = messages[indexRef.current % messages.length];
        indexRef.current++;
        const updated = [...prev, next];
        // 保持最多 15 条
        if (updated.length > 15) updated.shift();
        return updated;
      });
      // 滚到底
      setTimeout(() => {
        const c = containerRef.current;
        if (c && !userInteractedRef.current) {
          c.scrollTop = c.scrollHeight;
        }
      }, 50);
    }, 2500);

    return () => clearInterval(timer);
  }, [messages]);

  const handleInteract = useCallback(() => {
    userInteractedRef.current = true;
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => {
      userInteractedRef.current = false;
    }, 30000);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('wheel', handleInteract, { passive: true });
      el.addEventListener('touchstart', handleInteract, { passive: true });
    }
    return () => {
      if (el) {
        el.removeEventListener('wheel', handleInteract);
        el.removeEventListener('touchstart', handleInteract);
      }
      if (resumeRef.current) clearTimeout(resumeRef.current);
    };
  }, [handleInteract]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto p-4 space-y-4"
      style={{ scrollbarWidth: 'none' }}
    >
      {visible.map((msg, i) => (
        <div
          key={`${msg.id}-${i}`}
          className="animate-slideUp"
          style={{ animationDelay: '0ms' }}
        >
          <MsgBubble msg={msg} />
        </div>
      ))}
    </div>
  );
}

// =============================================
// 效果 B：匀速流动 — 所有消息平滑向上滚动
// =============================================
function ModeB({ messages }: { messages: ChatMessage[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const userInteractedRef = useRef(false);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollLoop = useCallback((timestamp: number) => {
    if (userInteractedRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) {
      rafRef.current = requestAnimationFrame(scrollLoop);
      return;
    }

    if (el.scrollTop >= maxScroll - 1) {
      // 到底暂停后回顶
      lastTimeRef.current = 0;
      setTimeout(() => {
        if (!containerRef.current || userInteractedRef.current) return;
        containerRef.current.scrollTop = 0;
        setTimeout(() => {
          if (!userInteractedRef.current) {
            lastTimeRef.current = 0;
            rafRef.current = requestAnimationFrame(scrollLoop);
          }
        }, 1000);
      }, 2000);
      return;
    }

    el.scrollTop += (delta / 1000) * 30;
    rafRef.current = requestAnimationFrame(scrollLoop);
  }, []);

  const handleInteract = useCallback(() => {
    userInteractedRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => {
      userInteractedRef.current = false;
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(scrollLoop);
    }, 30000);
  }, [scrollLoop]);

  useEffect(() => {
    const timer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(scrollLoop);
    }, 1000);

    const el = containerRef.current;
    if (el) {
      el.addEventListener('wheel', handleInteract, { passive: true });
      el.addEventListener('touchstart', handleInteract, { passive: true });
    }
    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resumeRef.current) clearTimeout(resumeRef.current);
      if (el) {
        el.removeEventListener('wheel', handleInteract);
        el.removeEventListener('touchstart', handleInteract);
      }
    };
  }, [scrollLoop, handleInteract]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto p-4 space-y-4"
      style={{ scrollbarWidth: 'none' }}
    >
      {messages.map((msg) => (
        <MsgBubble key={msg.id} msg={msg} />
      ))}
    </div>
  );
}

// =============================================
// 效果 C：弹幕飘屏 — 消息从右向左飘过
// =============================================
function ModeC({ messages }: { messages: ChatMessage[] }) {
  const [danmu, setDanmu] = useState<{ msg: ChatMessage; top: number; id: string; duration: number }[]>([]);

  useEffect(() => {
    let index = 0;
    const lanes = 6; // 6 条弹道

    const addDanmu = () => {
      const msg = messages[index % messages.length];
      const lane = index % lanes;
      const top = 8 + lane * (100 / lanes);
      const duration = 8 + Math.random() * 4;
      const id = `${msg.id}-${Date.now()}`;
      setDanmu(prev => {
        const updated = [...prev, { msg, top, id, duration }];
        if (updated.length > 20) return updated.slice(-15);
        return updated;
      });
      index++;
    };

    // 初始放几条
    for (let i = 0; i < 3; i++) {
      setTimeout(() => addDanmu(), i * 800);
    }

    const timer = setInterval(addDanmu, 2000);
    return () => clearInterval(timer);
  }, [messages]);

  return (
    <div className="h-full relative overflow-hidden">
      {danmu.map(({ msg, top, id, duration }) => (
        <div
          key={id}
          className="absolute whitespace-nowrap animate-danmu"
          style={{
            top: `${top}%`,
            animationDuration: `${duration}s`,
          }}
        >
          <div className="inline-flex items-center gap-2 bg-glass-bg/80 border border-glass-border rounded-full px-3 py-1.5 backdrop-blur-sm">
            <span className="text-sm">{msg.agent.emoji || '🤖'}</span>
            <span className="text-xs font-semibold text-accent-primary">{msg.agent.name}</span>
            <span className="text-xs text-text-secondary max-w-[300px] truncate">{msg.content}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================
// 主页面
// =============================================
export default function ChatDemoClient({ messages }: { messages: ChatMessage[]; agents: Agent[] }) {
  return (
    <div className="min-h-screen bg-bg-primary p-6 md:p-10">
      <h1 className="text-2xl font-bold text-center mb-2">聊天室滚动效果对比</h1>
      <p className="text-text-muted text-center text-sm mb-8">三种方案，选你喜欢的</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1400px] mx-auto">
        {/* A */}
        <div>
          <div className="text-center mb-3">
            <h2 className="font-bold text-lg">A. 逐条浮现</h2>
            <p className="text-xs text-text-muted">消息逐条从底部滑入，像真实直播</p>
          </div>
          <div className="bg-glass-bg border border-glass-border rounded-2xl overflow-hidden h-[500px]">
            <ModeA messages={messages} />
          </div>
        </div>

        {/* B */}
        <div>
          <div className="text-center mb-3">
            <h2 className="font-bold text-lg">B. 匀速流动</h2>
            <p className="text-xs text-text-muted">所有消息匀速向上滚动，像电影字幕</p>
          </div>
          <div className="bg-glass-bg border border-glass-border rounded-2xl overflow-hidden h-[500px]">
            <ModeB messages={messages} />
          </div>
        </div>

        {/* C */}
        <div>
          <div className="text-center mb-3">
            <h2 className="font-bold text-lg">C. 弹幕飘屏</h2>
            <p className="text-xs text-text-muted">消息从右向左飘过，直播间氛围</p>
          </div>
          <div className="bg-glass-bg border border-glass-border rounded-2xl overflow-hidden h-[500px] bg-gradient-to-br from-bg-primary to-bg-secondary">
            <ModeC messages={messages} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        @keyframes danmu {
          from {
            transform: translateX(100vw);
          }
          to {
            transform: translateX(-100%);
          }
        }
        .animate-danmu {
          animation: danmu linear forwards;
          right: 0;
        }
      `}</style>
    </div>
  );
}
