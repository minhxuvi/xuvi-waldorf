// Hands-on Vietnamese probe (Task 12 / U4): folktale segmentation quality.
// Reads META_API_KEY from .env, makes ONE small chat call, prints the model
// + output for human judgment. No child data, synthetic folktale text only.
import { readFileSync } from "node:fs";

const env = {};
for (const line of readFileSync(".env", "utf8").split("\n")) {
  const t = line.trim();
  if (t && !t.startsWith("#") && t.includes("=")) {
    const i = t.indexOf("=");
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
}

const PARA = "Ngày xửa ngày xưa, ở làng nọ có hai anh em. Người anh tham lam lấy hết ruộng vườn, chỉ cho em một cây khế. Chim thần đến ăn khế, chở người em ra đảo lấy vàng. Người em trở nên giàu có mà vẫn hiền lành.";

const res = await fetch("https://api.meta.ai/v1/chat/completions", {
  method: "POST",
  headers: { "content-type": "application/json", authorization: `Bearer ${env["META_API_KEY"]}` },
  body: JSON.stringify({
    model: "muse-spark-1.3",
    messages: [
      { role: "system", content: "Chia câu chuyện cổ tích sau thành các cảnh dễ nhớ, giữ sự kiện và quan hệ. Trả lời bằng tiếng Việt, dạng danh sách ngắn." },
      { role: "user", content: PARA },
    ],
    temperature: 0.3,
  }),
});
console.log("http:", res.status);
const body = await res.json();
console.log("model:", body.model || "(none)");
console.log("text:", (body.choices?.[0]?.message?.content ?? JSON.stringify(body).slice(0, 500)).slice(0, 1200));
