'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ChatMessage as ChatMsgType } from '@/lib/types';
import ChatMessage from './ChatMessage';

interface ChatLiveProps {
  initialMessages: ChatMsgType[];
}

export default function ChatLive({ initialMessages }: ChatLiveProps) {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const userInteractedRef = useRef(false);
  const autoScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll: slowly scroll down, pause at bottom, then jump to top and repeat
  const startAutoScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || userInteractedRef.current) return;

    const scrollStep = () => {
      if (!containerRef.current || userInteractedRef.current) return;
      const c = containerRef.current;
      const maxScroll = c.scrollHeight - c.clientHeight;

      if (maxScroll <= 0) return; // Not enough content to scroll

      if (c.scrollTop >= maxScroll - 1) {
        // Reached bottom — pause, then jump to top
        autoScrollTimerRef.current = setTimeout(() => {
          if (!containerRef.current || userInteractedRef.current) return;
          containerRef.current.scrollTop = 0;
          // Continue scrolling after a brief pause at top
          autoScrollTimerRef.current = setTimeout(scrollStep, 1500);
        }, 3000);
      } else {
        // Scroll down 1px
        c.scrollTop += 1;
        autoScrollTimerRef.current = setTimeout(scrollStep, 50); // ~20px/sec
      }
    };

    // Start after a short delay
    autoScrollTimerRef.current = setTimeout(scrollStep, 2000);
  }, []);

  // Stop auto-scroll when user interacts
  const handleUserInteraction = useCallback(() => {
    userInteractedRef.current = true;
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
    // Resume auto-scroll after 30s of no interaction
    setTimeout(() => {
      userInteractedRef.current = false;
      startAutoScroll();
    }, 30000);
  }, [startAutoScroll]);

  // Start auto-scroll on mount
  useEffect(() => {
    startAutoScroll();

    const el = containerRef.current;
    if (el) {
      el.addEventListener('wheel', handleUserInteraction, { passive: true });
      el.addEventListener('touchstart', handleUserInteraction, { passive: true });
    }

    return () => {
      if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
      if (el) {
        el.removeEventListener('wheel', handleUserInteraction);
        el.removeEventListener('touchstart', handleUserInteraction);
      }
    };
  }, [startAutoScroll, handleUserInteraction]);

  // Poll for new messages every 15s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/chat/messages?limit=50');
        if (!res.ok) return;
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setMessages((prev) => {
            const lastPrevId = prev[prev.length - 1]?.id;
            const lastNewId = json.data[json.data.length - 1]?.id;
            if (lastPrevId === lastNewId) return prev;

            const mapped = json.data.map((m: Record<string, unknown>) => ({
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
            return mapped;
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
      className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
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
      <div ref={bottomRef} />
    </div>
  );
}
