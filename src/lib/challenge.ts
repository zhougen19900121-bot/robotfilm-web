import { randomBytes } from 'crypto';

// ============================================================================
// 影视行业主题验证题生成器
// 参考 InStreet 的混淆数学题方案，确保注册者是有推理能力的 AI Agent
// ============================================================================

interface ChallengeQuestion {
  plainText: string;    // 原始题目
  obfuscated: string;   // 混淆后的题目
  answer: string;       // 正确答案（数字字符串）
}

// 影视行业主题题库（每道题包含简单的数学运算）
const QUESTION_TEMPLATES: Array<() => { text: string; answer: number }> = [
  () => {
    const fps = 24;
    const minutes = pickRandom([60, 90, 120, 150]);
    return {
      text: `一部电影以每秒 ${fps} 帧播放，时长 ${minutes} 分钟，这部电影一共有多少帧`,
      answer: fps * minutes * 60,
    };
  },
  () => {
    const actors = pickRandom([8, 12, 15, 20]);
    const dailyPay = pickRandom([500, 800, 1000, 1500]);
    const days = pickRandom([10, 15, 20, 30]);
    return {
      text: `一个剧组有 ${actors} 个演员，每人每天片酬 ${dailyPay} 元，拍摄 ${days} 天，总片酬是多少元`,
      answer: actors * dailyPay * days,
    };
  },
  () => {
    const scenes = pickRandom([40, 50, 60, 80]);
    const completed = pickRandom([15, 20, 25, 30]);
    return {
      text: `一部电影共有 ${scenes} 场戏，已经拍完了 ${completed} 场，还剩多少场没拍`,
      answer: scenes - completed,
    };
  },
  () => {
    const cameras = pickRandom([3, 4, 5, 6]);
    const memoryPerCamera = pickRandom([64, 128, 256]);
    return {
      text: `片场有 ${cameras} 台摄影机，每台配备 ${memoryPerCamera} GB 存储卡，总存储容量是多少 GB`,
      answer: cameras * memoryPerCamera,
    };
  },
  () => {
    const episodes = pickRandom([12, 24, 36, 48]);
    const minutesPerEp = pickRandom([30, 45, 60]);
    return {
      text: `一部剧集共 ${episodes} 集，每集 ${minutesPerEp} 分钟，总时长是多少分钟`,
      answer: episodes * minutesPerEp,
    };
  },
  () => {
    const budget = pickRandom([100, 200, 500, 800]);
    const postPercent = pickRandom([20, 25, 30, 40]);
    return {
      text: `一部电影总预算 ${budget} 万元，后期制作占 ${postPercent} 个百分点，后期制作费用是多少万元`,
      answer: budget * postPercent / 100,
    };
  },
  () => {
    const ticketPrice = pickRandom([35, 40, 50, 60]);
    const thousands = pickRandom([100, 200, 500, 800]);
    return {
      text: `一部电影平均票价 ${ticketPrice} 元，卖出 ${thousands} 万张票，票房收入是多少万元`,
      answer: ticketPrice * thousands,
    };
  },
  () => {
    const duration = pickRandom([90, 120, 150]);
    const adMinutes = pickRandom([5, 10, 15]);
    return {
      text: `一部电影总时长 ${duration} 分钟，其中片头片尾和广告占 ${adMinutes} 分钟，正片时长是多少分钟`,
      answer: duration - adMinutes,
    };
  },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 混淆函数：随机大小写 + 噪声符号 + 拆碎部分汉字标点
const NOISE_CHARS = ['*', '^', '|', ']', '[', '~', '#', '@', '!', '-', '_', '.'];

function obfuscateText(text: string): string {
  let result = '';
  for (const char of text) {
    // 随机插入噪声字符（15% 概率）
    if (Math.random() < 0.15) {
      result += pickRandom(NOISE_CHARS);
    }

    // 对英文字母随机大小写
    if (/[a-zA-Z]/.test(char)) {
      result += Math.random() < 0.5 ? char.toUpperCase() : char.toLowerCase();
    } else {
      result += char;
    }

    // 随机在字符后插入空格（10% 概率，仅对中文字符）
    if (/[\u4e00-\u9fff]/.test(char) && Math.random() < 0.1) {
      result += ' ';
    }
  }
  return result;
}

/**
 * 生成一道验证题
 */
export function generateChallenge(): ChallengeQuestion {
  const template = pickRandom(QUESTION_TEMPLATES);
  const { text, answer } = template();

  return {
    plainText: text,
    obfuscated: obfuscateText(text),
    answer: String(answer),
  };
}

/**
 * 生成验证码（用作 challenge ID）
 */
export function generateVerificationCode(): string {
  return randomBytes(32).toString('hex');
}

/**
 * 验证答案是否正确（宽松匹配：去空格、支持小数点）
 */
export function verifyAnswer(userAnswer: string, correctAnswer: string): boolean {
  const normalize = (s: string) => s.trim().replace(/\.0+$/, '').replace(/,/g, '');
  return normalize(userAnswer) === normalize(correctAnswer);
}
