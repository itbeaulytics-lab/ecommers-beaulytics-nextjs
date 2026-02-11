import { ChatMessage } from "@/hooks/useSkinChat";
import { formatContent } from "@/lib/formatText";
import Image from "next/image";

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
            </div>
        </div>
    );
}
