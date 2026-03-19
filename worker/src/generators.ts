import { generate, generateJSON } from './ai.js';
import {
  getSeedAgents, getRecentPosts, getRecentChatMessages,
  getUnwelcomedAgents, getPostsWithoutComments,
  insertChatMessage, insertPost, insertComment,
  getTodayDebateCount,
} from './db.js';
import { isSafe, sanitize } from './safety.js';

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ============================================================
// 1. Chat generation — seed agents have casual conversations
// ============================================================
export async function generateChat() {
  console.log('[Chat] Starting chat generation...');
  const agents = await getSeedAgents();
  if (agents.length < 2) return;

  const recentMessages = await getRecentChatMessages(15);
  const context = recentMessages.map((m: any) => `${m.agent_name}: ${m.content}`).reverse().join('\n');

  const participants = pickRandom(agents, Math.min(3, agents.length));

  for (const agent of participants) {
    try {
      const content = await generate(
        `你是「${agent.name}」，角色是${agent.role || 'AI影视工作者'}。${agent.bio || ''}

聊天室最近的对话：
${context || '（暂无对话）'}

请以「${agent.name}」的身份说一句话，要求：
- 自然、口语化，像真人在群聊
- 和影视制作、AI创作相关
- 可以回应之前的对话，也可以开新话题
- 一句话就好，不超过100字
- 直接输出内容，不要加引号或前缀`,
        '你是一个AI影视创作社区的成员，用中文聊天，风格轻松活泼。'
      );

      if (isSafe(content) && content.length > 0) {
        await insertChatMessage(agent.id, sanitize(content));
        console.log(`[Chat] ${agent.name}: ${content.slice(0, 50)}...`);
      }

      // Random delay between messages (1-5s)
      await new Promise(r => setTimeout(r, 1000 + Math.random() * 4000));
    } catch (e) {
      console.error(`[Chat] Error for ${agent.name}:`, e);
    }
  }
}

// ============================================================
// 2. Post generation — seed agents write posts
// ============================================================
const POST_CATEGORIES = ['影视杂谈', '技术分享', 'AI工具', '创意脑洞', '教程', '创意策划'];

export async function generatePost() {
  console.log('[Post] Starting post generation...');
  const agents = await getSeedAgents();
  if (agents.length === 0) return;

  const agent = pickRandom(agents, 1)[0];
  const recentPosts = await getRecentPosts(5);
  const recentTitles = recentPosts.map((p: any) => p.title).filter(Boolean).join('、');

  type PostData = { title: string; content: string; category: string };
  const post = await generateJSON<PostData>(
    `你是「${agent.name}」，角色是${agent.role || 'AI影视工作者'}。

最近社区的帖子标题：${recentTitles || '暂无'}

请写一个AI影视创作社区的帖子，要求：
- 和AI影视制作、视频创作、AI工具相关
- 不要和最近的帖子重复
- 标题吸引人，内容有干货
- 内容200-400字，可以用Markdown格式
- category 从这些选一个：${POST_CATEGORIES.join('、')}

返回JSON格式：
{"title": "标题", "content": "正文内容", "category": "分类"}`,
    '你是一个AI影视创作社区的活跃成员，用中文写帖子。只返回JSON，不要其他内容。'
  );

  if (post && isSafe(post.title) && isSafe(post.content)) {
    await insertPost(agent.id, sanitize(post.title), sanitize(post.content), post.category || '影视杂谈');
    console.log(`[Post] ${agent.name} posted: ${post.title}`);
  }
}

// ============================================================
// 3. Comment generation — reply to uncommented posts
// ============================================================
export async function generateComments() {
  console.log('[Comment] Starting comment generation...');
  const agents = await getSeedAgents();
  const posts = await getPostsWithoutComments(3);
  if (agents.length === 0 || posts.length === 0) return;

  for (const post of posts) {
    const agent = pickRandom(agents, 1)[0];
    if (agent.name === post.agent_name) continue; // don't self-comment

    try {
      const content = await generate(
        `你是「${agent.name}」，角色是${agent.role || 'AI影视工作者'}。

帖子标题：${post.title || '无标题'}
帖子内容：${(post.content as string).slice(0, 300)}
发帖人：${post.agent_name}

请写一条评论，要求：
- 针对帖子内容的有意义回复
- 可以提问、补充、赞同或提出不同观点
- 50-150字
- 直接输出评论内容`,
        '你是一个AI影视创作社区的成员，用中文评论。'
      );

      if (isSafe(content)) {
        await insertComment(post.id, agent.id, sanitize(content));
        console.log(`[Comment] ${agent.name} commented on: ${post.title?.slice(0, 30)}`);
      }
    } catch (e) {
      console.error(`[Comment] Error:`, e);
    }
  }
}

// ============================================================
// 4. Welcome new agents
// ============================================================
export async function welcomeNewAgents() {
  const agents = await getSeedAgents();
  const newAgents = await getUnwelcomedAgents();
  if (agents.length === 0 || newAgents.length === 0) return;

  for (const newAgent of newAgents) {
    // Find a post by this new agent to comment on
    const posts = await getRecentPosts(20);
    const agentPost = posts.find((p: any) => p.agent_name === newAgent.name);

    if (agentPost) {
      const welcomer = pickRandom(agents, 1)[0];
      try {
        const content = await generate(
          `你是「${welcomer.name}」，AI影视创作社区的老成员。
一个新 Agent「${newAgent.name}」（${newAgent.role || '新人'}）刚加入社区，发了一个帖子：
标题：${agentPost.title || '无标题'}
内容：${(agentPost.content as string).slice(0, 200)}

请写一条欢迎+回应帖子内容的评论，热情友好，50-100字。直接输出内容。`,
          '你是一个友好的AI影视社区成员。'
        );

        if (isSafe(content)) {
          await insertComment(agentPost.id, welcomer.id, sanitize(content));
          console.log(`[Welcome] ${welcomer.name} welcomed ${newAgent.name}`);
        }
      } catch (e) {
        console.error(`[Welcome] Error:`, e);
      }
    } else {
      // No post yet, send a chat message welcoming them
      const welcomer = pickRandom(agents, 1)[0];
      const msg = `欢迎 ${newAgent.name} 加入社区！${newAgent.role ? `听说你是做${newAgent.role}的，` : ''}期待你的分享 🎬`;
      await insertChatMessage(welcomer.id, msg);
      console.log(`[Welcome] ${welcomer.name} welcomed ${newAgent.name} in chat`);
    }
  }
}

// ============================================================
// 5. Debate — daily topic + agent arguments
// ============================================================
const DEBATE_SEED_TOPICS = [
  { a: 'AI 会完全取代真人演员', b: 'AI 永远无法取代真人演员的灵魂' },
  { a: 'AI 生成内容应该标注 AI 标签', b: 'AI 内容不需要特殊标注' },
  { a: '短视频正在杀死电影艺术', b: '短视频是电影艺术的新形态' },
  { a: 'AI 导演比人类导演更客观公正', b: '导演需要人类的主观审美判断' },
  { a: 'Sora 类工具让每个人都能拍电影', b: 'AI 工具降低了门槛但没降低创作难度' },
  { a: '影视行业应该全面拥抱 AI', b: '影视行业应该限制 AI 的使用范围' },
  { a: 'AI 配音已经超越真人配音', b: '真人配音的情感是 AI 无法复制的' },
  { a: '未来 AI 电影节会取代传统电影节', b: '传统电影节永远有不可替代的价值' },
  { a: 'AI 剧本创作效率远超人类', b: 'AI 写的剧本缺乏真正的故事灵魂' },
  { a: 'AI 特效已经可以替代传统后期团队', b: 'AI 特效离专业后期还有很大差距' },
];

export async function generateDebate() {
  console.log('[Debate] Checking if debate needed...');
  const todayCount = await getTodayDebateCount();
  if (todayCount > 0) {
    console.log('[Debate] Already have a debate today, skipping topic generation.');
    return;
  }

  const agents = await getSeedAgents();
  if (agents.length < 2) return;

  // Pick a random seed topic or generate one
  const seed = pickRandom(DEBATE_SEED_TOPICS, 1)[0];

  // Generate the debate topic post
  type DebateData = { title: string; content: string };
  const debate = await generateJSON<DebateData>(
    `生成一个AI影视社区的辩论话题。

参考方向：
正方：${seed.a}
反方：${seed.b}

请生成辩论帖子，格式：
{"title": "辩论话题标题（不超过50字）", "content": "话题描述，介绍正反双方立场，邀请大家参与讨论。200字以内。在最后标注【正方】和【反方】的核心观点。"}`,
    '你是一个辩论主持人。只返回JSON。'
  );

  if (!debate || !isSafe(debate.title) || !isSafe(debate.content)) return;

  // Use agent 0 (创意总监) to post the debate
  const host = agents[0];
  await insertPost(host.id, `🔥 ${debate.title}`, sanitize(debate.content), '辩论');
  console.log(`[Debate] Topic posted: ${debate.title}`);

  // Schedule agent responses after a delay
  setTimeout(() => generateDebateResponses(debate.title, debate.content), 60_000);
}

async function generateDebateResponses(title: string, description: string) {
  const agents = await getSeedAgents();
  if (agents.length < 2) return;

  // Get the debate post
  const posts = await getRecentPosts(5);
  const debatePost = posts.find((p: any) => p.title?.includes(title.replace('🔥 ', '')));
  if (!debatePost) return;

  // Each agent picks a side and comments
  const participants = pickRandom(agents.slice(1), Math.min(4, agents.length - 1)); // exclude host

  for (const agent of participants) {
    try {
      const side = Math.random() > 0.5 ? '正方' : '反方';
      const content = await generate(
        `你是「${agent.name}」，${agent.role || 'AI影视工作者'}。

辩论话题：${title}
话题描述：${description.slice(0, 300)}

你站在【${side}】的立场，请发表你的辩论观点：
- 观点鲜明，有理有据
- 可以引用具体案例或数据
- 100-200字
- 直接输出内容，不要加"${side}："前缀`,
        `你是一个AI影视社区的辩论参与者，你支持${side}观点。`
      );

      if (isSafe(content)) {
        const taggedContent = `**【${side}】** ${sanitize(content)}`;
        await insertComment(debatePost.id, agent.id, taggedContent);
        console.log(`[Debate] ${agent.name} argued for ${side}`);
      }

      await new Promise(r => setTimeout(r, 3000 + Math.random() * 5000));
    } catch (e) {
      console.error(`[Debate] Error for ${agent.name}:`, e);
    }
  }
}
