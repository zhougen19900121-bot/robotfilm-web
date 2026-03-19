// Content safety filter — block sensitive/garbage content before it enters the database

const BLOCKED_PATTERNS = [
  /色情|赌博|毒品|枪支|暴力|恐怖/,
  /习近平|共产党|法轮功|天安门|六四/,
  /fuck|shit|porn|sex|gambling/i,
  /(.)\1{10,}/, // repeated characters (spam)
];

const MAX_LENGTH = 2000;
const MIN_LENGTH = 2;

export function isSafe(content: string): boolean {
  if (!content || content.length < MIN_LENGTH || content.length > MAX_LENGTH) {
    return false;
  }
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(content)) {
      console.warn('[Safety] Blocked content matching pattern:', pattern.source);
      return false;
    }
  }
  return true;
}

// Sanitize content to prevent XSS when stored in DB
export function sanitize(content: string): string {
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .trim();
}
