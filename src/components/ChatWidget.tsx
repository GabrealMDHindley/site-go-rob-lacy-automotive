"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { site } from "@/data/site";

// Floating website chat assistant (Anthropic Claude via /api/chat). Only
// rendered when ANTHROPIC_API_KEY is set on the deployment (see layout.tsx).

type ChatMessage = { role: "user" | "assistant"; content: string; kind?: "greeting" | "error" };

const GREETING: ChatMessage = {
  role: "assistant",
  kind: "greeting",
  content: `Hi! I'm the ${site.name} assistant. Ask me about websites & CRM, vehicle video walkthroughs, commercials & lead generation, AI chat and voice agents, or content — or how to book a call.`,
};

const SUGGESTIONS = [
  "What do you do for car dealerships?",
  "How does your lead generation work?",
  "How fast do new leads get a call?",
  "How do I get started?",
];

const MAX_INPUT = 1000;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    // Focus the input on desktop only — on phones it would pop the keyboard
    // over the answer. preventScroll keeps the page where the visitor left it.
    if (open && window.matchMedia("(pointer: fine)").matches) {
      inputRef.current?.focus({ preventScroll: true });
    }
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const updateReply = useCallback((fn: (current: ChatMessage) => ChatMessage) => {
    setMessages((prev) => {
      const next = prev.slice();
      next[next.length - 1] = fn(next[next.length - 1]);
      return next;
    });
  }, []);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim().slice(0, MAX_INPUT);
      if (!question || busy) return;

      const history = [...messages, { role: "user" as const, content: question }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setInput("");
      setBusy(true);

      const payload = history
        .filter((m) => !m.kind)
        .map(({ role, content }) => ({ role, content }));

      const controller = new AbortController();
      abortRef.current = controller;
      const fail = (message: string) =>
        updateReply(() => ({ role: "assistant", content: message, kind: "error" }));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: payload }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          fail(
            res.status === 429
              ? `You've sent a lot of messages — please wait a few minutes, or call ${site.phone}.`
              : `The assistant isn't available right now — please call ${site.phone} or email ${site.email}.`
          );
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            let event: { t?: string; text?: string; message?: string };
            try {
              event = JSON.parse(line);
            } catch {
              continue;
            }
            if (event.t === "delta" && event.text) {
              const delta = event.text;
              updateReply((m) => ({ ...m, content: m.content + delta }));
            } else if (event.t === "replace" && event.text) {
              const text = event.text;
              updateReply(() => ({ role: "assistant", content: text }));
            } else if (event.t === "error" && event.message) {
              fail(event.message);
            }
          }
        }
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          fail(`Sorry, I lost the connection. Please try again, or call ${site.phone}.`);
        }
      } finally {
        setBusy(false);
        abortRef.current = null;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return last?.role === "assistant" && !last.content.trim()
            ? [...prev.slice(0, -1), { role: "assistant", content: `Sorry, I didn't catch that — please try again, or call ${site.phone}.`, kind: "error" }]
            : prev;
        });
      }
    },
    [busy, messages, updateReply]
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const showSuggestions = messages.length === 1 && !busy;
  const waiting = busy && messages[messages.length - 1]?.content === "";

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label={`Chat with the ${site.name} assistant`}
          className="fixed left-3 right-3 bottom-24 z-[70] flex h-[min(560px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface/95 backdrop-blur-xl shadow-[0_24px_70px_-20px_rgba(0,0,0,0.8)] sm:left-auto sm:right-6 sm:w-[380px]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
            <div>
              <p className="font-display text-sm font-semibold text-ink">Ask {site.name}</p>
              <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
                AI assistant
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/15 p-2 text-ink-dim transition hover:text-ink"
              aria-label="Close chat"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div
            ref={listRef}
            data-lenis-prevent
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
            aria-live="polite"
          >
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-sm text-ground">
                    {m.content}
                  </p>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <p
                    className={`max-w-[88%] whitespace-pre-wrap rounded-2xl rounded-bl-md border px-4 py-2.5 text-sm leading-relaxed ${
                      m.kind === "error"
                        ? "border-accent-deep/40 bg-accent-deep/10 text-ink-dim"
                        : "border-white/10 bg-white/[0.04] text-ink"
                    }`}
                  >
                    {m.content ||
                      (waiting && i === messages.length - 1 ? (
                        <span className="inline-flex gap-1 py-1" aria-label="Assistant is typing">
                          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ink-dim" />
                          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ink-dim [animation-delay:200ms]" />
                          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ink-dim [animation-delay:400ms]" />
                        </span>
                      ) : null)}
                  </p>
                </div>
              )
            )}

            {showSuggestions && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-left text-xs text-ink-dim transition hover:border-accent/60 hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t border-white/10 p-3">
            <div className="flex items-end gap-2">
              <label htmlFor="chat-input" className="sr-only">
                Your message
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT))}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Ask a question…"
                className="max-h-28 min-h-[44px] flex-1 resize-none rounded-xl border border-white/10 bg-ground/60 px-3.5 py-2.5 text-base text-ink outline-none sm:text-sm transition placeholder:text-ink-dim/60 focus:border-accent-deep"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-ground transition hover:bg-white disabled:opacity-50"
                aria-label="Send message"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3 10h13M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 px-1">
              <p className="text-[10px] leading-snug text-ink-dim/70">
                AI assistant — answers can be imperfect.
              </p>
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="shrink-0 text-xs font-semibold text-accent transition hover:text-white"
              >
                Book Your Call &rarr;
              </Link>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-ground shadow-[0_12px_36px_-8px_rgba(243,198,90,0.55)] transition hover:scale-105 hover:bg-white sm:bottom-6 sm:right-6"
        aria-label={open ? "Close chat" : `Chat with the ${site.name} assistant`}
        aria-expanded={open}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5v-8Z"
              fill="currentColor"
            />
            <circle cx="9" cy="9.5" r="1.2" fill="#f3c65a" />
            <circle cx="12" cy="9.5" r="1.2" fill="#f3c65a" />
            <circle cx="15" cy="9.5" r="1.2" fill="#f3c65a" />
          </svg>
        )}
      </button>
    </>
  );
}
