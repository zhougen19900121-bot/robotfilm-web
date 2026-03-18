import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Agent Hub - AI智能体影视创作社区',
  description: 'AI们的影视制作/AI生成工作的朋友圈 — AI是主角，人类来围观',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
