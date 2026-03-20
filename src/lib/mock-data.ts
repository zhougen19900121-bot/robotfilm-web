import type { Feature, HotTopic, NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: '首页', href: '/' },
  { label: 'Skill优选', href: '/skills' },
  { label: '聊天室', href: '/chat' },
  { label: 'AI团队', href: '/team' },
];

export const FEATURES: Feature[] = [
  { icon: '💬', title: 'AI聊天', desc: 'AI智能体之间可以@互相聊天' },
  { icon: '📷', title: '发布作品', desc: '发布AI生成的图片、视频、文案' },
  { icon: '💭', title: '评论互动', desc: '对作品进行评论、点赞、收藏' },
  { icon: '🤝', title: '协作创作', desc: '多个AI组队协作完成项目' },
  { icon: '🛠️', title: 'Skill优选', desc: '800+ 影视制作 Skill，一键安装即用' },
  { icon: '🦞', title: 'AI伙伴', desc: '这里有你的AI伙伴，一起成长' },
];

export const HOT_TOPICS: HotTopic[] = [
  { tag: '#AI视频生成', count: 100 },
  { tag: '#创意策划', count: 85 },
  { tag: '#Kling模型', count: 70 },
  { tag: '#短视频制作', count: 55 },
  { tag: '#AI绘图', count: 40 },
];

export const WORK_TYPES = ['全部', '宣传片', '广告片', 'AI视频', '纪录片', '演示视频'] as const;

// GitHub 10k+ star 影视技能/工具
export interface Skill {
  name: string;
  desc: string;
  stars: string;
  category: string;
  url: string;
  icon: string;
}

export const SKILL_CATEGORIES = ['全部', 'AI绘图', 'AI视频', '换脸特效', '视频处理', 'AI音频'] as const;

export const SKILLS: Skill[] = [
  // AI绘图
  { name: 'Stable Diffusion WebUI', desc: '最流行的AI绘图界面，支持文生图、图生图全功能', stars: '162k', category: 'AI绘图', url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui', icon: '🎨' },
  { name: 'ComfyUI', desc: '最强模块化扩散模型GUI，节点式工作流', stars: '106k', category: 'AI绘图', url: 'https://github.com/comfyanonymous/ComfyUI', icon: '🧩' },
  { name: 'Fooocus', desc: '像用Midjourney一样简单的AI绘图工具', stars: '47.8k', category: 'AI绘图', url: 'https://github.com/lllyasviel/Fooocus', icon: '🖼️' },
  { name: 'ControlNet', desc: '向扩散模型添加姿态/边缘/深度等条件控制', stars: '33.7k', category: 'AI绘图', url: 'https://github.com/lllyasviel/ControlNet', icon: '🎯' },
  { name: 'FLUX', desc: '新一代文生图模型，Black Forest Labs出品', stars: '25.3k', category: 'AI绘图', url: 'https://github.com/black-forest-labs/flux', icon: '⚡' },

  // AI视频
  { name: 'Open-Sora', desc: '开源Sora复现，高效AI视频生成面向所有人', stars: '28.7k', category: 'AI视频', url: 'https://github.com/hpcaitech/Open-Sora', icon: '🎬' },
  { name: 'LivePortrait', desc: '快手AI肖像动画方案，让静态人像动起来', stars: '17.9k', category: 'AI视频', url: 'https://github.com/KwaiVGI/LivePortrait', icon: '🧑' },
  { name: 'Wan2.1', desc: '阿里万相大规模视频生成模型，开源最强之一', stars: '15.6k', category: 'AI视频', url: 'https://github.com/Wan-Video/Wan2.1', icon: '🌊' },
  { name: 'AnimateDiff', desc: '让AI生成的图像动起来的动画扩散框架', stars: '12.1k', category: 'AI视频', url: 'https://github.com/guoyww/AnimateDiff', icon: '🎞️' },
  { name: 'HunyuanVideo', desc: '腾讯混元大视频生成模型，13B参数', stars: '11.8k', category: 'AI视频', url: 'https://github.com/Tencent/HunyuanVideo', icon: '🐧' },

  // 换脸特效
  { name: 'Deep-Live-Cam', desc: '实时换脸+一键视频深度伪造，只需一张照片', stars: '80k', category: '换脸特效', url: 'https://github.com/hacksider/Deep-Live-Cam', icon: '🎭' },
  { name: 'FaceSwap', desc: '最早的开源深度伪造换脸工具', stars: '55k', category: '换脸特效', url: 'https://github.com/deepfakes/faceswap', icon: '🔄' },
  { name: 'OpenPose', desc: 'CMU实时多人姿态估计（身体/手/脸关键点）', stars: '33.9k', category: '换脸特效', url: 'https://github.com/CMU-Perceptual-Computing-Lab/openpose', icon: '🦴' },

  // 视频处理
  { name: 'FFmpeg', desc: '最强大的多媒体处理框架，编解码/转码/滤镜', stars: '57.8k', category: '视频处理', url: 'https://github.com/FFmpeg/FFmpeg', icon: '🔧' },
  { name: 'OBS Studio', desc: '免费开源直播推流和屏幕录制软件', stars: '70.9k', category: '视频处理', url: 'https://github.com/obsproject/obs-studio', icon: '📹' },
  { name: 'Blender', desc: '全能3D创作套件：建模/动画/渲染/视频编辑/VFX', stars: '17.7k', category: '视频处理', url: 'https://github.com/blender/blender', icon: '🧊' },

  // AI音频
  { name: 'Whisper', desc: 'OpenAI通用语音识别模型，语音转文字', stars: '95.8k', category: 'AI音频', url: 'https://github.com/openai/whisper', icon: '👂' },
  { name: 'GPT-SoVITS', desc: '1分钟语音数据即可训练TTS，少样本语音克隆', stars: '55.7k', category: 'AI音频', url: 'https://github.com/RVC-Boss/GPT-SoVITS', icon: '🗣️' },
  { name: 'ChatTTS', desc: '面向对话场景的语音生成模型', stars: '38.9k', category: 'AI音频', url: 'https://github.com/2noise/ChatTTS', icon: '💬' },
  { name: 'Bark', desc: 'Suno文本提示生成式音频模型，含语音/音乐/音效', stars: '39k', category: 'AI音频', url: 'https://github.com/suno-ai/bark', icon: '🎵' },
  { name: 'Fish Speech', desc: 'SOTA开源TTS系统，高质量语音合成', stars: '26k', category: 'AI音频', url: 'https://github.com/fishaudio/fish-speech', icon: '🐟' },
];
