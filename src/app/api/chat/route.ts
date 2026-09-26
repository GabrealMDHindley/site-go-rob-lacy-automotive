import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { CHAT_LIMITS, CHAT_SYSTEM_PROMPT, chatConfigured } from "@/lib/chat";
import { site } from "@/data/site";

// The website chat assistant. Requires ANTHROPIC_API_KEY (Vercel env var);
// ANTHROPIC_MODEL optionally overrides the model. Streams the reply to the
// browser as newline-delimited JSON events:
//   {"t":"delta","text":"…"}   append text
//   {"t":"replace","text":"…"} replace the reply so far (declined request)
//   {"t":"error","message":"…"} show an error instead
//   {"t":"done"}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL?.trim() || "claude-opus-5";
// Server-side refusal fallback: if the model's safety classifiers decline a
// message, Anthropic retries it on its recommended fallback model inside the
// same request. Enabled for the default model.
const FALLBACK_MODELS = new Set(["claude-opus-5"]);
// Effort keeps chat replies quick; Haiku 4.5 doesn't take the effort setting.
const SUPPORTS_EFFORT = !MODEL.includes("haiku");

const DECLINED_REPLY = `Sorry — I can't help with that one here. For anything about ${site.name}'s services, ask me, call ${site.phone}, or book a call from the "Book Your Call" button.`;

let client: Anthropic | null = null;
function getClient(): Anthropic {
  client ??= new Anthropic(); // reads ANTHROPIC_API_KEY
  return client;
}

// Best-effort per-visitor limit (per server instance) to blunt abuse.
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < CHAT_LIMITS.rateWindowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > CHAT_LIMITS.rateLimit;
}

function friendlyError(err: unknown): string {
  const contact = `call ${site.phone} or email ${site.email}`;
  if (err instanceof Anthropic.RateLimitError) {
    return `The assistant is busy right now — please try again in a moment, or ${contact}.`;
  }
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
    return `The assistant isn't available right now — please ${contact}.`;
  }
  return `Sorry, something went wrong on my end. Please try again, or ${contact}.`;
}

export async function POST(req: Request) {
  if (!chatConfigured()) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, reason: "rate_limited" }, { status: 429 });
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid_body" }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages.slice(-CHAT_LIMITS.maxMessages) : [];
  const messages: Anthropic.Beta.BetaMessageParam[] = [];
  for (const m of incoming as { role?: unknown; content?: unknown }[]) {
    if ((m?.role === "user" || m?.role === "assistant") && typeof m.content === "string") {
      const content = m.content.trim().slice(0, CHAT_LIMITS.maxChars);
      if (content) messages.push({ role: m.role, content });
    }
  }
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ ok: false, reason: "invalid_messages" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: Record<string, string>) => {
        try {
          controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        } catch {
          // visitor closed the chat mid-reply
        }
      };
      try {
        const reply = getClient().beta.messages.stream(
          {
            model: MODEL,
            max_tokens: 4000,
            system: [{ type: "text", text: CHAT_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
            messages,
            ...(SUPPORTS_EFFORT ? { output_config: { effort: "low" as const } } : {}),
            ...(FALLBACK_MODELS.has(MODEL)
              ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }
              : {}),
          },
          { signal: req.signal },
        );
        reply.on("text", (delta) => send({ t: "delta", text: delta }));
        const final = await reply.finalMessage();
        if (final.stop_reason === "refusal") {
          // Declined even after any fallback — discard the partial reply.
          send({ t: "replace", text: DECLINED_REPLY });
        }
        send({ t: "done" });
      } catch (err) {
        if (!(err instanceof Anthropic.APIUserAbortError)) {
          console.error("POST /api/chat failed:", err);
          send({ t: "error", message: friendlyError(err) });
        }
      } finally {
        try {
          controller.close();
        } catch {
          // already closed by the visitor
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
