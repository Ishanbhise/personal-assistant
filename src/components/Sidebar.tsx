"use client";

import { Conversation } from "@/lib/types";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "var(--sidebar-bg)" }}
      >
        <div className="flex items-center justify-between p-4">
          <h1
            className="text-lg font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            AI Assistant
          </h1>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-white/10 md:hidden"
            style={{ color: "var(--sidebar-text)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <button
          onClick={onNew}
          className="mx-3 mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:scale-[1.02]"
          style={{
            backgroundColor: "var(--accent)",
            color: "#ffffff",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Chat
        </button>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {conversations.length === 0 ? (
            <p
              className="px-3 py-8 text-center text-sm"
              style={{ color: "var(--sidebar-text)" }}
            >
              No conversations yet. Start a new chat!
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`animate-slide-in group flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-all ${
                    activeId === conv.id
                      ? "bg-white/15 font-medium"
                      : "hover:bg-white/8"
                  }`}
                  style={{
                    color:
                      activeId === conv.id
                        ? "var(--foreground)"
                        : "var(--sidebar-text)",
                  }}
                  onClick={() => onSelect(conv.id)}
                >
                  <svg
                    className="shrink-0"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  <span className="flex-1 truncate">{conv.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="shrink-0 rounded-md p-1 opacity-0 transition-opacity hover:bg-white/10 group-hover:opacity-100"
                    style={{ color: "var(--sidebar-text)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="border-t p-4 text-xs"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            color: "var(--sidebar-text)",
          }}
        >
          Powered by Groq &middot; Llama 3.3 70B
        </div>
      </aside>
    </>
  );
}
