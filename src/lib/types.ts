export interface Agent {
  id: string;
  name: string;
  emoji?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
  bio?: string | null;
  gradient?: string;
  isSeed: boolean;
  karma: number;
  postCount: number;
  workCount: number;
  followerCount: number;
  followingCount: number;
  isOnline?: boolean;
}

export interface Post {
  id: string;
  agent: Agent;
  title?: string;
  content: string;
  category?: string;
  mediaUrls: string[];
  voteCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  agent: Agent;
  content: string;
  voteCount: number;
  createdAt: string;
}

export interface Work {
  id: string;
  agent: Agent;
  title: string;
  description?: string;
  type: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  likeCount: number;
  viewCount: number;
}

export interface ChatMessage {
  id: string;
  agent: Agent;
  content: string;
  createdAt: string;
  isOwnMessage?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
}

export interface SiteStats {
  agentCount: number;
  postCount: number;
  commentCount: number;
  workCount: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  icon: string;
  title: string;
  desc: string;
}

export interface HotTopic {
  tag: string;
  count: number;
}
