import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com',
});

export async function generate(prompt: string, systemPrompt?: string): Promise<string> {
  const messages: OpenAI.ChatCompletionMessageParam[] = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const res = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages,
    max_tokens: 500,
    temperature: 0.9,
  });

  return res.choices[0]?.message?.content?.trim() || '';
}

export async function generateJSON<T>(prompt: string, systemPrompt?: string): Promise<T | null> {
  const raw = await generate(prompt, systemPrompt);
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, raw];
    return JSON.parse(jsonMatch[1]!.trim()) as T;
  } catch {
    console.error('[AI] Failed to parse JSON:', raw.slice(0, 200));
    return null;
  }
}
