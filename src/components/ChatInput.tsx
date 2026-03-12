"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import VoiceButton from "./VoiceButton";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceTranscript = useCallback((text: string) => {
    setInput(text);
  }, []);

  return (
    <div className="border-t px-4 pb-4 pt-3 md:px-8" style={{ borderColor: "var(--input-border)" }}>
      <div
        className="flex items-end gap-3 rounded-2xl border px-4 py-3 shadow-sm transition-all focus-within:border-[var(--accent)] focus-within:shadow-md"
        style={{
          backgroundColor: "var(--input-bg)",
          borderColor: "var(--input-border)",
        }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          rows={1}
          className="max-h-[200px] flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:opacity-50 disabled:opacity-40"
          style={{ color: "var(--foreground)" }}
        />
        <VoiceButton onTranscript={handleVoiceTranscript} disabled={disabled} />
        <button
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all disabled:opacity-30"
          style={{
            backgroundColor: input.trim() ? "var(--accent)" : "transparent",
            color: input.trim() ? "#ffffff" : "var(--foreground)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
      <p className="mt-2 text-center text-xs opacity-40">
        Press Enter to send, Shift+Enter for new line, or click the mic to speak
      </p>
    </div>
  );
}
