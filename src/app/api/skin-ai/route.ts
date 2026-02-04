import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Simple in-memory rate limit map: key -> { count, last }
const rateLimitMap = new Map<string, { count: number; last: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5; // per window
const MIN_INTERVAL_MS = 10 * 1000; // also enforce 10s spacing

const MODEL = process.env.NEXT_GROQ_MODEL || "openai/gpt-oss-120b";
const CHAT_MAX_TOKENS = Number(process.env.NEXT_GROQ_MAX_TOKENS || 2048);
const ANALYSIS_MAX_TOKENS = Number(process.env.NEXT_GROQ_ANALYSIS_MAX_TOKENS || 256);

const ANALYSIS_PROMPT =
  "You are an Indonesian dermatology assistant. Analyze the user's skin profile based on their answers. " +
  "Return ONLY a comma-separated list of short keywords (max 2-3 words per keyword). " +
  "Example: 'Kulit Berminyak, Rentan Jerawat, Pori Besar'. " +
  "No bullet points, no numbering, no introductions or conclusions—just the keywords.";

const CHAT_PROMPT =
  "You are an Indonesian dermatology and skincare assistant. Be empathetic, concise, and practical. " +
  "Give routine suggestions, ingredient tips, and safety notes (patch test, avoid mixing strong actives, consult a doctor for severe cases). " +
  "Respond conversationally in Indonesian.";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.NEXT_GROQ_API || process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GROQ API key" }, { status: 500 });
    }

    const body = await req.json();
    const mode = body?.mode === "analysis" ? "analysis" : "chat";
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    // Rate limit by IP (fallback) or provided userId
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "anon";
    const userId = typeof body?.userId === "string" && body.userId.length <= 128 ? body.userId : "";
    const key = userId || ip;
    const now = Date.now();
    const entry = rateLimitMap.get(key);
    if (entry) {
      const withinWindow = now - entry.last < WINDOW_MS;
      const tooSoon = now - entry.last < MIN_INTERVAL_MS;
      const count = withinWindow ? entry.count + 1 : 1;
      if (tooSoon || count > MAX_REQUESTS) {
        return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
      }
      rateLimitMap.set(key, { count, last: now });
    } else {
      rateLimitMap.set(key, { count: 1, last: now });
    }

    const isAnalysis = mode === "analysis";
    const systemPrompt = isAnalysis ? ANALYSIS_PROMPT : CHAT_PROMPT;
    const temperature = isAnalysis ? 0.3 : 0.6;
    const maxTokens = isAnalysis ? ANALYSIS_MAX_TOKENS : CHAT_MAX_TOKENS;

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m?.role === "user" ? "user" : "assistant",
        content: String(m?.content ?? ""),
      })),
    ];

    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: chatMessages,
      temperature,
      max_tokens: maxTokens,
    });

    const content = completion?.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ content });
  } catch (error: any) {
    console.error("Groq route error", error);
    const status = error?.status || error?.response?.status;
    const detail = error?.message || error?.response?.data || "Unknown error";
    return NextResponse.json({ error: "Groq request failed", status, detail }, { status: 500 });
  }
}
