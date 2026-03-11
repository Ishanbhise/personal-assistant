"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Conversation, Message } from "@/lib/types";
import {
  loadConversations,
  saveConversations,
  generateId,
  generateTitle,
} from "@/lib/storage";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const loaded = loadConversations();
    setConversations(loaded);
    if (loaded.length > 0) {
      setActiveConversationId(loaded[0].id);
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      saveConversations(conversations);
    }
  }, [conversations]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversations, scrollToBottom]);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const createNewConversation = useCallback((): string => {
    const newConv: Conversation = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setSidebarOpen(false);
    return newConv.id;
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    },
    [activeConversationId]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (isStreaming) return;

      let convId = activeConversationId;

      if (!convId) {
        convId = createNewConversation();
      }

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          const isFirstMessage = c.messages.length === 0;
          return {
            ...c,
            title: isFirstMessage ? generateTitle(content) : c.title,
            messages: [...c.messages, userMessage, assistantMessage],
            updatedAt: new Date(),
          };
        })
      );

      setIsStreaming(true);

      try {
        abortControllerRef.current = new AbortController();

        const currentConv = conversations.find((c) => c.id === convId);
        const history = currentConv
          ? currentConv.messages.map((m) => ({
              role: m.role,
              content: m.content,
            }))
          : [];

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...history, { role: "user", content }],
          }),
          signal: abortControllerRef.current.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to get response");
        }

        if (data.content) {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id !== convId) return c;
              const msgs = [...c.messages];
              const lastMsg = msgs[msgs.length - 1];
              if (lastMsg.role === "assistant") {
                msgs[msgs.length - 1] = {
                  ...lastMsg,
                  content: data.content,
                };
              }
              return { ...c, messages: msgs };
            })
          );
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") return;

        const errorMessage =
          error instanceof Error ? error.message : "Something went wrong";

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== convId) return c;
            const msgs = [...c.messages];
            const lastMsg = msgs[msgs.length - 1];
            if (lastMsg.role === "assistant") {
              msgs[msgs.length - 1] = {
                ...lastMsg,
                content: `Sorry, I encountered an error: ${errorMessage}`,
              };
            }
            return { ...c, messages: msgs };
          })
        );
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [activeConversationId, conversations, createNewConversation, isStreaming]
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={(id) => {
          setActiveConversationId(id);
          setSidebarOpen(false);
        }}
        onNew={createNewConversation}
        onDelete={deleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header
          className="flex items-center gap-3 border-b px-4 py-3 md:px-8"
          style={{
            borderColor: "var(--input-border)",
            backgroundColor: "var(--chat-bg)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10 md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <h2
            className="truncate text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {activeConversation?.title || "Personal AI Assistant"}
          </h2>
        </header>

        <div
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: "var(--chat-bg)" }}
        >
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <WelcomeScreen onSuggestionClick={sendMessage} />
          ) : (
            <div className="mx-auto max-w-3xl">
              {activeConversation.messages.map((msg, i) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isStreaming={
                    isStreaming &&
                    i === activeConversation.messages.length - 1 &&
                    msg.role === "assistant"
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div style={{ backgroundColor: "var(--chat-bg)" }}>
          <div className="mx-auto max-w-3xl">
            <ChatInput onSend={sendMessage} disabled={isStreaming} />
          </div>
        </div>
      </div>
    </div>
  );
}
