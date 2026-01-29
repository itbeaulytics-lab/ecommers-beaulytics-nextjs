"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const starterPrompts = [
  "Kulitku sering jerawatan dan berminyak, skincare apa yang cocok?",
  "Ada ruam merah di pipi setelah pakai produk baru, harus gimana?",
  "Tolong buatin rutinitas pagi/malam untuk kulit kering dan sensitif.",
];

function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatInline(text: string) {
  let html = escapeHtml(text);
  // decode common escaped tags from model output
  html = html.replace(/&lt;br\s*\/?&gt;/gi, "<br />").replace(/&amp;nbsp;/gi, " ");
  // bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");
  // italic *text*
  html = html.replace(/(^|[\s>])\*(?!\*)([^*]+?)\*(?!\*)/g, "$1<em>$2</em>");
  html = html.replace(/(^|[\s>])_(?!_)([^_]+?)_(?!_)/g, "$1<em>$2</em>");
  return html;
}

function isTableLine(line: string) {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.split("|").length > 3;
}

function isSeparatorLine(line: string) {
  return /^\s*\|?(?:\s*:?-+:?\s*\|)+\s*$/.test(line);
}

function parseRow(line: string) {
  const inner = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return inner.split("|").map((c) => c.trim());
}

function tableBlockToHtml(block: string[]) {
  if (block.length < 2 || !isSeparatorLine(block[1])) return block.join("\n");
  const header = parseRow(block[0]);
  const rows = block.slice(2).map(parseRow);
  const th = header
    .map(
      (h) =>
        `<th class="border border-brand-primary/20 bg-brand-secondary/60 px-3 py-2 text-left text-[11px] sm:text-xs font-semibold text-brand-dark">${formatInline(
          h
        )}</th>`
    )
    .join("");
  const trs = rows
    .map((r) => {
      const tds = r
        .map(
          (c) =>
            `<td class="border border-brand-primary/15 px-3 py-2 align-top text-[11px] sm:text-xs text-brand-dark">${formatInline(
              c
            )}</td>`
        )
        .join("");
      return `<tr>${tds}</tr>`;
    })
    .join("");
  return `<div class="overflow-x-auto -mx-1 sm:mx-0"><table class="min-w-full border-collapse rounded-2xl overflow-hidden text-xs sm:text-sm shadow-sm"><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table></div>`;
}

function inlinePipeRow(line: string) {
  const cells = line
    .split("|")
    .map((c) => c.trim())
    .filter((c) => c.length);
  if (cells.length < 2) return null;
  const tds = cells
    .map(
      (c) =>
        `<td class="border border-brand-primary/15 px-3 py-2 align-top text-[11px] sm:text-xs text-brand-dark">${formatInline(
          c
        )}</td>`
    )
    .join("");
  return `<div class="overflow-x-auto -mx-1 sm:mx-0 mb-2"><table class="min-w-full border-collapse rounded-2xl overflow-hidden text-xs sm:text-sm shadow-sm"><tbody><tr>${tds}</tr></tbody></table></div>`;
}

function splitIntoSegments(text: string) {
  const lines = text.split("\n");
  const segments: { type: "table" | "text"; content: string }[] = [];
  let i = 0;
  let buffer: string[] = [];
  const flushBuffer = () => {
    if (buffer.length) {
      segments.push({ type: "text", content: buffer.join("\n") });
      buffer = [];
    }
  };
  while (i < lines.length) {
    if (isTableLine(lines[i])) {
      const start = i;
      while (i < lines.length && isTableLine(lines[i])) i++;
      const block = lines.slice(start, i);
      flushBuffer();
      segments.push({ type: "table", content: tableBlockToHtml(block) });
      continue;
    }
    buffer.push(lines[i]);
    i++;
  }
  flushBuffer();
  return segments;
}

function formatContent(text: string) {
  const segments = splitIntoSegments(text.trim());
  const formatted = segments
    .map((seg) => {
      if (seg.type === "table") return seg.content;

      const lines = seg.content.split("\n");
      const renderedLines = lines.map((line) => {
        if (/^\s*-{3,}\s*$/.test(line)) return ""; // remove horizontal rules
        const inlineTable = line.includes("|") && !isTableLine(line);
        if (inlineTable) {
          const row = inlinePipeRow(line);
          if (row) return row;
        }
        const headingMatch = line.match(/^\s*#{1,6}\s*(.*)$/);
        const base = headingMatch ? headingMatch[1] : line;
        let html = formatInline(base);
        // bullets and numbering
        html = html.replace(/^\s*-+\s+/g, "• ").replace(/^\s*(\d+)\.\s+/g, "$1. ");
        // strip stray heading markers if any slipped
        html = html.replace(/^#+\s*/g, "");

        if (headingMatch) {
          return `<div class="font-semibold text-brand-dark text-sm sm:text-base">${html}</div>`;
        }
        return html;
      });

      return renderedLines.join("<br />");
    })
    .join("<br />");
  return formatted;
}

function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-brand-primary text-brand-dark rounded-br-sm"
            : "bg-white/90 text-brand-dark border border-brand-primary/10 rounded-bl-sm"
        }`}
        dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
      />
    </div>
  );
}

export default function AiPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Halo! Aku asisten dermatologi virtual. Ceritakan kondisi kulitmu atau produk yang dipakai, biar aku bantu kasih saran skincare. Ini bukan pengganti dokter—untuk kasus gawat, segera konsultasi langsung ke profesional, ya!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function sendMessage(content?: string) {
    const text = (content ?? input).trim();
    if (!text || loading) return;
    const userMessage: ChatMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/skin-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "chat", messages: nextMessages }),
      });
      if (!res.ok) {
        let reason = "Gagal menghubungi AI";
        try {
          const err = await res.json();
          if (err?.error) reason = `${err.error}${err?.status ? ` (${err.status})` : ""}`;
          if (err?.detail) reason += ` — ${String(err.detail).slice(0, 200)}`;
        } catch {}
        throw new Error(reason);
      }
      const data = await res.json();
      const reply = data?.content?.trim();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            reply ||
            "Maaf, terjadi kendala memproses permintaanmu. Coba ulangi atau cek koneksi ya.",
        },
      ]);
    } catch (error: any) {
      console.error(error);
      const detail = error?.message ? ` (${error.message})` : "";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Aku mengalami gangguan saat terhubung. Pastikan koneksi stabil dan coba lagi sebentar ya.${detail}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage();
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-brand-secondary/70 via-white to-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,201,72,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(247,201,72,0.12),transparent_40%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-120px)] max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-3">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark ring-1 ring-brand-primary/30">
            AI Skin Consultant
          </p>
          <h1 className="text-3xl font-semibold text-brand-dark sm:text-4xl">
            Konsultasi kulit, skincare, dan gejala ringan dengan{" "}
            <span className="text-brand-primary">AI</span>
          </h1>
          <div className="flex flex-wrap gap-2 text-xs text-brand-light">
            <span className="rounded-full bg-white/80 px-3 py-1 ring-1 ring-brand-primary/30">
              Fokus: jerawat, kulit sensitif, kering/berminyak
            </span>
            <span className="rounded-full bg-white/80 px-3 py-1 ring-1 ring-brand-primary/30">
              Tips produk & patch test
            </span>
            <span className="rounded-full bg-white/80 px-3 py-1 ring-1 ring-brand-primary/30">
              Rekomendasi rutinitas personal
            </span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="flex h-[520px] flex-col rounded-3xl border border-brand-primary/20 bg-white/90 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3 border-b border-brand-primary/10 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-brand-dark font-semibold">
                AI
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-dark">Beaulytics AI</p>
                <p className="text-xs text-brand-light">
                  Respon cepat untuk saran kulit & skincare
                </p>
              </div>
              <div className="ml-auto text-xs text-brand-light">
                {loading ? "Mengetik..." : "Siap membantu"}
              </div>
            </div>
            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-5 py-4 [scrollbar-width:thin]"
            >
              {messages.map((msg, idx) => (
                <Bubble key={idx} message={msg} />
              ))}
            </div>
            <form
              onSubmit={handleSubmit}
              className="border-t border-brand-primary/10 bg-brand-secondary/60 px-5 py-4"
            >
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ceritakan kondisi kulit atau pertanyaanmu..."
                    rows={2}
                    className="w-full resize-none rounded-2xl border border-brand-primary/30 bg-white px-4 py-3 text-sm text-brand-dark shadow-sm focus:border-brand-primary focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-brand-light">
                    Jangan bagikan data pribadi. Untuk gejala berat (nyeri hebat, demam, luka
                    bernanah) segera periksa ke dokter.
                  </p>
                  <p className="mt-1 text-[11px] text-brand-light text-bold">
                    *Ai ini mungkin bisa membuat kesalahan, jadi selalu konsultasi dengan dokter
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-11 w-12 items-center justify-center rounded-2xl bg-brand-primary text-brand-dark font-semibold shadow-sm transition hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Kirim pesan"
                >
                  {loading ? (
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-brand-primary/15 bg-white/90 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-brand-dark">Contoh cepat</h3>
              <p className="text-sm text-brand-light">
                Ketuk salah satu untuk langsung bertanya ke AI.
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="w-full rounded-2xl border border-brand-primary/20 bg-brand-secondary px-4 py-3 text-left text-sm text-brand-dark transition hover:-translate-y-0.5 hover:border-brand-primary/50 hover:shadow-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-brand-primary/15 bg-white/90 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-brand-dark">Tips aman</h3>
              <ul className="list-disc space-y-2 pl-5 text-sm text-brand-light">
                <li>Lakukan patch test 24-48 jam saat mencoba produk baru.</li>
                <li>Hindari mencampur bahan aktif kuat (retinol, AHA/BHA, benzoyl peroxide) tanpa panduan.</li>
                <li>Jika muncul nyeri, bengkak parah, demam, atau keluar nanah, segera ke dokter.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
