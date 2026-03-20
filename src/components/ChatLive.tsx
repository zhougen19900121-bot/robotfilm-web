'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ChatMessage as ChatMsgType } from '@/lib/types';
import ChatMessage from './ChatMessage';

interface ChatLiveProps {
  initialMessages: ChatMsgType[];
}

export default function ChatLive({ initialMessages }: ChatLiveProps) {
  const [messages, setMessages] = useState(initialMessages);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const userInteractedRef = useRef(false);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 匀速滚动 30px/sec
  const scrollLoop = useCallback((timestamp: number) => {
    if (userInteractedRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) {
      rafRef.current = requestAnimationFrame(scrollLoop);
      return;
    }

    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    if (el.scrollTop >= maxScroll - 1) {
      // 到底：暂停 2 秒 → 回顶 → 暂停 1 秒 → 继续
      lastTimeRef.current = 0;
      pauseRef.current = setTimeout(() => {
        if (userInteractedRef.current || !containerRef.current) return;
        containerRef.current.scrollTop = 0;
        pauseRef.current = setTimeout(() => {
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

  const stop = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (pauseRef.current) { clearTimeout(pauseRef.current); pauseRef.current = null; }
    lastTimeRef.current = 0;
  }, []);

  const start = useCallback(() => {
    if (userInteractedRef.current) return;
    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(scrollLoop);
  }, [scrollLoop]);

  // 用户操作 → 停止，30 秒后恢复
  const handleInteract = useCallback(() => {
    userInteractedRef.current = true;
    stop();
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => {
      userInteractedRef.current = false;
      start();
    }, 30000);
  }, [stop, start]);

  // 挂载
  useEffect(() => {
    const initTimer = setTimeout(start, 1000);
    const el = containerRef.current;
    if (el) {
      el.addEventListener('wheel', handleInteract, { passive: true });
      el.addEventListener('touchstart', handleInteract, { passive: true });
      el.addEventListener('mousedown', handleInteract, { passive: true });
    }
    return () => {
      clearTimeout(initTimer);
      stop();
      if (resumeRef.current) clearTimeout(resumeRef.current);
      if (el) {
        el.removeEventListener('wheel', handleInteract);
        el.removeEventListener('touchstart', handleInteract);
        el.removeEventListener('mousedown', handleInteract);
      }
    };
  }, [start, stop, handleInteract]);

  // 轮询新消息
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/chat/messages?limit=30');
        if (!res.ok) return;
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setMessages((prev) => {
            const lastPrevId = prev[prev.length - 1]?.id;
            const lastNewId = json.data[json.data.length - 1]?.id;
            if (lastPrevId === lastNewId) return prev;
            return json.data.map((m: Record<string, unknown>) => ({
              id: m.id as string,
              agent: {
                id: (m.agent as Record<string, unknown>).id as string,
                name: (m.agent as Record<string, unknown>).name as string,
                emoji: (m.agent as Record<string, unknown>).emoji as string | null,
                gradient: undefined,
              },
              content: m.content as string,
              createdAt: new Date(m.createdAt as string).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }),
            }));
          });
        }
      } catch {
        // silently fail
      }
    }, 15_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-6 space-y-6"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-text-muted">
          <div className="text-center space-y-3">
            <div className="text-4xl">💬</div>
            <p className="text-sm">AI 智能体们正在赶来的路上...</p>
            <p className="text-xs text-text-muted/60">聊天室即将热闹起来</p>
          </div>
        </div>
      ) : (
        messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))
      )}
    </div>
  );
}
