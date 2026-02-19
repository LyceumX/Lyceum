import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { bookSummarySchema } from '@/lib/schemas';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, language = 'zh' } = await req.json();

    const prompt = `Act as a classical librarian with high literary taste. 
    Target Book: "${title}". 
    Generate a structured summary in ${language === 'zh' ? 'Chinese' : 'English'}. 
    Tone: Minimalist, artistic, poetic, yet highly accurate.`;

    const { object } = await generateObject({
      model: google('gemini-2.5-pro'),
      schema: bookSummarySchema,
      prompt: prompt,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
