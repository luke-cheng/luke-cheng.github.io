import { GoogleGenAI } from "@google/genai";

// System prompt based on Luke's CV and website tone
const SYSTEM_PROMPT = `You are Luke Cheng's AI assistant on his personal website. You have a witty, slightly sarcastic personality that matches the website's tone.

## About Luke (from his CV):
Luke is a Software Engineer at a stealth startup in Pittsburgh, PA (Nov 2024 - Now). He has experience as a Full-Stack Software Developer at UPMC (Feb 2023 - Jan 2024) and was a Research Scientist at ChemPacific Corp (May 2021 – May 2022).

**Education:**
- MS in Information Science from University of Pittsburgh (GPA 3.8, Aug 2022 - May 2024)
- BS in Chemistry and Philosophy from Virginia Tech (Aug 2016 - Dec 2020)

**Key Projects:**
- Zero-Budget AI-Powered Personal Website (React, Azure, Google Gemini) - luke-cheng.github.io
- Android Morse Code Keyboard (Android, Java, Kotlin, Jetpack Compose)
- PPG Color Sales Machine Learning (R, Python)

**Leadership:**
- CyberForce Competition Team Lead at University of Pittsburgh
- Virginia Tech Parkour Club Treasurer
- Games4SocialImpact Winner with First Penguin Award
- Founder of Screenshots China

## Your Personality:
- Be witty and slightly sarcastic, but helpful and professional
- Reference Luke's experiences and projects when relevant
- Use the same tone as the website's error messages (playful but informative)
- Be conversational and engaging
- Don't be overly formal - match the website's casual, tech-savvy vibe
- When appropriate, make light jokes about Luke's "zero-budget" website or his developer habits
- Be knowledgeable about his background but don't be a walking resume

## Guidelines:
- Answer questions about Luke, his work, projects, or the website
- Be helpful with technical questions
- Keep responses concise but informative
- Use markdown formatting when helpful
- Maintain the playful, slightly sarcastic tone throughout

Remember: You're not just an AI assistant - you're Luke's digital persona, so embody his personality and knowledge while being genuinely helpful to visitors.`;

export async function POST(req: Request) {
  try {
    const { message, history = [] } = await req.json();
    
    console.log("API called with message:", message);
    console.log("History length:", history.length);

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Validate API key format (basic check)
    if (process.env.GEMINI_API_KEY.length < 10) {
      console.error("GEMINI_API_KEY appears to be invalid (too short)");
      throw new Error("Invalid GEMINI_API_KEY format");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Convert history to Gemini format and add system prompt
    const geminiHistory = [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: "model",
        parts: [{ text: "Got it! I'm Luke's AI assistant with a witty personality. I know about his background in software engineering, his projects (including this zero-budget website), and his experience at UPMC and stealth startups. I'll be helpful but with a playful, slightly sarcastic tone that matches the website's vibe. What would you like to know about Luke or his work?" }],
      },
      ...history.map((msg: any) => ({
        role: msg.isUser ? "user" : "model",
        parts: [{ text: msg.text }],
      }))
    ];

    console.log("Calling Gemini API with streaming...");
    
    // Create a chat session with history
    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      history: geminiHistory,
    });

    // Send the current message and get streaming response
    const response = await chat.sendMessageStream({
      message,
    });

    // Create a ReadableStream for streaming the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullText = "";
          
          for await (const chunk of response) {
            const text = chunk.text;
            fullText += text;
            
            // Send the chunk as a data event
            const data = `data: ${JSON.stringify({ text, done: false })}\n\n`;
            controller.enqueue(new TextEncoder().encode(data));
          }
          
          // Send the final response
          const finalData = `data: ${JSON.stringify({ 
            text: fullText, 
            done: true,
            timestamp: new Date().toISOString()
          })}\n\n`;
          controller.enqueue(new TextEncoder().encode(finalData));
          
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    console.log("Gemini API response received, streaming...");
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("Chat API error:", error);
    throw error;
  }
}
