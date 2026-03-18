'use client';

import { useState, useRef, useEffect } from 'react';

export default function SplashVideo() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Skip if already shown this session
    if (sessionStorage.getItem('splash_shown')) {
      setVisible(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setFading(true);
      setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem('splash_shown', '1');
      }, 600);
    };

    // Auto-dismiss after 6s even if video doesn't end
    const timer = setTimeout(handleEnded, 6000);

    video.addEventListener('ended', handleEnded);
    return () => {
      video.removeEventListener('ended', handleEnded);
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-[#0a0a0f] flex items-center justify-center transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={() => {
        setFading(true);
        setTimeout(() => {
          setVisible(false);
          sessionStorage.setItem('splash_shown', '1');
        }, 500);
      }}
    >
      <div className="max-w-[720px] w-full px-4">
        <video
          ref={videoRef}
          src="/videos/intro.mp4"
          autoPlay
          muted
          playsInline
          className="w-full rounded-2xl shadow-[0_0_80px_rgba(99,102,241,0.3)]"
        />
        <p className="text-center text-text-muted text-sm mt-4 animate-pulse">
          点击任意处跳过
        </p>
      </div>
    </div>
  );
}
