// Minimal Vietnamese-first message catalog. English is secondary.
export const messages = {
  vi: {
    "app.name": "XuVi Waldorf",
    "health.ok": "Hệ thống hoạt động bình thường",
    "error.missingEnv": "Thiếu biến môi trường bắt buộc",
  },
  en: {
    "app.name": "XuVi Waldorf",
    "health.ok": "System operational",
    "error.missingEnv": "Missing required environment variables",
  },
} as const;

export type Locale = keyof typeof messages;
export type MessageKey = keyof (typeof messages)["vi"];

export function t(locale: Locale, key: MessageKey): string {
  return messages[locale][key] ?? messages["vi"][key];
}
