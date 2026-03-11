"use client";

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void;
}

const suggestions = [
  {
    icon: "💡",
    title: "Explain a concept",
    text: "Explain quantum computing in simple terms",
  },
  {
    icon: "💻",
    title: "Write some code",
    text: "Write a Python function to find the fibonacci sequence",
  },
  {
    icon: "✍️",
    title: "Help me write",
    text: "Help me write a professional email to my manager about a project update",
  },
  {
    icon: "🧠",
    title: "Brainstorm ideas",
    text: "Give me 5 creative side project ideas for a web developer",
  },
];

export default function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent)] to-purple-500 text-2xl font-bold text-white shadow-lg">
        AI
      </div>
      <h2 className="mb-2 text-2xl font-bold" style={{ color: "var(--foreground)" }}>
        How can I help you today?
      </h2>
      <p className="mb-8 text-sm opacity-50">
        I&apos;m your personal AI assistant. Ask me anything!
      </p>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(s.text)}
            className="group flex flex-col gap-1 rounded-2xl border p-4 text-left transition-all hover:scale-[1.02] hover:shadow-md"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--input-border)",
            }}
          >
            <span className="text-xl">{s.icon}</span>
            <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              {s.title}
            </span>
            <span className="text-xs opacity-50 line-clamp-2">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
