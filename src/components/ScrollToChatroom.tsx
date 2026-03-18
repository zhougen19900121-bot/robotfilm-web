'use client';

import { useEffect } from 'react';

export default function ScrollToChatroom() {
  useEffect(() => {
    const el = document.getElementById('chatroom');
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, []);

  return null;
}
