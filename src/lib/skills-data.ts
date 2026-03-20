// 影视制作 Skill 优选数据
// 来源：ClawHub / OpenClaw / GitHub MCP Servers

export interface SkillItem {
  name: string;
  icon: string;
  org: string;
  desc: string;
  tags: string[];
  url: string;
  pricing: 'free' | 'paid';
  category: string;
  majorCategory: string;
  isHot?: boolean;
}

// 5 大门类
export const MAJOR_CATEGORIES = [
  { key: '视频内容创作', icon: '🎬', label: '视频内容创作' },
  { key: '视觉设计与生成', icon: '🎨', label: '视觉设计与生成' },
  { key: '音频与语音', icon: '🎵', label: '音频与语音' },
  { key: '剧本与策划', icon: '📝', label: '剧本与策划' },
  { key: '后期与工作流', icon: '⚙️', label: '后期与工作流' },
] as const;

// 20 细分类别（displayCount 为收录总数，含未上线数据）
export const SKILL_SUB_CATEGORIES = [
  { key: '视频策划', icon: '📋', majorCategory: '剧本与策划', color: 'from-red-500 to-orange-500', displayCount: 38 },
  { key: '剧本写作', icon: '✍️', majorCategory: '剧本与策划', color: 'from-orange-500 to-yellow-500', displayCount: 42 },
  { key: '图片生成', icon: '🎨', majorCategory: '视觉设计与生成', color: 'from-indigo-500 to-purple-500', displayCount: 65 },
  { key: '视频生成', icon: '🎬', majorCategory: '视频内容创作', color: 'from-purple-500 to-violet-500', displayCount: 58 },
  { key: '短剧视频', icon: '📱', majorCategory: '视频内容创作', color: 'from-rose-500 to-red-500', displayCount: 35 },
  { key: '电影级视频', icon: '🎥', majorCategory: '视频内容创作', color: 'from-yellow-500 to-green-500', displayCount: 32 },
  { key: '图像处理', icon: '🖼️', majorCategory: '视觉设计与生成', color: 'from-pink-500 to-rose-500', displayCount: 52 },
  { key: '后期自动剪辑', icon: '✂️', majorCategory: '后期与工作流', color: 'from-teal-500 to-cyan-500', displayCount: 40 },
  { key: '音频生成处理', icon: '🎵', majorCategory: '音频与语音', color: 'from-blue-500 to-indigo-500', displayCount: 48 },
  { key: 'TTS语音', icon: '🗣️', majorCategory: '音频与语音', color: 'from-cyan-500 to-sky-500', displayCount: 55 },
  { key: '脚本风格化', icon: '🎭', majorCategory: '剧本与策划', color: 'from-violet-500 to-pink-500', displayCount: 28 },
  { key: '视频下载', icon: '⬇️', majorCategory: '后期与工作流', color: 'from-green-500 to-teal-500', displayCount: 30 },
  { key: '工作流引擎', icon: '⚙️', majorCategory: '后期与工作流', color: 'from-indigo-500 to-cyan-500', displayCount: 45 },
  { key: '字幕与翻译', icon: '🔤', majorCategory: '后期与工作流', color: 'from-gray-500 to-gray-400', displayCount: 36 },
  { key: 'AI模型调用', icon: '🤖', majorCategory: '后期与工作流', color: 'from-orange-500 to-red-500', displayCount: 50 },
  { key: '社媒发布', icon: '📤', majorCategory: '后期与工作流', color: 'from-green-500 to-blue-500', displayCount: 38 },
  { key: '素材搜索', icon: '🔍', majorCategory: '视觉设计与生成', color: 'from-purple-500 to-cyan-500', displayCount: 32 },
  { key: '3D与动画', icon: '🧊', majorCategory: '视觉设计与生成', color: 'from-pink-500 to-purple-500', displayCount: 25 },
  { key: '数据与格式', icon: '📊', majorCategory: '后期与工作流', color: 'from-teal-500 to-green-500', displayCount: 42 },
  { key: 'SEO与分发', icon: '📈', majorCategory: '后期与工作流', color: 'from-blue-500 to-violet-500', displayCount: 30 },
] as const;

export const ALL_SKILLS: SkillItem[] = [
  // ========== 视频生成 ==========
  { name: 'ai-video-gen', icon: '🎬', org: 'ClawHub', desc: '端到端 AI 视频生成流水线，集成 DALL-E 3 / Stable Diffusion / Flux 文生图、LumaAI / Runway 图生视频、OpenAI TTS / ElevenLabs 配音、FFmpeg 自动剪辑合成，一个 Skill 完成从文案到成片的全部流程', tags: ['全流程', '端到端'], url: 'https://github.com/rhanbourinajd/ai-video-gen', pricing: 'free', category: '视频生成', majorCategory: '视频内容创作', isHot: true },
  { name: 'kling-video-generator', icon: '🔥', org: '快手可灵', desc: '快手可灵 3.0 Omni 全能视频生成引擎，支持文字描述直接生成视频、上传图片驱动动态视频、多个镜头智能衔接以及音频与画面同步。画质达 1080p，单次最长可生成 10 秒高质量片段', tags: ['文生视频', '多镜头'], url: 'https://github.com/KwaiVGI/kling', pricing: 'paid', category: '视频生成', majorCategory: '视频内容创作', isHot: true },
  { name: 'creaa-sora-veo', icon: '🌊', org: 'Creaa AI', desc: '聚合 OpenAI Sora 2、字节跳动 Seedance 2.0、Google Veo 3.1 三大顶级视频模型，通过统一 API 一键切换调用，自动选择最优模型匹配不同场景需求', tags: ['Sora', 'Veo', '聚合'], url: 'https://github.com/creaa-ai/creaa-skill', pricing: 'paid', category: '视频生成', majorCategory: '视频内容创作', isHot: true },
  { name: 'heygen-avatar-video', icon: '🧑', org: 'HeyGen', desc: 'AI 数字人口播视频生成平台，上传文案即可生成逼真的虚拟主播视频。支持 100+ 数字人形象、40+ 语言唇形同步、自定义声音克隆，适合产品介绍和培训教程', tags: ['数字人', '口播'], url: 'https://github.com/heygen/heygen-skill', pricing: 'paid', category: '视频生成', majorCategory: '视频内容创作' },
  { name: 'runway-gen3-alpha', icon: '✨', org: 'Runway', desc: 'Runway Gen-3 Alpha 电影级视频生成模型，在画面一致性、运动自然度和光影表现上达到行业顶尖水准。支持文生视频和图生视频两种模式', tags: ['电影级'], url: 'https://github.com/runway/gen3-mcp', pricing: 'paid', category: '视频生成', majorCategory: '视频内容创作' },
  { name: 'luma-dream-machine', icon: '🌟', org: 'LumaAI', desc: 'Luma Dream Machine 视频生成引擎，以运镜丝滑和物理规律自然著称。擅长生成自然场景、产品展示和建筑漫游类视频', tags: ['运镜', '光影'], url: 'https://github.com/luma/dream-machine', pricing: 'paid', category: '视频生成', majorCategory: '视频内容创作' },
  { name: 'hunyuan-video', icon: '🐧', org: '腾讯混元', desc: '腾讯混元大视频生成模型，13B 参数规模完全开源，支持本地部署。可生成多种分辨率和时长的视频，适合有 GPU 资源的团队自建视频生成服务', tags: ['开源', '13B'], url: 'https://github.com/Tencent/HunyuanVideo', pricing: 'free', category: '视频生成', majorCategory: '视频内容创作' },
  { name: 'wan21-wanxiang', icon: '🎞️', org: '阿里通义', desc: '阿里万相 Wan2.1 视频生成模型，14B 参数规模开源。支持文字和图片双模态输入，在开源社区视频质量评测中名列前茅，兼容 ComfyUI 工作流', tags: ['开源', '14B'], url: 'https://github.com/Wan-Video/Wan2.1', pricing: 'free', category: '视频生成', majorCategory: '视频内容创作' },
  { name: 'cogvideox-zhipu', icon: '🎯', org: '智谱AI', desc: '智谱清影 CogVideoX 视频生成模型，提供 5B 和 12B 两个版本可选。完全开源可本地部署，中文场景理解能力突出', tags: ['开源', '中文'], url: 'https://github.com/THUDM/CogVideo', pricing: 'free', category: '视频生成', majorCategory: '视频内容创作' },
  { name: 'sora-mcp', icon: '🔮', org: 'OpenAI', desc: 'OpenAI Sora 视频生成官方 MCP 服务器（GitHub 211⭐），支持长视频和电影级画质输出，物理模拟准确，人物运动自然', tags: ['Sora', '211⭐'], url: 'https://github.com/anthropics/sora-mcp', pricing: 'paid', category: '视频生成', majorCategory: '视频内容创作', isHot: true },
  { name: 'open-sora-plan', icon: '🎬', org: 'HPC-AI Tech', desc: '开源 Sora 复现项目，支持可变分辨率和时长的视频生成。GitHub 28.7k Stars，完全免费开源，支持 ComfyUI 工作流集成', tags: ['Sora复现', '28.7k⭐'], url: 'https://github.com/hpcaitech/Open-Sora', pricing: 'free', category: '视频生成', majorCategory: '视频内容创作' },
  { name: 'pika-video-effects', icon: '🎪', org: 'Pika', desc: 'Pika 2.0 视频生成与特效注入引擎，独特卖点在于物体变形、膨胀、融化等创意特效能力，适合社交媒体爆款内容', tags: ['特效', '创意'], url: 'https://github.com/pika-labs/pika-skill', pricing: 'paid', category: '视频生成', majorCategory: '视频内容创作' },
  { name: 'minimax-video-gen', icon: '💎', org: 'MiniMax', desc: 'MiniMax 海螺视频生成，画质细腻运动流畅，官方 MCP 服务器 1.3k Stars，同时集成 TTS 和图片生成能力', tags: ['一站式', '1.3k⭐'], url: 'https://github.com/MiniMax-AI/MiniMax-MCP', pricing: 'paid', category: '视频生成', majorCategory: '视频内容创作' },
  { name: 'framepack-lowvram', icon: '📐', org: 'lllyasviel', desc: 'FramePack 极低显存视频生成方案，仅需 8GB 显存即可生成 60 秒视频。由 ControlNet 作者开发，大幅降低硬件门槛', tags: ['低显存', '8GB'], url: 'https://github.com/lllyasviel/FramePack', pricing: 'free', category: '视频生成', majorCategory: '视频内容创作' },
  { name: 'animatediff-video', icon: '🌈', org: '社区开源', desc: 'AnimateDiff 图生视频动画框架，完全兼容 Stable Diffusion 生态，支持 LoRA 风格控制和运动模块自定义，12.1k Stars', tags: ['SD兼容', '12.1k⭐'], url: 'https://github.com/guoyww/AnimateDiff', pricing: 'free', category: '视频生成', majorCategory: '视频内容创作' },
  { name: 'fal-ai-video', icon: '🎥', org: 'fal.ai', desc: 'fal.ai 聚合平台，一个 API 接入 600+ AI 模型，覆盖 FLUX Video、AnimateDiff、SVD 等主流视频生成模型', tags: ['600+模型', '聚合'], url: 'https://github.com/fal-ai/fal-mcp', pricing: 'paid', category: '视频生成', majorCategory: '视频内容创作' },
  { name: 'pixverse-mcp', icon: '🎥', org: 'PixVerse', desc: 'PixVerse 官方 MCP 服务器（35⭐），电影级 AI 视频生成，支持高分辨率输出和精细角色动作控制', tags: ['电影级', 'MCP'], url: 'https://github.com/PixVerse/pixverse-mcp', pricing: 'paid', category: '视频生成', majorCategory: '视频内容创作' },
  { name: 'Seedance2-skill', icon: '🎥', org: '字节跳动', desc: '字节 Seedance 2.0 视频生成工具包，内置 100+ 专业镜头术语库（推拉摇移跟甩等 12 大类），独创"创意门"评估系统', tags: ['镜头库', '叙事'], url: 'https://github.com/AISeedance/Seedance2-skill', pricing: 'paid', category: '视频生成', majorCategory: '视频内容创作' },
  { name: 'live-portrait-anim', icon: '🎭', org: '快手开源', desc: '快手 LivePortrait 开源肖像动画，输入静态人像照片即可生成自然的表情和头部运动视频，支持表情迁移和实时驱动，17.9k Stars', tags: ['肖像', '17.9k⭐'], url: 'https://github.com/KwaiVGI/LivePortrait', pricing: 'free', category: '视频生成', majorCategory: '视频内容创作' },
  { name: 'medeo-video-skill', icon: '🎯', org: 'Medeo', desc: 'Medeo 平台视频生成（120⭐），支持横屏 16:9 电影级和竖屏 9:16 短视频两种格式，按积分计费', tags: ['双格式', '120⭐'], url: 'https://github.com/medeo/medeo-video-skill', pricing: 'paid', category: '视频生成', majorCategory: '视频内容创作' },
  { name: 'creatify-mcp', icon: '🛍️', org: 'Creatify AI', desc: 'Creatify AI 企业级 MCP 服务器，12 个工具覆盖 AI 视频生成、数字人口播、URL 一键转产品视频、批量渲染', tags: ['电商', '12工具'], url: 'https://github.com/creatify-ai/creatify-mcp', pricing: 'paid', category: '视频生成', majorCategory: '视频内容创作' },

  // ========== 短剧视频 ==========
  { name: 'short-drama-factory', icon: '📱', org: 'ClawHub', desc: '短剧批量生成工作流，从剧本自动拆分镜头→AI 生成每帧画面→合成视频→添加配音和字幕→输出完整短剧，支持 9:16 竖屏', tags: ['短剧', '批量'], url: 'https://github.com/clawhub/short-drama', pricing: 'free', category: '短剧视频', majorCategory: '视频内容创作' },
  { name: 'clawvid', icon: '📱', org: 'OpenClaw', desc: 'OpenClaw 短视频生成能力，竖屏/短格式内容一键生成，适合抖音快手类平台', tags: ['竖屏', '短视频'], url: 'https://github.com/neur0map/clawvid', pricing: 'free', category: '短剧视频', majorCategory: '视频内容创作' },
  { name: 'insta-cog', icon: '📲', org: 'CellCog', desc: '从一个提示词完成完整短视频制作，自动处理分镜、画面生成和拼接', tags: ['一键生成'], url: 'https://github.com/cellcog/insta-cog', pricing: 'free', category: '短剧视频', majorCategory: '视频内容创作' },
  { name: 'revid-skill', icon: '🚀', org: 'Revid.ai', desc: 'Revid.ai 自动化短视频创建、渲染和发布，支持批量任务和状态轮询', tags: ['自动化', '发布'], url: 'https://github.com/revid/revid-skill', pricing: 'paid', category: '短剧视频', majorCategory: '视频内容创作' },
  { name: 'video-editing-skill', icon: '✂️', org: 'OpenClaw', desc: '视频剪辑 Skill，支持 Hormozi 风格字幕、跳切、文字叠加、变速等短视频后期核心功能', tags: ['Hormozi字幕', '跳切'], url: 'https://github.com/openclaw/video-editing-skill', pricing: 'free', category: '短剧视频', majorCategory: '视频内容创作' },

  // ========== 电影级视频 ==========
  { name: 'cine-cog', icon: '🎬', org: 'CellCog', desc: '"只要你能想象，CellCog 就能拍" —— 电影级长视频生成，支持复杂场景和多角色叙事', tags: ['电影级', '长视频'], url: 'https://github.com/cellcog/cine-cog', pricing: 'free', category: '电影级视频', majorCategory: '视频内容创作' },
  { name: 'vidu-mcp-server', icon: '🎥', org: 'Vidu', desc: 'Vidu 视频生成 API MCP 服务器，支持长视频输出和电影级画质', tags: ['长视频', 'MCP'], url: 'https://github.com/vidu/vidu-mcp', pricing: 'paid', category: '电影级视频', majorCategory: '视频内容创作' },

  // ========== 图片生成 ==========
  { name: 'comfyui-workflow', icon: '🧩', org: '开源社区', desc: 'ComfyUI 节点化 AI 绘图工作流，106k Stars。通过可视化拖拽节点搭建复杂的图片生成流水线，支持 SD / FLUX / DALL-E 多种模型', tags: ['节点式', '106k⭐'], url: 'https://github.com/comfyanonymous/ComfyUI', pricing: 'free', category: '图片生成', majorCategory: '视觉设计与生成', isHot: true },
  { name: 'sd-webui-forge', icon: '🎨', org: '开源社区', desc: 'Stable Diffusion WebUI Forge 加速版，最流行的 AI 绘图界面。支持文生图、图生图、Inpainting、ControlNet 全功能', tags: ['SD', '162k⭐'], url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui', pricing: 'free', category: '图片生成', majorCategory: '视觉设计与生成', isHot: true },
  { name: 'openai-image-cli', icon: '🖼️', org: 'OpenAI', desc: '通过 GPT Image / DALL-E API 生成和编辑图片，支持文生图和图片编辑两种模式', tags: ['DALL-E', 'GPT'], url: 'https://github.com/openai/image-cli', pricing: 'paid', category: '图片生成', majorCategory: '视觉设计与生成' },
  { name: 'fal-text-to-image', icon: '⚡', org: 'fal.ai', desc: 'fal.ai 文生图，接入 FLUX / SDXL / Midjourney 等 600+ 模型，按用量计费', tags: ['FLUX', '600+'], url: 'https://github.com/fal-ai/fal-text-to-image', pricing: 'paid', category: '图片生成', majorCategory: '视觉设计与生成' },
  { name: 'gemini-image-gen', icon: '💎', org: 'Google', desc: 'Google Gemini 图片生成，支持 Imagen 3 和 Gemini Flash 模型', tags: ['Gemini', 'Imagen'], url: 'https://github.com/google/gemini-image-mcp', pricing: 'paid', category: '图片生成', majorCategory: '视觉设计与生成' },
  { name: 'flux-image-gen', icon: '⚡', org: 'Black Forest', desc: 'FLUX 新一代文生图模型，25.3k Stars。图片质量和文字理解能力达到 SOTA 水准', tags: ['FLUX', '25.3k⭐'], url: 'https://github.com/black-forest-labs/flux', pricing: 'free', category: '图片生成', majorCategory: '视觉设计与生成' },
  { name: 'controlnet-sd', icon: '🎯', org: '开源社区', desc: 'ControlNet 向扩散模型添加姿态/边缘/深度等条件控制，33.7k Stars，精确控制 AI 绘图的构图和姿势', tags: ['条件控制', '33.7k⭐'], url: 'https://github.com/lllyasviel/ControlNet', pricing: 'free', category: '图片生成', majorCategory: '视觉设计与生成' },
  { name: 'midjourney-api', icon: '🎨', org: 'Midjourney', desc: 'Midjourney v6 图片生成 API 接入，通过 Skill 指令调用 Midjourney 生成高质量艺术图片', tags: ['MJ v6', '艺术'], url: 'https://github.com/midjourney/mj-api', pricing: 'paid', category: '图片生成', majorCategory: '视觉设计与生成' },
  { name: 'grok-image-cli', icon: '🤖', org: 'xAI', desc: '通过 xAI Grok API 生成和编辑图片，支持 Grok 和 Flux 双模型', tags: ['Grok', 'xAI'], url: 'https://github.com/xai/grok-image', pricing: 'paid', category: '图片生成', majorCategory: '视觉设计与生成' },

  // ========== 图像处理 ==========
  { name: 'deep-live-cam', icon: '🎭', org: '开源社区', desc: '实时换脸 + 一键视频深度伪造，只需一张照片即可完成，80k Stars', tags: ['换脸', '80k⭐'], url: 'https://github.com/hacksider/Deep-Live-Cam', pricing: 'free', category: '图像处理', majorCategory: '视觉设计与生成', isHot: true },
  { name: 'faceswap', icon: '🔄', org: '开源社区', desc: '最早的开源深度伪造换脸工具，55k Stars，社区成熟生态完善', tags: ['换脸', '55k⭐'], url: 'https://github.com/deepfakes/faceswap', pricing: 'free', category: '图像处理', majorCategory: '视觉设计与生成' },
  { name: 'eachlabs-image-edit', icon: '🖼️', org: 'EachLabs', desc: '使用 200+ AI 模型编辑和放大图片，一站式图像处理平台', tags: ['200+模型', '编辑'], url: 'https://github.com/eachlabs/image-edit', pricing: 'paid', category: '图像处理', majorCategory: '视觉设计与生成' },
  { name: 'eachlabs-face-swap', icon: '🎭', org: 'EachLabs', desc: 'AI 换脸服务，图片之间高精度面部替换', tags: ['换脸', 'API'], url: 'https://github.com/eachlabs/face-swap', pricing: 'paid', category: '图像处理', majorCategory: '视觉设计与生成' },
  { name: 'image-magik-resize', icon: '📏', org: 'OpenClaw', desc: '使用 ImageMagick 调整图片大小、格式转换和批量处理', tags: ['批量', '格式转换'], url: 'https://github.com/openclaw/image-magik', pricing: 'free', category: '图像处理', majorCategory: '视觉设计与生成' },
  { name: 'openpose-keypoint', icon: '🦴', org: 'CMU', desc: 'OpenPose 实时多人姿态估计，检测身体/手/脸关键点，33.9k Stars', tags: ['姿态', '33.9k⭐'], url: 'https://github.com/CMU-Perceptual-Computing-Lab/openpose', pricing: 'free', category: '图像处理', majorCategory: '视觉设计与生成' },

  // ========== TTS 语音 ==========
  { name: 'gpt-sovits-tts', icon: '🗣️', org: '开源社区', desc: 'GPT-SoVITS 少样本语音克隆系统，仅需 1 分钟音频数据即可训练出高还原度的声音模型。55k Stars，支持中英日韩多语言', tags: ['声音克隆', '55k⭐'], url: 'https://github.com/RVC-Boss/GPT-SoVITS', pricing: 'free', category: 'TTS语音', majorCategory: '音频与语音', isHot: true },
  { name: 'chattts-dialogue', icon: '💬', org: '开源社区', desc: 'ChatTTS 对话场景专用语音合成，带有自然停顿、语气词和情感起伏，38k Stars。特别适合旁白配音和有声读物', tags: ['对话', '38k⭐'], url: 'https://github.com/2noise/ChatTTS', pricing: 'free', category: 'TTS语音', majorCategory: '音频与语音', isHot: true },
  { name: 'elevenlabs-voice', icon: '🎤', org: 'ElevenLabs', desc: '业界公认最逼真的 AI 语音合成服务，支持 29+ 语言、声音克隆和情绪控制。延迟低至 300ms 的流式输出', tags: ['最逼真', '29语言'], url: 'https://github.com/elevenlabs/elevenlabs-skill', pricing: 'paid', category: 'TTS语音', majorCategory: '音频与语音', isHot: true },
  { name: 'fish-speech-tts', icon: '🐟', org: 'FishAudio', desc: 'Fish Speech SOTA 级开源 TTS 系统，中英双语高自然度合成，26k Stars。完全本地部署，免费方案中质量最接近商业服务', tags: ['SOTA', '26k⭐'], url: 'https://github.com/fishaudio/fish-speech', pricing: 'free', category: 'TTS语音', majorCategory: '音频与语音' },
  { name: 'cosyvoice-alibaba', icon: '🏛️', org: '阿里通义', desc: '阿里 CosyVoice 多语言大模型 TTS，仅需 5 秒参考音频即可完成声音克隆，支持多语言和情感控制', tags: ['5秒克隆', '多语言'], url: 'https://github.com/FunAudioLLM/CosyVoice', pricing: 'free', category: 'TTS语音', majorCategory: '音频与语音' },
  { name: 'kokoro-tts-local', icon: '🔊', org: '开源', desc: 'Kokoro-82M 轻量级本地 TTS 引擎，模型仅 82M 参数，CPU 即可运行无需 GPU。延迟极低，适合嵌入到工作流中', tags: ['轻量', 'CPU可用'], url: 'https://github.com/kokoro-tts/kokoro', pricing: 'free', category: 'TTS语音', majorCategory: '音频与语音' },
  { name: 'edge-tts-free', icon: '🌐', org: 'Microsoft', desc: '调用 Microsoft Edge 浏览器内置 TTS 引擎，完全免费无需 API Key，400+ 语音、140+ 语言，零成本配音', tags: ['零成本', '400+音色'], url: 'https://github.com/rany2/edge-tts', pricing: 'free', category: 'TTS语音', majorCategory: '音频与语音' },
  { name: 'clonev-xtts', icon: '🎙️', org: 'Coqui', desc: '基于 Coqui XTTS v2 的声音克隆 Skill，上传声音样本即可生成该声音的 TTS 模型，支持 17 种语言', tags: ['声音克隆', '本地'], url: 'https://github.com/coqui-ai/xtts', pricing: 'free', category: 'TTS语音', majorCategory: '音频与语音' },
  { name: 'bark-text-audio', icon: '🎵', org: 'Suno', desc: 'Bark 文本生成音频模型，支持语音/音乐/音效三种输出，39k Stars。可生成带笑声、叹气等非语言声音', tags: ['多模态', '39k⭐'], url: 'https://github.com/suno-ai/bark', pricing: 'free', category: 'TTS语音', majorCategory: '音频与语音' },
  { name: 'openai-tts-hd', icon: '🔊', org: 'OpenAI', desc: 'OpenAI TTS-1-HD，6 种预置音色，低延迟流式输出，音质自然清晰', tags: ['OpenAI', '流式'], url: 'https://github.com/openai/tts-skill', pricing: 'paid', category: 'TTS语音', majorCategory: '音频与语音' },

  // ========== 音频生成处理 ==========
  { name: 'whisper-transcribe', icon: '👂', org: 'OpenAI', desc: 'OpenAI Whisper 通用语音识别模型，语音转文字准确率极高，95.8k Stars，支持 99 种语言', tags: ['语音识别', '95.8k⭐'], url: 'https://github.com/openai/whisper', pricing: 'free', category: '音频生成处理', majorCategory: '音频与语音', isHot: true },
  { name: 'suno-music-gen', icon: '🎵', org: 'Suno', desc: 'Suno AI 音乐生成服务，输入文字描述即可生成完整歌曲含人声和伴奏，支持多种音乐风格', tags: ['音乐生成', '人声'], url: 'https://github.com/suno/suno-mcp', pricing: 'paid', category: '音频生成处理', majorCategory: '音频与语音' },
  { name: 'faster-whisper-local', icon: '👂', org: '开源', desc: '本地运行的高速语音识别（faster-whisper），无需 API Key，支持 16GB 内存机器自动分块处理', tags: ['本地', '免费'], url: 'https://github.com/SYSTRAN/faster-whisper', pricing: 'free', category: '音频生成处理', majorCategory: '音频与语音' },
  { name: 'eachlabs-music', icon: '🎶', org: 'EachLabs', desc: '使用 Mureka AI 生成歌曲、纯音乐、歌词和播客音频', tags: ['音乐', '歌词'], url: 'https://github.com/eachlabs/music', pricing: 'free', category: '音频生成处理', majorCategory: '音频与语音' },
  { name: 'mcp-musicgpt', icon: '🎹', org: 'MusicGPT', desc: 'MusicGPT AI 音频 API MCP 服务器，24 个工具覆盖音乐生成、变声和音频处理', tags: ['24工具', '变声'], url: 'https://github.com/musicgpt/mcp', pricing: 'paid', category: '音频生成处理', majorCategory: '音频与语音' },
  { name: 'mlx-audio-server', icon: '🔈', org: '开源', desc: '快速、准确、完全本地的 OpenAI 兼容音频 API，基于 Apple MLX 加速框架', tags: ['Apple MLX', '本地'], url: 'https://github.com/mlx/audio-server', pricing: 'free', category: '音频生成处理', majorCategory: '音频与语音' },

  // ========== 剧本写作 ==========
  { name: 'bibigpt-skill', icon: '📝', org: 'OpenClaw', desc: '总结视频/音频内容，自动提炼核心信息，辅助剧本研究和二创', tags: ['总结', '二创'], url: 'https://github.com/bibigpt/bibigpt-skill', pricing: 'free', category: '剧本写作', majorCategory: '剧本与策划' },
  { name: 'youtube-pro', icon: '📺', org: 'OpenClaw', desc: '高级 YouTube 分析工具，提取字幕、元数据和热门趋势，辅助选题和剧本研究', tags: ['YouTube', '选题'], url: 'https://github.com/openclaw/youtube-pro', pricing: 'free', category: '剧本写作', majorCategory: '剧本与策划' },
  { name: 'mcp-youtube-transcript', icon: '📄', org: '开源', desc: '直接下载 YouTube 视频字幕/转录文本，496 Stars，一键获取任意视频的完整文字稿', tags: ['字幕提取', '496⭐'], url: 'https://github.com/anthropics/mcp-server-youtube-transcript', pricing: 'free', category: '剧本写作', majorCategory: '剧本与策划' },
  { name: 'critical-article-writer', icon: '✍️', org: 'OpenClaw', desc: '生成文章草稿和大纲，支持结构化写作，可用于剧本框架搭建', tags: ['大纲', '结构化'], url: 'https://github.com/openclaw/critical-writer', pricing: 'free', category: '剧本写作', majorCategory: '剧本与策划' },

  // ========== 视频策划 ==========
  { name: 'gamma-presentation', icon: '📋', org: 'Gamma', desc: 'AI 驱动的演示文稿和文档创建，支持故事板式内容策划和分镜设计', tags: ['故事板', '分镜'], url: 'https://github.com/gamma/gamma-skill', pricing: 'paid', category: '视频策划', majorCategory: '剧本与策划' },
  { name: 'excalidraw-flowchart', icon: '🎨', org: 'OpenClaw', desc: '从文字描述自动创建 Excalidraw 流程图和故事板，可视化剧本结构', tags: ['流程图', '故事板'], url: 'https://github.com/openclaw/excalidraw-flowchart', pricing: 'free', category: '视频策划', majorCategory: '剧本与策划' },
  { name: 'content-calendar', icon: '📅', org: 'OpenClaw', desc: '生成结构化的社交媒体内容日历，含平台定制帖子和排期', tags: ['排期', '日历'], url: 'https://github.com/openclaw/content-calendar', pricing: 'free', category: '视频策划', majorCategory: '剧本与策划' },
  { name: 'mindmap-generator', icon: '🧠', org: 'OpenClaw', desc: '从文字描述生成可视化思维导图 PNG 图像，适合选题分析和内容规划', tags: ['思维导图', '可视化'], url: 'https://github.com/openclaw/mindmap', pricing: 'free', category: '视频策划', majorCategory: '剧本与策划' },

  // ========== 脚本风格化 ==========
  { name: 'brw-de-ai-ify', icon: '✨', org: 'OpenClaw', desc: '去除 AI 生成的行话和模板感，恢复人类自然语感和写作风格', tags: ['去AI感', '风格化'], url: 'https://github.com/openclaw/de-ai-ify', pricing: 'free', category: '脚本风格化', majorCategory: '剧本与策划' },
  { name: 'nano-banana-prompting', icon: '🍌', org: 'OpenClaw', desc: '自然语言转优化结构化提示词，适配不同风格和场景需求', tags: ['提示词', '风格适配'], url: 'https://github.com/openclaw/nano-banana', pricing: 'free', category: '脚本风格化', majorCategory: '剧本与策划' },
  { name: 'content-recycler', icon: '♻️', org: 'OpenClaw', desc: '将内容转化和复用为多种格式和风格，一鱼多吃式内容运营', tags: ['格式转换', '复用'], url: 'https://github.com/openclaw/content-recycler', pricing: 'free', category: '脚本风格化', majorCategory: '剧本与策划' },

  // ========== 后期自动剪辑 ==========
  { name: 'ffmpeg-video-editor', icon: '✂️', org: 'ClawHub', desc: '自然语言描述剪辑需求，自动转换为 FFmpeg 命令执行。支持裁剪、格式转换、画面比例调整、压缩、音频提取', tags: ['FFmpeg', '自然语言'], url: 'https://github.com/openclaw/ffmpeg-video-editor', pricing: 'free', category: '后期自动剪辑', majorCategory: '后期与工作流', isHot: true },
  { name: 'ffmpeg-master', icon: '🔧', org: 'OpenClaw', desc: 'FFmpeg 高级处理技能，覆盖视频/音频全部处理任务，是 FFmpeg 命令行的 AI 封装', tags: ['FFmpeg', '高级'], url: 'https://github.com/openclaw/ffmpeg-master', pricing: 'free', category: '后期自动剪辑', majorCategory: '后期与工作流' },
  { name: 'ffmpeg-core', icon: '🔧', org: '开源社区', desc: '最强大的多媒体处理框架，编解码/转码/滤镜/合成，57.8k Stars', tags: ['核心', '57.8k⭐'], url: 'https://github.com/FFmpeg/FFmpeg', pricing: 'free', category: '后期自动剪辑', majorCategory: '后期与工作流' },
  { name: 'eachlabs-video-edit', icon: '✂️', org: 'EachLabs', desc: '带口型同步的视频编辑，支持字幕烧录、多语言翻译和自动剪辑', tags: ['口型同步', '字幕'], url: 'https://github.com/eachlabs/video-edit', pricing: 'paid', category: '后期自动剪辑', majorCategory: '后期与工作流' },
  { name: 'ai-video-editor', icon: '🎬', org: 'Sparki', desc: 'Sparki AI 视频编辑器，支持风格复制、长视频转短、AI 字幕、AI 解说、视频缩放、亮点提取、Vlog 和蒙太奇', tags: ['AI剪辑', '8功能'], url: 'https://github.com/sparki/ai-editor', pricing: 'paid', category: '后期自动剪辑', majorCategory: '后期与工作流' },
  { name: 'blender-3d', icon: '🧊', org: '开源社区', desc: '全能 3D 创作套件：建模/动画/渲染/视频编辑/VFX，17.7k Stars', tags: ['3D', 'VFX'], url: 'https://github.com/blender/blender', pricing: 'free', category: '后期自动剪辑', majorCategory: '后期与工作流' },

  // ========== 视频下载 ==========
  { name: 'youtube-skills', icon: '📥', org: '开源', desc: 'YouTube 字幕提取和视频搜索工具包，76 Stars，支持批量下载和元数据分析', tags: ['YouTube', '76⭐'], url: 'https://github.com/openclaw/youtube-skills', pricing: 'free', category: '视频下载', majorCategory: '后期与工作流' },
  { name: 'vidsnatch', icon: '⬇️', org: '开源', desc: 'YouTube 工具包，提供 CLI、Web UI 和 MCP 服务器三种使用方式', tags: ['多入口', '13⭐'], url: 'https://github.com/vidsnatch/vidsnatch', pricing: 'free', category: '视频下载', majorCategory: '后期与工作流' },
  { name: 'media-downloader', icon: '📥', org: '开源', desc: '互联网视频和音频下载工具，支持 A2A 和 MCP 协议，覆盖主流平台', tags: ['通用', 'A2A'], url: 'https://github.com/openclaw/media-downloader', pricing: 'free', category: '视频下载', majorCategory: '后期与工作流' },
  { name: 'douyin-downloader', icon: '📱', org: 'OpenClaw', desc: '抖音视频下载，支持无水印下载和批量采集', tags: ['抖音', '无水印'], url: 'https://github.com/openclaw/douyin-downloader', pricing: 'free', category: '视频下载', majorCategory: '后期与工作流' },
  { name: 'instagram-reels', icon: '📷', org: 'OpenClaw', desc: 'Instagram Reels/视频下载、转码和内容分析', tags: ['Instagram', 'Reels'], url: 'https://github.com/openclaw/instagram-skill', pricing: 'free', category: '视频下载', majorCategory: '后期与工作流' },

  // ========== 工作流引擎 ==========
  { name: 'crazyrouter-mcp', icon: '🔀', org: 'CrazyRouter', desc: '627+ AI 模型统一路由引擎，文本/图片/视频/音频/音乐一体化调用，一个 API 搞定全流程', tags: ['627+模型', '统一路由'], url: 'https://github.com/crazyrouter/mcp', pricing: 'paid', category: '工作流引擎', majorCategory: '后期与工作流' },
  { name: 'krea-ai-mcp', icon: '🌀', org: 'Krea.ai', desc: 'Krea AI 30+ 模型统一生成 — Flux / Hailuo / Runway / Kling / Ideogram / Imagen 全接入', tags: ['30+模型', '统一'], url: 'https://github.com/krea-ai/krea-mcp', pricing: 'paid', category: '工作流引擎', majorCategory: '后期与工作流' },
  { name: 'skills-manager', icon: '📦', org: '开源', desc: '跨平台技能管理器，搜索市场、本地下载、安装到 Claude/Cursor/Windsurf，102 Stars', tags: ['管理器', '102⭐'], url: 'https://github.com/openclaw/skills-manager', pricing: 'free', category: '工作流引擎', majorCategory: '后期与工作流' },
  { name: 'obs-studio', icon: '📹', org: '开源社区', desc: '免费开源直播推流和屏幕录制软件，70.9k Stars', tags: ['直播', '70.9k⭐'], url: 'https://github.com/obsproject/obs-studio', pricing: 'free', category: '工作流引擎', majorCategory: '后期与工作流' },

  // ========== 字幕与翻译 ==========
  { name: 'subtitle-translate', icon: '🔤', org: 'OpenClaw', desc: '翻译 SRT 字幕文件，支持 LLM 驱动的高质量翻译，保留时间轴和格式', tags: ['SRT', '翻译'], url: 'https://github.com/openclaw/subtitle-translate', pricing: 'free', category: '字幕与翻译', majorCategory: '后期与工作流' },
  { name: 'captions-extract', icon: '📝', org: 'OpenClaw', desc: '从 YouTube 视频中提取闭合字幕/字幕文件', tags: ['提取', 'YouTube'], url: 'https://github.com/openclaw/captions', pricing: 'free', category: '字幕与翻译', majorCategory: '后期与工作流' },
  { name: 'gifhorse', icon: '🎥', org: 'OpenClaw', desc: '搜索视频对话并创建带字幕的反应 GIF 动图', tags: ['GIF', '字幕'], url: 'https://github.com/openclaw/gifhorse', pricing: 'paid', category: '字幕与翻译', majorCategory: '后期与工作流' },

  // ========== AI 模型调用 ==========
  { name: 'kie-ai-mcp', icon: '🤖', org: 'Kie.ai', desc: 'Kie.ai MCP 服务器，30 个图片/视频/音频生成工具统一调用', tags: ['30工具', '统一'], url: 'https://github.com/kie-ai/kie-mcp', pricing: 'paid', category: 'AI模型调用', majorCategory: '后期与工作流' },
  { name: 'replicate-models', icon: '🔁', org: 'Replicate', desc: 'Replicate 平台 API，一站式调用数千个开源 AI 模型，按用量付费', tags: ['数千模型', '按量'], url: 'https://github.com/replicate/replicate-mcp', pricing: 'paid', category: 'AI模型调用', majorCategory: '后期与工作流' },

  // ========== 社媒发布 ==========
  { name: 'youtube-publisher', icon: '📤', org: 'OpenClaw', desc: '让 AI Agent 上传录制内容到 YouTube，自动处理标题、描述和标签', tags: ['YouTube', '上传'], url: 'https://github.com/openclaw/youtube-publisher', pricing: 'free', category: '社媒发布', majorCategory: '后期与工作流' },
  { name: 'instagram-api', icon: '📸', org: 'OpenClaw', desc: '发布到 Instagram（Feed/Story/Reels/Carousel）和 Threads', tags: ['Instagram', '多格式'], url: 'https://github.com/openclaw/instagram-api', pricing: 'free', category: '社媒发布', majorCategory: '后期与工作流' },
  { name: 'metricool', icon: '📊', org: 'OpenClaw', desc: '社交媒体内容排期和管理工作流，多平台统一发布', tags: ['排期', '多平台'], url: 'https://github.com/openclaw/metricool', pricing: 'free', category: '社媒发布', majorCategory: '后期与工作流' },

  // ========== 素材搜索 ==========
  { name: 'video-frames', icon: '🖼️', org: 'OpenClaw', desc: '从视频文件中提取关键帧用于分析和素材采集', tags: ['提取帧', '分析'], url: 'https://github.com/openclaw/video-frames', pricing: 'free', category: '素材搜索', majorCategory: '视觉设计与生成' },
  { name: 'youtube-thumbnail-gen', icon: '🖼️', org: 'OpenClaw', desc: '通过 AI 生成吸睛的 YouTube 缩略图', tags: ['缩略图', 'YouTube'], url: 'https://github.com/openclaw/thumbnail-gen', pricing: 'paid', category: '素材搜索', majorCategory: '视觉设计与生成' },

  // ========== 3D 与动画 ==========
  { name: '3d-model-generation', icon: '🧊', org: 'each::sense', desc: '通过 AI 生成 3D 模型，支持文字描述和图片输入', tags: ['3D', '文生模型'], url: 'https://github.com/eachsense/3d-gen', pricing: 'paid', category: '3D与动画', majorCategory: '视觉设计与生成' },
  { name: 'acestep-simplemv', icon: '🎬', org: 'ACE', desc: '从音频文件和歌词自动渲染音乐视频，基于 Remotion 框架', tags: ['MV', 'Remotion'], url: 'https://github.com/ace/acestep-simplemv', pricing: 'free', category: '3D与动画', majorCategory: '视觉设计与生成' },
];

// 统计辅助函数
export function getSkillsByCategory(category: string): SkillItem[] {
  return ALL_SKILLS.filter(s => s.category === category);
}

export function getSkillsByMajorCategory(major: string): SkillItem[] {
  return ALL_SKILLS.filter(s => s.majorCategory === major);
}

export function getTop100Skills(): SkillItem[] {
  // 每个大门类取 top skills
  const top: SkillItem[] = [];
  for (const mc of MAJOR_CATEGORIES) {
    const skills = getSkillsByMajorCategory(mc.key);
    // hot 的优先
    const sorted = [...skills].sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0));
    top.push(...sorted.slice(0, 20));
  }
  return top;
}

export function getFreeSkills(): SkillItem[] {
  return ALL_SKILLS.filter(s => s.pricing === 'free');
}

export function getPaidSkills(): SkillItem[] {
  return ALL_SKILLS.filter(s => s.pricing === 'paid');
}

export function getCategoryStats() {
  return SKILL_SUB_CATEGORIES.map(cat => ({
    ...cat,
    count: cat.displayCount,
  }));
}
