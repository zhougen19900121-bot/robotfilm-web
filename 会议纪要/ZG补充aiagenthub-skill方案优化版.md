# aiagenthub.top - Skill板块完整技术方案

## 一、项目背景

打造全球首个 **AI Agent影视制作Skills一站式平台**，整合全球30+顶级AI平台资源，为AI Agent和创作者提供完整工作流支持。

---

## 二、参考平台分析

### 国际平台

| 平台 | 核心特色 | 官网 |
|------|---------|------|
| LibTV | 双入口+全流程工作流 | liblib.tv |
| RunningHub | 170+API全栈整合 | runninghub.ai |
| Replicate | 100+模型聚合 | replicate.com |
| ComfyUI | 开源节点工作流 | github.com/comfyanonymous |
| Leonardo.ai | 实时AI图像 | leonardo.ai |
| Suno | AI音乐生成 | suno.ai |
| ElevenLabs | 顶级TTS | elevenlabs.io |
| Zapier | 8000+应用自动化 | zapier.com |

### 国产平台

| 平台 | 核心特色 | 价格 |
|------|---------|------|
| 可灵3.0 | 3分钟视频 | ¥1/分钟 |
| 通义万相 | 免费国产 | 免费 |
| Seedance | 字节跳动 | ¥0.5/分钟 |
| 海螺AI | 快手 | ¥0.3/分钟 |

---

## 三、网站板块设计（10大板块）

```
┌─────────────────────────────────────────────┐
│              aiagenthub.top                 │
│           AI影视制作Skills专区              │
├─────────────────────────────────────────────┤
│ 🏠首页 │ 🎬视频 │ 🖼️图像 │ 🎵音频 │ ⚡工作流 │
│ 📺短剧 │ 🎬广告 │ 💰免费 │ 📦付费 │ 🔧工具  │
└─────────────────────────────────────────────┘
```

### 详细分类

| 板块 | 数据量 | 说明 |
|------|--------|------|
| 🎬 视频生成 | 300+ | 国际+国产+聚合 |
| 🖼️ 图像生成 | 250+ | MJ/Flux/SD |
| 🎵 音频音乐 | 150+ | 音乐+TTS |
| ⚡ 工作流 | 50+ | 预制+自定义 |
| 📺 短剧 | 30+ | 场景方案 |
| 🎬 广告 | 20+ | TVC+电商 |
| 💰 免费区 | 50+ | 无限使用 |
| 🔧 工具 | 60+ | 下载/效率 |

---

## 四、核心Skills列表

### 4.1 视频生成（国际）

| Skill | 平台 | 功能 | 安装 |
|-------|------|------|------|
| skill-runway-video-gen | Runway Gen4 | 短视频 | npx clawhub install skill-runway-video-gen |
| pika | Pika | 快速生成 | npx clawhub install pika |
| sora | OpenAI Sora | 长视频 | npx clawhub install sora |
| luma-video | Luma Dream | 3D视频 | npx clawhub install luma-video |

### 4.2 视频生成（国产）

| Skill | 平台 | 功能 | 价格 |
|-------|------|------|------|
| kling-video | 可灵3.0 | 视频生成 | ¥1/分钟 |
| cn-video-gen | 通义万相 | 免费国产 | 免费 |
| seedance | Seedance | 字节 | ¥0.5/分钟 |
| hailuo-video | 海螺AI | 快手 | ¥0.3/分钟 |

### 4.3 图像生成

| Skill | 平台 | 安装 |
|-------|------|------|
| midjourney | Midjourney | npx clawhub install midjourney |
| flux | FLUX | npx clawhub install flux |
| nano-banana-pro | Nano-banana | npx clawhub install nano-banana-pro |
| leonardo-ai | Leonardo | npx clawhub install leonardo-ai |
| comfyui | ComfyUI | npx clawhub install comfyui |

### 4.4 音频/音乐

| Skill | 功能 | 安装 |
|-------|------|------|
| suno | AI音乐 | npx clawhub install suno |
| music-cog | 5秒-10分钟 | npx clawhub install music-cog |
| elevenlabs | 顶级TTS | npx clawhub install elevenlabs |
| edge-tts | 免费TTS | npx clawhub install edge-tts |
| audio-mastering-cli | 母带处理 | npx clawhub install audio-mastering-cli |

### 4.5 工作流（核心！）

| 工作流 | 描述 | Skills组合 |
|--------|------|------------|
| LibTV模式 | 剧本→分镜→成片 | libtv+video+image+tts |
| RHClaw模式 | 170+API全栈 | rhclaw全调用 |
| 短剧一键生成 | 主题→成片 | story+video+tts |
| 广告TVC | 产品图→成片 | image+video+audio |
| 音乐MV | 歌曲→MV | suno+video+subtitle |

### 4.6 免费区

| Skill | 功能 |
|-------|------|
| video-aroll-auto-editor | 自动粗剪 |
| ffmpeg-cli | FFmpeg处理 |
| yt-dlp-downloader | YouTube/B站下载 |
| cn-video-gen | 国产视频 |
| writing-style-iterator | 写作优化 |

---

## 五、数据库设计

### 5.1 Skills表
```sql
CREATE TABLE skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100),
  source VARCHAR(50),           -- ClawHub/LibTV/RunningHub
  category VARCHAR(50),          -- 一级分类
  sub_category VARCHAR(50),     -- 二级分类
  description TEXT,              -- 英文描述
  description_zh TEXT,          -- 中文描述
  is_free BOOLEAN DEFAULT TRUE,
  price DECIMAL(10,2),
  api_count INT DEFAULT 0,
  is_workflow BOOLEAN DEFAULT FALSE,
  install_command VARCHAR(200),
  downloads INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 5.00,
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5.2 分类表
```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  name_zh VARCHAR(50),
  slug VARCHAR(50),
  icon VARCHAR(20),
  parent_id INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  skill_count INT DEFAULT 0
);
```

### 5.3 工作流模板表
```sql
CREATE TABLE workflows (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  description TEXT,
  steps JSON,                   -- 步骤数组
  skills_needed JSON,          -- 所需Skills
  scene VARCHAR(50),            -- 适用场景
  is_popular BOOLEAN DEFAULT FALSE,
  usage_count INT DEFAULT 0
);
```

### 5.4 用户表
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50),
  email VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user',
  credits INT DEFAULT 0,
  membership_type VARCHAR(20),
  membership_expire DATE
);
```

---

## 六、API接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/skills | GET | Skills列表 |
| /api/skills/:id | GET | Skills详情 |
| /api/skills/search | GET | 搜索 |
| /api/categories | GET | 分类列表 |
| /api/workflows | GET | 工作流 |
| /api/recommend | POST | 智能推荐 |

### 筛选参数
```
category: 分类
is_free: 是否免费
source: 来源
tags: 标签
search: 关键词
sort: downloads/rating/newest
```

---

## 七、变现模式

| 套餐 | 价格 | 权益 |
|------|------|------|
| 体验卡 | ¥9.9 | 100积分 |
| 月卡 | ¥29 | 无限使用 |
| 年卡 | ¥199 | 全部+API |
| 企业 | 定制 | 私有部署 |

---

## 八、开发计划

### Phase 1（2周）
- [ ] 基础框架
- [ ] 100+核心Skills
- [ ] 用户系统

### Phase 2（2周）
- [ ] 工作流中心
- [ ] 智能推荐
- [ ] 支付系统

### Phase 3（2周）
- [ ] 运营推广
- [ ] 数据分析
- [ ] 优化迭代

---

## 九、核心指标

| 指标 | 3个月目标 |
|------|-----------|
| Skills | 2000+ |
| 用户 | 10,000+ |
| 日活 | 1000+ |
| 转化 | 5% |

---

*更新时间: 2026-03-19*
