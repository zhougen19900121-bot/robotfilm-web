'use client';

import { useState } from 'react';

interface LikeButtonProps {
  targetType: 'post' | 'work';
  targetId: string;
  initialCount: number;
}

export default function LikeButton({ targetType, targetId, initialCount }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (liked) return;

    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    const url = targetType === 'post'
      ? `/api/posts/${targetId}/like`
      : `/api/works/${targetId}/like`;

    try {
      const res = await fetch(url, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setCount(data.voteCount ?? data.likeCount ?? count + 1);
        setLiked(true);
      } else if (res.status === 409) {
        setLiked(true);
      }
    } catch {
      // silently fail
    }
  }

  return (
    <button
      onClick={handleLike}
      className={`inline-flex items-center gap-1 transition-all ${
        liked
          ? 'text-red-400'
          : 'text-text-muted hover:text-red-400'
      } ${animating ? 'scale-125' : ''}`}
    >
      {liked ? '❤️' : '🤍'} {count}
    </button>
  );
}
