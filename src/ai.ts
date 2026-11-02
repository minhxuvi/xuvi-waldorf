// Provider abstraction over every AI capability (T12). Meta models are
// primary; non-Meta fallbacks are configuration, never code changes.
// In local/stub mode (no keys) drafting returns a labelled template so the
// generate→edit→lock loop stays testable without spend.
import type { Pool } from "pg";
import { logAudit } from "./auth.js";
import type { AppEnv } from "./env.js";

export type AiProvider = "meta" | "fallback" | "stub";

export function pickLlmProvider(env: AppEnv): AiProvider {
  if (env.META_API_KEY) return "meta";
  if (env.LLM_FALLBACK_API_KEY) return "fallback";
  return "stub";
}

export type DraftRequest = {
  kind: "program_philosophy" | "grade_narrative" | "year_plan" | "feedback";
  language?: string;
  context: string;
};

const STUB_PREFIX = "[Bản nháp mẫu — chưa qua AI. Gia đình cần xem lại toàn bộ trước khi dùng.]";

async function callOpenAiCompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  system: string,
  user: string,
): Promise<string> {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
    }),
  });
  if (!res.ok) throw new Error(`ai provider http ${res.status}`);
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = body.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("ai provider empty response");
  return text;
}

export async function draftProse(
  pool: Pool,
  env: AppEnv,
  familyId: string,
  req: DraftRequest,
): Promise<{ text: string; provider: AiProvider }> {
  const provider = pickLlmProvider(env);
  const language = req.language ?? "vi";
  const system =
    language === "vi"
      ? "Bạn hỗ trợ giáo viên homeschool Waldorf soạn tài liệu. Tiếng Việt, không chấm điểm, không tuyên bố pháp lý."
      : "You assist a Waldorf homeschool teacher drafting planning documents. No scores, no legal claims.";
  let text: string;
  if (provider === "meta") {
    text = await callOpenAiCompatible("https://api.meta.ai/v1", env.META_API_KEY as string, "muse-spark-1.3", system, req.context);
  } else if (provider === "fallback") {
    const base = env.LLM_FALLBACK_PROVIDER && env.LLM_FALLBACK_PROVIDER.startsWith("http")
      ? env.LLM_FALLBACK_PROVIDER
      : "https://api.openai.com/v1";
    text = await callOpenAiCompatible(base, env.LLM_FALLBACK_API_KEY as string, "gpt-4o-mini", system, req.context);
  } else {
    text = `${STUB_PREFIX}\n\n(${req.kind})\n${req.context.slice(0, 500)}`;
  }
  await logAudit(pool, familyId, `ai.draft.${req.kind}`, provider, "text");
  return { text, provider };
}

export function isStubDraft(text: string): boolean {
  return text.startsWith(STUB_PREFIX);
}
