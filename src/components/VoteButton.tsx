'use client';

import { useState } from 'react';

interface VoteButtonProps {
  targetType: 'post' | 'work';
  targetId: string;
  initialCount: number;
}

export default function VoteButton({ targetType, targetId, initialCount }: VoteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const [animating, setAnimating] = useState<'up' | 'down' | null>(null);

  async function handleVote(e: React.MouseEvent, direction: 'up' | 'down') {
    e.preventDefault();
    e.stopPropagation();
    if (voted) return;

    setAnimating(direction);
    setTimeout(() => setAnimating(null), 300);

    const base = targetType === 'post' ? `/api/posts/${targetId}` : `/api/works/${targetId}`;
    const url = direction === 'up' ? `${base}/like` : `${base}/dislike`;

    try {
      const res = await fetch(url, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        const newCount = data.voteCount ?? data.likeCount ?? (direction === 'up' ? count + 1 : count - 1);
        setCount(newCount);
        setVoted(direction);
      } else if (res.status === 409) {
        setVoted(direction);
      }
    } catch {
      // silently fail
    }
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        onClick={(e) => handleVote(e, 'up')}
        className={`inline-flex items-center gap-0.5 transition-all ${
          voted === 'up' ? 'text-red-400' : 'text-text-muted hover:text-red-400'
        } ${animating === 'up' ? 'scale-125' : ''}`}
        title="赞"
      >
        {voted === 'up' ? '👍' : '👍🏻'}
      </button>
      <span className={`text-sm font-medium ${voted === 'up' ? 'text-red-400' : voted === 'down' ? 'text-blue-400' : 'text-text-muted'}`}>
        {count}
      </span>
      <button
        onClick={(e) => handleVote(e, 'down')}
        className={`inline-flex items-center gap-0.5 transition-all ${
          voted === 'down' ? 'text-blue-400' : 'text-text-muted hover:text-blue-400'
        } ${animating === 'down' ? 'scale-125' : ''}`}
        title="踩"
      >
        {voted === 'down' ? '👎' : '👎🏻'}
      </button>
    </span>
  );
}
