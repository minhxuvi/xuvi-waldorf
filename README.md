# XuVi — Giáo dục lấy cảm hứng Waldorf tại Việt Nam

Ứng dụng local (chỉ lắng nghe 127.0.0.1) cho giáo viên: chương trình tổng thể & theo tuổi/lớp (mầm non → lớp 12), ma trận đối chiếu GDPT 2018 có provenance trang nguồn, kế hoạch năm, lịch tuần Thứ 2–Thứ 6 08:00–15:00, nhật ký/điểm danh/hồ sơ học sinh, xuất 6 loại hồ sơ (DOCX/Markdown/JSON/In-PDF), và XuVi Story — luyện kể chuyện dân gian với bản đồ cảnh, tranh chuẩn bị, ghi âm, transcript và góp ý có căn cứ (không điểm tổng).

## Chạy

```bash
npm install
npm run dev
```

Mở http://127.0.0.1:5173 trên trình duyệt (API chạy ở 5174). Bản production:

```bash
npm run build
npm start   # http://127.0.0.1:5174
```

Kiểm tra: `npm run typecheck` · `npm test`

## Dữ liệu & AI

- Dữ liệu bền vững: SQLite `data/xuvi.db` + file trong `data/files/` (không dùng localStorage làm kho chính). Sao lưu/khôi phục JSON v2 gồm cả media trong mục Cài đặt (kiểm tra & stage trước khi ghi, hỏng không mất dữ liệu). Duyệt/tìm 1555 trang MOET và trích yêu cầu hàng loạt ở mục Nguồn & Ma trận.
- Học sinh mẫu là hư cấu, gắn nhãn “dữ liệu minh họa”.
- AI tùy chọn phía server: đặt `META_API_KEY` trong môi trường server (xem [.env.example](.env.example)). Mỗi lần gửi đều hỏi xác nhận. Không có khóa, toàn bộ luồng thủ công và góp ý cục bộ (gắn nhãn “không phải AI”) vẫn hoạt động.
- Nghiên cứu & kiến trúc: [specs/03_research_and_architecture.md](specs/03_research_and_architecture.md) · Kiểm chứng: [specs/04_verification.md](specs/04_verification.md)
