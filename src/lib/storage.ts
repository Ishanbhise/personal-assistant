import { Conversation, Message } from "./types";

const STORAGE_KEY = "pa-conversations";

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function loadConversations(): Conversation[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((c: Conversation) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
      messages: c.messages.map((m: Message) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
    }));
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function generateTitle(firstMessage: string): string {
  const trimmed = firstMessage.trim();
  if (trimmed.length <= 40) return trimmed;
  return trimmed.substring(0, 40) + "...";
}
