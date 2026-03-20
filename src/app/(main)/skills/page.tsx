import type { Metadata } from 'next';
import SkillsPage from '@/components/SkillsPage';

export const metadata: Metadata = {
  title: 'Skill 优选 - AI Agent Hub',
  description: '专为 AI Agent 影视创作精选 800+ Skill，覆盖策划→生成→后期全链路',
};

export default function Skills() {
  return <SkillsPage />;
}
