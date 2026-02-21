import { ChatMessage } from "@/hooks/useSkinChat";
import { formatContent } from "@/shared/lib/formatText";
import Image from "next/image";
import Link from "next/link";
interface ChatBubbleProps {
    message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
    const isUser = message.role === "user";

    // Extract text only (image support removed)
    let textContent = "";

    if (typeof message.content === "string") {
        textContent = message.content;
    } else if (Array.isArray(message.content)) {
        message.content.forEach((part) => {
            if (part.type === "text" && part.text) {
                textContent += part.text;
            }
        });
    }

    return (
        <div className={`flex w-full gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
            {/* Bot Icon - Only for AI */}
            {!isUser && (
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-gray-100">
                    <Image
                        src="/logo.webp"
                        alt="Beaulytics AI"
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            <div
                className={`relative max-w-[85%] px-5 py-3.5 text-sm leading-relaxed shadow-sm md:max-w-[75%] ${isUser
                    ? "rounded-2xl rounded-tr-sm bg-black text-white"
                    : "rounded-2xl rounded-tl-sm border border-gray-200 bg-white text-gray-800"
                    }`}
            >
                {textContent && (
                    <div
                        className={`prose prose-sm max-w-none ${isUser ? "prose-invert" : ""
                            }`}
                        dangerouslySetInnerHTML={{ __html: formatContent(textContent) }}
                    />
                )}

                {/* UI PRODUK REKOMENDASI AI */}
                {message.products && message.products.length > 0 && (
                    <div className="w-full mt-2 bg-white border border-brand-primary/20 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary text-xs">✨</span>
                            <p className="text-xs font-bold text-brand-dark tracking-wide uppercase">Rekomendasi AI Untukmu</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            {message.products.map((p: any) => (
                                <Link href={`/products/${p.id}`} key={p.id} className="flex items-center gap-3 p-3 border border-neutral-100 rounded-xl hover:border-brand-primary hover:bg-brand-primary/5 transition-all group">
                                    <div className="relative w-14 h-14 rounded-lg bg-neutral-50 overflow-hidden shrink-0 border border-neutral-100 group-hover:border-brand-primary/30">
                                        {p.image ? (
                                            <Image src={p.image} alt={p.name} fill className="object-cover p-1 mix-blend-multiply" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-brand-dark line-clamp-1 group-hover:text-brand-primary transition-colors">{p.name}</p>
                                        <p className="text-xs text-brand-light line-clamp-1 mt-0.5">{p.category || 'Skincare'}</p>
                                        <p className="text-sm font-semibold text-emerald-600 mt-1">
                                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p.price || 0)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* ACTION BUTTONS (ex: Login Prompt) */}
                {message.action === "login" && (
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <a
                            href="/auth/login"
                            className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
                        >
                            Login Sekarang
                        </a>
                        <a
                            href="/auth/register"
                            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-black"
                        >
                            Daftar Akun
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
