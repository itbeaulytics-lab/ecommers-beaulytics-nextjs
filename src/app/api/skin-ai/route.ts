import { NextResponse } from "next/server";
import Groq from "groq-sdk";

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
