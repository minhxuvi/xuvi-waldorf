import { config } from "dotenv";

config();

// Required in every environment (dev, test, prod). Waived capabilities
// (S3, hosting, image/STT providers) are optional and default to local/stub.
const required = ["DATABASE_URL", "AUTH_SECRET"] as const;

export type AppEnv = {
  DATABASE_URL: string;
  AUTH_SECRET: string;
  META_API_KEY?: string;
  LLM_FALLBACK_API_KEY?: string;
  LLM_FALLBACK_PROVIDER?: string;
  IMAGE_FALLBACK_API_KEY?: string;
  STT_FALLBACK_API_KEY?: string;
  S3_ENDPOINT?: string;
  S3_BUCKET?: string;
  S3_ACCESS_KEY_ID?: string;
  S3_SECRET_ACCESS_KEY?: string;
  APP_BASE_URL: string;
  PORT: number;
};

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  const missing = required.filter((k) => !source[k]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
  return {
    DATABASE_URL: source["DATABASE_URL"] as string,
    AUTH_SECRET: source["AUTH_SECRET"] as string,
    META_API_KEY: source["META_API_KEY"],
    LLM_FALLBACK_API_KEY: source["LLM_FALLBACK_API_KEY"],
    LLM_FALLBACK_PROVIDER: source["LLM_FALLBACK_PROVIDER"],
    IMAGE_FALLBACK_API_KEY: source["IMAGE_FALLBACK_API_KEY"],
    STT_FALLBACK_API_KEY: source["STT_FALLBACK_API_KEY"],
    S3_ENDPOINT: source["S3_ENDPOINT"],
    S3_BUCKET: source["S3_BUCKET"],
    S3_ACCESS_KEY_ID: source["S3_ACCESS_KEY_ID"],
    S3_SECRET_ACCESS_KEY: source["S3_SECRET_ACCESS_KEY"],
    APP_BASE_URL: source["APP_BASE_URL"] ?? "http://localhost:3000",
    PORT: Number(source["PORT"] ?? 3000),
  };
}
