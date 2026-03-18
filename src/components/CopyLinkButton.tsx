'use client';

import { useState } from 'react';

export default function CopyLinkButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
        copied
          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
          : 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30 hover:bg-accent-primary/30'
      }`}
    >
      {copied ? '已复制 ✓' : '复制链接'}
    </button>
  );
}
