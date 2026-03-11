import Groq from "groq-sdk";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are a helpful, friendly, and knowledgeable personal AI assistant. You provide clear, concise, and accurate responses. You can help with coding, writing, analysis, math, general knowledge, and creative tasks. When you write code, use markdown code blocks with the language specified. Be conversational but professional.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const chatMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 4096,
      stream: false,
    });

    const content = completion.choices[0]?.message?.content || "";

    return Response.json({ content });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}
