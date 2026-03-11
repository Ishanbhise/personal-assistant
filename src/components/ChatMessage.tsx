"use client";

import { Message } from "@/lib/types";
import { useMemo } from "react";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

function formatContent(content: string): string {
  let formatted = content;

  formatted = formatted.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    '<pre class="my-3 overflow-x-auto rounded-xl bg-[#1e1e2e] p-4 text-sm"><code class="text-[#cdd6f4] language-$1">$2</code></pre>'
  );

  formatted = formatted.replace(
    /`([^`]+)`/g,
    '<code class="rounded-md bg-[#2a2a3e] px-1.5 py-0.5 text-sm text-[#cba6f7]">$1</code>'
  );

  formatted = formatted.replace(
    /\*\*(.+?)\*\*/g,
    "<strong>$1</strong>"
  );

  formatted = formatted.replace(
    /\*(.+?)\*/g,
    "<em>$1</em>"
  );

  formatted = formatted.replace(
    /^### (.+)$/gm,
    '<h3 class="mt-4 mb-2 text-lg font-semibold">$1</h3>'
  );
  formatted = formatted.replace(
    /^## (.+)$/gm,
    '<h2 class="mt-4 mb-2 text-xl font-semibold">$1</h2>'
  );
  formatted = formatted.replace(
    /^# (.+)$/gm,
    '<h1 class="mt-4 mb-2 text-2xl font-bold">$1</h1>'
  );

  formatted = formatted.replace(
    /^[-*] (.+)$/gm,
    '<li class="ml-4 list-disc">$1</li>'
  );

  formatted = formatted.replace(
    /^\d+\. (.+)$/gm,
    '<li class="ml-4 list-decimal">$1</li>'
  );

  formatted = formatted.replace(/\n/g, "<br/>");

  return formatted;
}

export default function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user";
  const formattedContent = useMemo(
    () => formatContent(message.content),
    [message.content]
  );

  return (
    <div className={`animate-fade-in flex gap-4 px-4 py-6 md:px-8 ${isUser ? "" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${
          isUser ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-gradient-to-br from-emerald-500 to-teal-600"
        }`}
      >
        {isUser ? "Y" : "A"}
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider opacity-50">
          {isUser ? "You" : "Assistant"}
        </p>
        <div
          className="prose max-w-none leading-relaxed"
          style={{ color: "var(--foreground)" }}
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
        {isStreaming && (
          <span className="mt-2 inline-flex items-center gap-1">
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-current opacity-50" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-current opacity-50" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-current opacity-50" />
          </span>
        )}
      </div>
    </div>
  );
}
