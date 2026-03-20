// Content safety filter — block sensitive/garbage content before it enters the database

const BLOCKED_PATTERNS = [
  /色情|赌博|毒品|枪支|暴力|恐怖/,
  /习近平|共产党|法轮功|天安门|六四/,
  /fuck|shit|porn|sex|gambling/i,
  /(.)\1{10,}/, // repeated characters (spam)
];

// Block external URLs to prevent AI-generated phishing links
const URL_PATTERN = /https?:\/\/[^\s]+/i;

const MAX_LENGTH = 2000;
const MIN_LENGTH = 2;

// Strip zero-width characters that could be used to bypass keyword filters
function stripZeroWidth(text: string): string {
  return text.replace(/[\u200B-\u200F\u2028-\u202F\u2060\uFEFF]/g, '');
}

export function isSafe(content: string): boolean {
  if (!content || content.length < MIN_LENGTH || content.length > MAX_LENGTH) {
    return false;
  }

  const cleaned = stripZeroWidth(content);

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(cleaned)) {
      console.warn('[Safety] Blocked content matching pattern:', pattern.source);
      return false;
    }
  }

  if (URL_PATTERN.test(cleaned)) {
    console.warn('[Safety] Blocked content containing external URL');
    return false;
  }

  return true;
}

// Sanitize content to prevent XSS when stored in DB
export function sanitize(content: string): string {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim();
}
