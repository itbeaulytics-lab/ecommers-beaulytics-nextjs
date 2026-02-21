import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const VISION_MODEL = "meta-llama/llama-4-maverick-17b-128e-instruct";
const BRAIN_MODEL = "openai/gpt-oss-120b";

const CHAT_MAX_TOKENS = Number(process.env.NEXT_GROQ_MAX_TOKENS || 2048);
const ANALYSIS_MAX_TOKENS = Number(process.env.NEXT_GROQ_ANALYSIS_MAX_TOKENS || 2048);

const VISION_SYSTEM_PROMPT =
    "Anda adalah analis dermatologi teknis. Deskripsikan kondisi kulit di foto ini secara SANGAT MENDETAIL (tekstur, warna, tipe jerawat, lokasi masalah). Jangan beri saran, HANYA fakta visual.";

const ANALYSIS_PROMPT =
    `You are a professional Dermatologist AI and Skin Analyzer. 
    You will receive a list of 11 questions and the user's selected answers. 
    Your task is to analyze their skin profile using the following strict scoring system.

    Note that the user's answers are provided as full text, which correspond sequentially to Option 1 (A), Option 2 (B), Option 3 (C), and Option 4 (D) for each question.

    SCORING RULES:
    1. SEBUM INDEX (Q1, Q2, Q3):
    Scores: Opt 1 (-2), Opt 2 (-1), Opt 3 (+1), Opt 4 (+2).
    Sum the scores. 
    Result: -6 to -3 (Dry Skin), -2 to +1 (Normal Skin), +2 to +4 (Combination Skin), +5 to +6 (Oily Skin).

    2. HYDRATION & BARRIER (Q4, Q5):
    Scores: Opt 1 (-2), Opt 2 (-1), Opt 3 (+1), Opt 4 (0).
    Sum the scores.
    Result: -4 to -2 (Severely Dehydrated & Barrier Damage), -1 (Mild Dehydration), 0 (Oily but Dehydrated), +1 to +2 (Healthy Hydration).

    3. SENSITIVITY (Q6, Q7):
    Scores: Opt 1 (+2), Opt 2 (+1), Opt 3 (-1), Opt 4 (-2).
    Sum the scores.
    Result: +3 to +4 (Highly Sensitive Skin), +1 to +2 (Mild Sensitive), -1 to -2 (Resistant Skin), -3 to -4 (Highly Resistant).

    4. ACNE INDEX (Q8, Q9):
    Scores: Opt 1 (-2), Opt 2 (-1), Opt 3 (+1), Opt 4 (+2).
    Sum the scores.
    Result: +3 to +4 (Highly Acne Prone), +1 to +2 (Acne Prone), -1 to -2 (Low Risk), -3 to -4 (Very Low Risk).

    5. PIGMENTATION (Q10):
    Scores: Opt 1 (-2), Opt 2 (-1), Opt 3 (+1), Opt 4 (+2).
    Result: +2 (High Hyperpigmentation Risk), +1 (Moderate Risk), -1 (Low Risk), -2 (Even Tone).

    6. AGING (Q11):
    Scores: Opt 1 (-2), Opt 2 (-1), Opt 3 (+1), Opt 4 (+2).
    Result: +2 (Advanced Aging), +1 (Early Aging), -1 (Preventive Stage), -2 (Youthful Skin).

    OUTPUT FORMAT:
    Return ONLY a single line containing a comma-separated list of the resulting conditions (max 6 items).
    Example: Combination Skin, Mild Dehydration, Mild Sensitive, Acne Prone, Moderate Risk, Preventive Stage
    
    IMPORTANT RULES:
    1. Output MUST be a SINGLE LINE.
    2. DO NOT include any introductions, explanations, or labels like "Result:".
    3. JUST the keywords separated by commas.
    4. If uncertain, default to "Normal Skin".`;

const CHAT_PROMPT =
    "You are a friendly and personal skincare and body care bestie. You speak in a warm, engaging, and casual Indonesian tone (using terms like 'Kak', 'Bestie'). " +
    "Your Goal: Provide a consultative dermatology experience.\n\n" +
    "STRICT RESPONSE FLOW:\n" +
    "1. ANALYSIS: Analyze the user's skin condition based on their description or image.\n" +
    "2. TIPS: Give immediate behavioral/lifestyle advice.\n" +
    "3. PERMISSION: Ask the user if they want product recommendations.\n\n" +
    "MAGIC SEARCH RULE:\n" +
    "- If the user EXPLICITLY asks for product recommendations, provide your advice, and AT THE VERY END of your message, you MUST output a search trigger like this: `[SEARCH: keyword]`.\n" +
    "- Example 1: `[SEARCH: salicylic acid]`\n" +
    "- Example 2: `[SEARCH: sunscreen]`\n" +
    "- Example 3: `[SEARCH: acne]`\n" +
    "- ONLY use ONE main keyword. Do NOT use the [SEARCH] tag if they haven't asked for products yet.";

const DIAGNOSIS_PROMPT =
    "You are a professional Dermatologist AI. Your task is to generate a structured Medical Report based on the patient's skin analysis.\n" +
    "Format your response EXACTLY as a JSON-like structure (but plain text is fine, just structured) with these sections:\n\n" +
    "**MEDICAL REPORT**\n" +
    "TARGET: [Patient Name/User]\n" +
    "DATE: [Current Date]\n\n" +
    "--- \n" +
    "**1. DETECTED CONDITIONS**\n" +
    "- [Condition 1] (e.g., Acne Vulgaris)\n" +
    "- [Condition 2] (e.g., Post-Inflammatory Hyperpigmentation)\n" +
    "- [Condition 3] (e.g., Oversized Pores)\n\n" +
    "**2. ANALYSIS**\n" +
    "[Detailed technical analysis of the visual evidence. Explain severity, distribution, and probable causes.]\n\n" +
    "**3. CLINICAL RECOMMENDATIONS**\n" +
    "- [Treatment 1]\n" +
    "- [Treatment 2]\n\n" +
    "**4. NEXT STEPS**\n" +
    "Please consult with our AI Assistant for a personalized product routine.\n" +
    "---";

interface MessageContent {
    type: "text" | "image_url";
    text?: string;
    image_url?: { url: string };
}

interface Message {
    role: "user" | "assistant" | "system";
    content: string | MessageContent[];
}

interface ProcessSkinAnalysisParams {
    messages: Message[];
    mode?: "chat" | "analysis" | "diagnosis";
    apiKey: string;
}

export async function processSkinAnalysis({ messages, mode, apiKey }: ProcessSkinAnalysisParams) {
    const groq = new Groq({ apiKey });

    const lastMessage = messages[messages.length - 1];

    // Select Prompt based on Mode
    let finalSystemPrompt = CHAT_PROMPT;
    if (mode === "analysis") finalSystemPrompt = ANALYSIS_PROMPT;
    if (mode === "diagnosis") finalSystemPrompt = DIAGNOSIS_PROMPT;

    let finalUserContent = "";

    // Check if the last message contains an image
    const hasImage = Array.isArray(lastMessage.content) && lastMessage.content.some((c: any) => c.type === "image_url");

    if (hasImage && Array.isArray(lastMessage.content)) {
        // === STAGE 1: VISION ANALYSIS ===
        const imagePart = lastMessage.content.find((c: any) => c.type === "image_url");
        const textPart = lastMessage.content.find((c: any) => c.type === "text");
        const userText = textPart && textPart.type === "text" ? textPart.text : "";

        if (imagePart && imagePart.type === "image_url") {
            try {
                const visionCompletion = await groq.chat.completions.create({
                    model: VISION_MODEL,
                    messages: [
                        { role: "system", content: VISION_SYSTEM_PROMPT },
                        {
                            role: "user",
                            content: [
                                { type: "image_url", image_url: { url: imagePart.image_url!.url } },
                                { type: "text", text: "Deskripsikan kondisi kulit di gambar ini." },
                            ],
                        },
                    ],
                    temperature: 0.1,
                    max_tokens: 512,
                });

                const imageAnalysisResult = visionCompletion.choices[0]?.message?.content || "Gagal menganalisis gambar.";

                // Inject analysis into the final prompt
                finalUserContent = `Ini adalah hasil analisis visual wajah saya dari alat scanner: [${imageAnalysisResult}].\n\nPertanyaan saya: "${userText}"`;

            } catch (visionError) {
                console.error("Vision Step Error:", visionError);
                // Fallback if vision fails: tell brain model we couldn't analyze
                finalUserContent = `User mencoba mengirim gambar tetapi analisis visual gagal. Pertanyaan user: "${userText}"`;
            }
        }
    } else {
        // Text Only - Just use the content as is
        if (typeof lastMessage.content === "string") {
            finalUserContent = lastMessage.content;
        } else if (Array.isArray(lastMessage.content)) {
            finalUserContent = lastMessage.content
                .filter((c: any) => c.type === 'text')
                .map((c: any) => (c.type === 'text' ? c.text : ''))
                .join('\n');
        }
    }

    // === STAGE 2: BRAIN / REASONING ===

    // Prepare history for context
    const previousMessages = messages.slice(0, -1).map((m) => {
        let content = "";
        if (typeof m.content === "string") {
            content = m.content;
        } else {
            content = (m.content as MessageContent[])
                .filter(c => c.type === 'text')
                .map(c => (c.type === 'text' ? c.text : ''))
                .join(' ');
        }
        return { role: m.role, content };
    });

    const brainMessages = [
        { role: "system", content: finalSystemPrompt },
        ...previousMessages,
        { role: "user", content: finalUserContent },
    ];

    const isAnalysis = mode === "analysis";
    const temperature = isAnalysis ? 0.3 : 0.6;
    const maxTokens = isAnalysis ? ANALYSIS_MAX_TOKENS : CHAT_MAX_TOKENS;

    const completion = await groq.chat.completions.create({
        model: BRAIN_MODEL,
        messages: brainMessages as any,
        temperature,
        max_tokens: maxTokens,
    });

    const message = completion?.choices?.[0]?.message;
    let replyText = message?.content || (message as any)?.reasoning || "";
    let recommendedProducts: any[] = [];

    // TANGKAP MAGIC KEYWORD DARI AI DAN CARI KE DATABASE
    const searchMatch = replyText.match(/\[SEARCH:\s*([^\]]+)\]/i);
    if (searchMatch && mode === "chat") {
        const queryTerm = searchMatch[1].trim().toLowerCase();
        replyText = replyText.replace(searchMatch[0], "").trim();

        try {
            const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
            const { data } = await supabase.from("products").select("id, name, price, image, category, ingredients, concerns").limit(50);

            if (data) {
                recommendedProducts = data.filter((p: any) =>
                    p.name.toLowerCase().includes(queryTerm) ||
                    (p.category && p.category.toLowerCase().includes(queryTerm)) ||
                    (Array.isArray(p.ingredients) && p.ingredients.some((i: string) => i.toLowerCase().includes(queryTerm))) ||
                    (Array.isArray(p.concerns) && p.concerns.some((b: string) => b.toLowerCase().includes(queryTerm)))
                ).slice(0, 3); // Ambil maksimal 3 produk terbaik
            }
        } catch (e) {
            console.error("Gagal menarik produk:", e);
        }
    }

    return { text: replyText, products: recommendedProducts };
}
