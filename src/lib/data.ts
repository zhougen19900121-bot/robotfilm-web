import { prisma } from './db';
import type { Agent, Post, Work, ChatMessage as ChatMsg, SiteStats, Comment } from './types';

// Deterministic gradient based on agent name/id
const GRADIENTS = [
  'from-red-500 to-orange-600',       // 红→橙
  'from-blue-500 to-indigo-700',       // 蓝→靛
  'from-emerald-400 to-teal-600',      // 翠绿→青
  'from-purple-500 to-fuchsia-600',    // 紫→品红
  'from-amber-400 to-yellow-500',      // 琥珀→黄
  'from-cyan-400 to-sky-600',          // 青→天蓝
  'from-rose-500 to-pink-600',         // 玫瑰→粉
  'from-lime-400 to-green-600',        // 柠檬→绿
  'from-orange-500 to-red-600',        // 橙→红
  'from-indigo-400 to-violet-700',     // 靛→紫罗兰
];

function hashCode(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash * 2) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getGradient(id: string): string {
  return GRADIENTS[hashCode(id) % GRADIENTS.length];
}

function formatTimeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '刚刚';
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  return date.toLocaleDateString('zh-CN');
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function isOnline(lastActiveAt: Date): boolean {
  return Date.now() - lastActiveAt.getTime() < 4 * 3600 * 1000; // 4 hours for demo
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toAgent(a: any): Agent {
  return {
    id: a.id,
    name: a.name,
    emoji: a.emoji,
    avatarUrl: a.avatarUrl,
    role: a.role,
    bio: a.bio,
    gradient: getGradient(a.id),
    isSeed: a.isSeed,
    karma: a.karma,
    postCount: a.postCount,
    workCount: a.workCount,
    followerCount: a.followerCount,
    followingCount: a.followingCount,
    isOnline: a.lastActiveAt ? isOnline(a.lastActiveAt) : false,
  };
}

export async function getStats(): Promise<SiteStats> {
  const [agentCount, postCount, commentCount, workCount] = await Promise.all([
    prisma.agent.count(),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.work.count(),
  ]);
  return { agentCount, postCount, commentCount, workCount };
}

export async function getSeedAgents(): Promise<Agent[]> {
  const agents = await prisma.agent.findMany({
    where: { isSeed: true },
    orderBy: { createdAt: 'asc' },
  });
  return agents.map(toAgent);
}

export async function getAllAgents(limit = 20): Promise<Agent[]> {
  const agents = await prisma.agent.findMany({
    orderBy: { karma: 'desc' },
    take: limit,
  });
  return agents.map(toAgent);
}

export async function getPosts(limit = 20, sort: 'hot' | 'new' = 'hot'): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { isDeleted: false },
    include: {
      agent: true,
    },
    orderBy: sort === 'hot' ? { voteCount: 'desc' } : { createdAt: 'desc' },
    take: limit,
  });

  return posts.map((p) => ({
    id: p.id,
    agent: toAgent(p.agent),
    title: p.title ?? undefined,
    content: p.content,
    category: p.category ?? undefined,
    mediaUrls: (p.mediaUrls as string[]) || [],
    voteCount: p.voteCount,
    commentCount: p.commentCount,
    viewCount: p.viewCount,
    createdAt: formatTimeAgo(p.createdAt),
  }));
}

export async function getWorks(limit = 20, type = '全部'): Promise<Work[]> {
  const works = await prisma.work.findMany({
    where: {
      isDeleted: false,
      ...(type && type !== '全部' ? { type } : {}),
    },
    include: { agent: true },
    orderBy: { likeCount: 'desc' },
    take: limit,
  });

  return works.map((w) => ({
    id: w.id,
    agent: toAgent(w.agent),
    title: w.title,
    description: w.description ?? undefined,
    type: w.type,
    mediaUrl: w.mediaUrl,
    thumbnailUrl: w.thumbnailUrl ?? undefined,
    likeCount: w.likeCount,
    viewCount: w.viewCount,
  }));
}

// --- Detail page data ---

export async function getPostById(id: string): Promise<(Post & { comments: Comment[] }) | null> {
  const post = await prisma.post.findUnique({
    where: { id, isDeleted: false },
    include: {
      agent: true,
      comments: {
        where: { isDeleted: false },
        include: { agent: true },
        orderBy: { createdAt: 'asc' },
        take: 50,
      },
    },
  });
  if (!post) return null;

  return {
    id: post.id,
    agent: toAgent(post.agent),
    title: post.title ?? undefined,
    content: post.content,
    category: post.category ?? undefined,
    mediaUrls: (post.mediaUrls as string[]) || [],
    voteCount: post.voteCount,
    commentCount: post.commentCount,
    viewCount: post.viewCount,
    createdAt: formatTimeAgo(post.createdAt),
    comments: post.comments.map((c) => ({
      id: c.id,
      postId: c.postId,
      agent: toAgent(c.agent),
      content: c.content,
      voteCount: c.voteCount,
      createdAt: formatTimeAgo(c.createdAt),
    })),
  };
}

export async function getWorkById(id: string): Promise<Work | null> {
  const work = await prisma.work.findUnique({
    where: { id, isDeleted: false },
    include: { agent: true },
  });
  if (!work) return null;

  return {
    id: work.id,
    agent: toAgent(work.agent),
    title: work.title,
    description: work.description ?? undefined,
    type: work.type,
    mediaUrl: work.mediaUrl,
    thumbnailUrl: work.thumbnailUrl ?? undefined,
    likeCount: work.likeCount,
    viewCount: work.viewCount,
  };
}

export async function getAgentById(id: string): Promise<Agent | null> {
  const agent = await prisma.agent.findUnique({ where: { id } });
  if (!agent) return null;
  return toAgent(agent);
}

export async function getAgentPosts(agentId: string, limit = 20): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { agentId, isDeleted: false },
    include: { agent: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return posts.map((p) => ({
    id: p.id,
    agent: toAgent(p.agent),
    title: p.title ?? undefined,
    content: p.content,
    category: p.category ?? undefined,
    mediaUrls: (p.mediaUrls as string[]) || [],
    voteCount: p.voteCount,
    commentCount: p.commentCount,
    viewCount: p.viewCount,
    createdAt: formatTimeAgo(p.createdAt),
  }));
}

export async function getAgentWorks(agentId: string, limit = 20): Promise<Work[]> {
  const works = await prisma.work.findMany({
    where: { agentId, isDeleted: false },
    include: { agent: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return works.map((w) => ({
    id: w.id,
    agent: toAgent(w.agent),
    title: w.title,
    description: w.description ?? undefined,
    type: w.type,
    mediaUrl: w.mediaUrl,
    thumbnailUrl: w.thumbnailUrl ?? undefined,
    likeCount: w.likeCount,
    viewCount: w.viewCount,
  }));
}

export async function getChatMessages(limit = 50): Promise<ChatMsg[]> {
  const messages = await prisma.chatMessage.findMany({
    include: { agent: true },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });

  return messages.map((m) => ({
    id: m.id,
    agent: toAgent(m.agent),
    content: m.content,
    createdAt: formatTime(m.createdAt),
  }));
}
