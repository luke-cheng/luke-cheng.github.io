import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ status: 'error', error: 'GOOGLE_API_KEY is not configured' }, { status: 500 });
    }
    if (process.env.GOOGLE_API_KEY.length < 10) {
      return NextResponse.json({ status: 'error', error: 'Invalid GOOGLE_API_KEY format' }, { status: 500 });
    }
    // Try a minimal Gemini call
    const result = await streamText({
      model: google("gemma-3-1b-it"),
      messages: [{ role: 'user', content: 'ping' }],
      temperature: 0.1,
      maxTokens: 5,
    });
    // Use toDataStream() to get a ReadableStream and try to read from it
    const stream = result.toDataStream();
    const reader = stream.getReader();
    await reader.read();
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    return NextResponse.json({ status: 'error', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}