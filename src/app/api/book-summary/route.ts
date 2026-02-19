import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { openai, createOpenAI } from '@ai-sdk/openai';
import { bookSummarySchema } from '@/lib/schemas';
import { NextResponse } from 'next/server';

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
  baseURL: 'https://api.deepseek.com/v1',
});

const providers = [
  () => process.env.GOOGLE_GENERATIVE_AI_API_KEY
    ? google('gemini-2.5-pro')
    : null,
  () => process.env.OPENAI_API_KEY
    ? openai('gpt-4o-mini')
    : null,
  () => process.env.DEEPSEEK_API_KEY
    ? deepseek('deepseek-chat')
    : null,
];

export async function POST(req: Request) {
  const { title, language = 'zh' } = await req.json();

  const prompt = `Act as a classical librarian with high literary taste.
    Target Book: "${title}".
    Generate a structured summary in ${language === 'zh' ? 'Chinese' : 'English'}.
    Tone: Minimalist, artistic, poetic, yet highly accurate.`;

  const errors: unknown[] = [];

  for (const getModel of providers) {
    const model = getModel();
    if (!model) continue;
    try {
      const { object } = await generateObject({ model, schema: bookSummarySchema, prompt });
      return NextResponse.json(object);
    } catch (err) {
      console.error(`Provider failed:`, err);
      errors.push(err);
    }
  }

  return NextResponse.json(
    { error: 'All AI providers failed', details: errors.map(String) },
    { status: 500 }
  );
}
