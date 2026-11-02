# Runbook — XuVi Waldorf (local dev)

## Yêu cầu
- Node.js 20+, pnpm 10+, Python 3 + uv, PostgreSQL (Supabase pooler OK).
- Không cần Docker. Không cần key AI để chạy bản stub.

## Thiết lập lần đầu
1. `cp .env.example .env` rồi điền `DATABASE_URL`, `AUTH_SECRET` (≥32 ký tự).
2. AI (tùy chọn): `META_API_KEY` (Standard tier — không dùng Contributor cho dữ liệu trẻ em).
3. `pnpm install`
4. `pnpm db:migrate`
5. (Tùy chọn, dữ liệu tham khảo MOET) `uv run --with pypdf --no-project python3 scripts/ingest_moet.py --check` rồi `--seed`.

## Chạy
- Dev: `pnpm dev` → mở http://localhost:3000
- Prod build: `pnpm build && pnpm start`

## Kiểm tra
- `pnpm build && pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e`
- Export PDF cần headless shell trong Playwright cache (tự dò, không cần cài thêm).

## Quota / lưu trữ
- `AI_DAILY_QUOTA` (mặc định 50 lượt draft AI/gia đình/ngày; quá hạn → 429).
- Upload giới hạn 10MB/file (`MAX_UPLOAD_BYTES` trong `src/xuvi.ts`).
- Audio/hình ở `uploads/` (local-stub khi chưa cấu hình S3); sao lưu và chính sách giữ liệu do gia đình tự quản ở v1.
