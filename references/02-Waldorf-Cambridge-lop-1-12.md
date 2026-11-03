# Waldorf–Cambridge — chương trình tham khảo lớp 1–12

Gộp nguồn ngày 02/11/2026 từ repo `saokhue.xuvi.vn`; 12 tài liệu nguồn.

Bộ thiết kế kết hợp Waldorf với các mốc Cambridge trong repo. Nhãn examStatus là nhãn nội bộ, không phải chứng nhận hoặc syllabus chính thức. Bản lớp 3 vẫn ghi nghề thủ công/nghề mộc; lịch năm trong minhxuvi đã đổi Khối 13 sang Xe đạp theo mốc 10/10/2026. Dùng bộ này để tham khảo cấu trúc, không tự ghi đè quyết định mới.

Mỗi phần giữ nguyên nội dung và metadata của file nguồn. YAML đầu file được đặt trong khối mã để các lớp không bị hiểu thành một frontmatter chung. Đường dẫn và SHA-256 giúp tra lại bản nguồn; liên kết giáo án Làm vườn được đổi sang file gộp cùng thư mục để mở trực tiếp.

## Mục lục

- [Lớp 1](#nguon-01)
- [Lớp 2](#nguon-02)
- [Lớp 3](#nguon-03)
- [Lớp 4](#nguon-04)
- [Lớp 5](#nguon-05)
- [Lớp 6](#nguon-06)
- [Lớp 7](#nguon-07)
- [Lớp 8](#nguon-08)
- [Lớp 9](#nguon-09)
- [Lớp 10](#nguon-10)
- [Lớp 11](#nguon-11)
- [Lớp 12](#nguon-12)

<a id="nguon-01"></a>

## Lớp 1

Nguồn: `resources/content/alevel/alevel-lop-1.md`  
SHA-256: `9377c8b65af74a4eac926a3f8ba59fbe12144731f84b17097cbd5d75c05b24d8`

```yaml
id: alevel-lop-1
year: 1
title: "Tuyến A-Level · Lớp 1"
age: 6–7 tuổi
phase: primary-1
color: "#c45c4a"
motto: "Trời còn nằm trong truyện cổ tích — tiếng Anh đến qua hát, chào hỏi và trò chơi, chữ và số qua hình ảnh và nhịp điệu."
overview: "Lớp 1 mở đầu tuyến A-Level bằng đúng hơi thở Waldorf: chữ từ câu chuyện, số từ con vật và nhịp đếm — đồng thời gieo 'mạch tiếng Anh' từ ngày đầu. Không ép đọc viết sớm, không sách bài tập: trẻ nghe, kể, vẽ, chơi để tiếng Anh trở thành một thứ tiếng của thân thể và trái tim trước khi thành thứ tiếng của bài thi 15 năm sau."
milestones:
  - "Thuộc và kể lại truyện cổ tích, truyện dân gian Việt Nam; nhận diện, viết 29 chữ cái tiếng Việt qua hình ảnh."
  - "Đếm, viết, cộng–trừ trong phạm vi 20 gắn với hình ảnh và vận động."
  - "Tiếng Anh khẩu ngữ thuần: chào hỏi, màu sắc, số 1–20, bài hát và vần điệu hàng ngày."
  - "Xây thói quen thân thể: vẽ, đan, vận động, eurythmy và múa hát lễ hội."
weeksTotal: 36
festivalWeeks: 4
blocks:
  - subject: Ngôn ngữ
    weeks: 5
    topic: Truyện cổ tích & làm quen chữ cái
    examStatus: waldorf-only
    goals:
      - "Học mỗi chữ cái qua một câu chuyện và hình vẽ biến hoá (chữ 'Ô' — quả trứng ổ, chữ 'M' — hai ngọn núi)."
      - "Bắt đầu đánh vần, tập viết chữ in hoa lẫn chữ thường."
    activities:
      - "Nghe kể truyện cổ tích Việt Nam rồi truyện Grimm, vẽ tranh minh hoạ."
      - "Viết chữ lên giấy khổ rộng với sáp màu, chơi trò tìm chữ."
    skills:
      - Trí nhớ tường thuật
      - Ngữ âm
      - Viết tay
    development: "Trí nhớ 6–7 tuổi là trí nhớ hình ảnh và câu chuyện; gắn chữ với hình và vận động kích hoạt đa giác quan — nền của vùng đọc sau này."
  - subject: Toán
    weeks: 5
    topic: Số học qua hình ảnh & nhịp điệu
    examStatus: waldorf-only
    goals:
      - "Cấu trúc con số 1–20, cộng–trừ trong phạm vi 20."
      - "Hiểu ý nghĩa phép tính qua câu chuyện, không học thuộc lòng máy móc."
    activities:
      - "Đếm hạt, sỏi, tép đậu; vỗ tay đếm, nhảy ô số theo nhịp."
      - "Vẽ 'ngôi nhà số', kể chuyện mời bạn 'thêm một người bạn đến'."
    skills:
      - Cảm nhận con số
      - Vận động–đếm
      - Giải quyết vấn đề
    development: "Tư duy còn ở giai đoạn thao tác cụ thể: số cần bám vào vật đếm được và chuyển động cơ thể trước khi trừu tượng hoá."
  - subject: Hình vẽ nền tảng
    weeks: 4
    topic: Đường, vòng và vòm — bí mật của chữ viết
    examStatus: waldorf-only
    goals:
      - "Luyện kiểm soát tay–mắt qua vẽ thẳng, cong, lồi, lõm."
      - "Chuẩn bị dáng ngồi viết và nét chữ dẻo dai."
    activities:
      - "Vẽ các hình trong không gian lớp bằng bước chân trước khi vẽ lên giấy."
      - "Tô màu chuyển sắc, nghe nhạc cổ điển."
    skills:
      - Phối hợp tay–mắt
      - Kiểm soát trương lực
      - Cảm thụ không gian
    development: "Hình nền tảng rèn nét vận động tinh và 'cảm giác về đường nét' — cơ sở cơ–cảm giác cho kỹ năng viết và kiểm soát bút ở mọi bài thi tương lai."
  - subject: Đạo đức & xã hội
    weeks: 3
    topic: Sống chung, lễ phép, an toàn
    examStatus: waldorf-only
    goals:
      - "Chào hỏi, xin lỗi, biết ơn, giúp đỡ — nền hành vi xã hội."
      - "Quy tắc an toàn trong lớp, khi chơi và ở nhà."
    activities:
      - "Diễn kịch sắm vai các tình huống quen thuộc."
      - "Làm vườn, nhổ cỏ chăm sóc cây trong sân trường."
    skills:
      - Hợp tác
      - Tự điều chỉnh
      - Trách nhiệm
    development: "Trẻ học đạo đức qua mô hình và câu chuyện (giai đoạn 'luân lý bắt chước'), chứ không qua giáo huấn trừu tượng."
  - subject: Thiên nhiên
    weeks: 4
    topic: Bốn mùa & vòng quanh năm
    examStatus: waldorf-only
    goals:
      - "Quan sát sự thay đổi của cây cối, thời tiết, con vật theo mùa."
    activities:
      - "Một câu chuyện kéo dài về bốn 'nhân vật mùa'."
      - "Đi dạo thiên nhiên, sưu tầm lá, vẽ sổ theo mùa."
    skills:
      - Quan sát
      - Trí tưởng tượng
      - Yêu thiên nhiên
    development: "Tiếp xúc thiên nhiên phục hồi chú ý và nuôi trí tò mò — nền tảng của thái độ khoa học và các kỳ thi thực hành sau này."
  - subject: Tiếng Anh qua trò chơi
    weeks: 4
    topic: Hát, thơ, trò chơi tay — làm quen ngoại ngữ khẩu ngữ
    examStatus: waldorf-only
    goals:
      - "Nghe hiểu và nói được chào hỏi, màu sắc, con số, đồ vật qua trò chơi."
      - "Thuộc một kho bài hát, vần điệu và fingerplay tiếng Anh."
    activities:
      - "Giờ 'English Circle' mỗi ngày: hát, trò chơi tay, câu lệnh chơi vận động."
      - "Sổ vẽ 'từ điển hình' đầu tiên của riêng mình."
    skills:
      - Nghe hiểu khẩu ngữ
      - Phát âm qua vần điệu
      - Tự tin nói trước lớp
    development: "Ngôn ngữ thứ hai ở tuổi này học như tiếng mẹ đẻ: qua tai và thân thể trước chữ viết — đúng cách khởi động con đường đến IGCSE English 0500."
  - subject: Ngữ âm & chính tả
    weeks: 4
    topic: Âm vần Việt–Anh & trang sổ tay đẹp
    examStatus: waldorf-only
    goals:
      - "Luyện đánh vần tiếng Việt; phân biệt âm vần gần nhau."
      - "Nhận diện mặt chữ tiếng Anh qua tên gọi trong trò chơi."
    activities:
      - "Trò chơi bắt vần, nối hình–chữ, đọc to theo nhóm."
      - "Chép đoạn thơ ngắn, tô màu trang sổ tay."
    skills:
      - Ngữ âm
      - Chính tả
      - Viết tay
    development: "Sau nửa đầu năm nghe–kể–vẽ, âm vần được luyện thành kỹ năng có nhịp — nền đọc–viết vững trước khi sang lớp 2."
  - subject: Ngâm thơ – nhịp điệu & vận động
    weeks: 4
    topic: Đồng dao Việt & vần điệu Anh
    examStatus: waldorf-only
    goals:
      - "Thuộc kho đồng dao, ca dao Việt Nam cùng vận động tay nhịp."
      - "Phối hợp ngôn ngữ–chuyển động–nhạc cụ gõ, kể cả tiếng Anh."
    activities:
      - "Trò chơi vỗ tay, nhảy ô, đếm nhịp bằng trống con."
      - "Trình diễn 'bài hát tay' song ngữ trong ngày hội lớp."
    skills:
      - Nhịp điệu
      - Trí nhớ vần
      - Phối hợp
    development: "Vần điệu là 'phòng thí nghiệm vận động' của ngôn ngữ — thuộc bằng cả thân thể, mở đường đọc trôi chảy và phát âm tiếng Anh chuẩn."
  - subject: Ngày hội & văn nghệ
    weeks: 3
    topic: Sống trọn bốn mùa lễ hội
    examStatus: waldorf-only
    goals:
      - "Hiểu khai giảng, Tết, hội xuân, lễ hội cuối năm như nhịp trụ của năm học."
      - "Tham gia chuẩn bị, trình diễn và chia sẻ."
    activities:
      - "Làm đèn ông sao, mũ vải, thiệp Tết; hát và diễn kịch cổ tích."
      - "Giờ lễ hội có phần trình diễn tiếng Anh nhỏ cho phụ huynh."
    skills:
      - Văn hoá lễ hội
      - Hợp tác
      - Biểu diễn
    development: "Lễ hội tạo 'trụ dọc' cho năm học: trẻ cảm nhận thời gian trôi qua trong cộng đồng — nền cảm xúc của sự gắn kết và tự tin trình diễn."
weeklyContinuous:
  - subject: Tiếng Anh (khẩu ngữ)
    periodsPerWeek: 4
    focus: "English Circle mỗi ngày: hát, thơ, trò chơi tay, câu lệnh vận động — gieo mạch IGCSE 0500 từ năm đầu"
  - subject: Âm nhạc & hát
    periodsPerWeek: 2
    focus: "Hát dân ca, trò chơi vỗ tay, đàn năm dây nghe–cảm âm"
  - subject: Hội hoạ & thủ công
    periodsPerWeek: 2
    focus: "Màu nước ướt, nặn sáp, đan–dệt đơn giản"
  - subject: Thể dục & eurythmy
    periodsPerWeek: 2
    focus: "Trò chơi vận động, cầu thăng bằng, nhảy dây; eurythmy cử chỉ hoá âm thanh"
  - subject: Kịch & ngâm thơ
    periodsPerWeek: 1
    focus: "Diễn kịch cổ tích, ngâm thơ đồng dao và vần điệu Anh cuối tuần"
research:
  - claim: "Học chữ qua chuyện và viết tay kích hoạt mạch đọc trong não — viết tay tốt hơn đánh máy/đồ lại để nhận diện chữ."
    source: "James KH, Engelhardt L. Trends in Neuroscience and Education, 1:32–42, 2012."
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4274624/"
  - claim: "Bắt đầu học thuật muộn hơn (6–7 tuổi) giảm mất chú ý/tăng động ở tuổi 7 và 11 — trẻ vẫn bắt kịp học thuật."
    source: "Dee TS, Sievertsen HH. Health Economics, 27(5):781–802, 2018."
    url: "https://onlinelibrary.wiley.com/doi/10.1002/hec.3638"
  - claim: "Tiếp xúc sớm với ngôn ngữ thứ hai qua hình thức tự nhiên (hát, chơi, nghe) xây nền thính giác và phát âm — khác hẳn việc ép ngữ pháp sớm."
    source: "Werker JF, Hensch TK. Annual Review of Neuroscience, 38:1–23, 2015."
```


## Chi tiết chương trình

**Lớp 1 là năm 'đặt viên gạch đầu tiên' của cả tuyến.** Mọi thứ của 15 năm sau — CEFR, IGCSE 0500, khối
lượng thi cử — đều nuôi dưỡng từ những việc rất nhỏ hôm nay: nghe kể truyện, vỗ tay đếm nhịp, và nói
tiếng Anh bằng cả thân thể trong 'English Circle' mỗi sáng. Không bảng chữ cái nhồi nhét, không quiz từ
vựng: trẻ 'thuộc' ngôn ngữ như thuộc một bài hát.

**Tiếng Anh ở lớp 1 là tiếng của trái tim, không phải của bài kiểm tra.** Người học 6–7 tuổi tiếp thu
ngôn ngữ qua tai và nhịp điệu trước chữ viết. Tuyến A-Level cố tình để tiếng Anh 'chảy' qua hát, thơ,
trò chơi tay và câu lệnh vận động mỗi ngày — để khi đến bậc học thuật, thứ tiếng ấy đã nằm trong cơ thể,
không còn là rào cản.

**Nhịp 40 tuần.** Năm lớp 1 chạy khoảng 40 tuần — 36 tuần học + 4 tuần lễ hội tách biệt. Các khối bài
học chính chiếm phần lớn buổi sáng; tiếng Anh, âm nhạc, hội hoạ–thủ công, thể dục–eurythmy và kịch chạy
đều như mạch nước suốt cả năm — mỗi ngày đều có hít thở của bài học chính, vận động ngoài trời và nghệ
thuật.

<a id="nguon-02"></a>

## Lớp 2

Nguồn: `resources/content/alevel/alevel-lop-2.md`  
SHA-256: `c513cbbb4d198e27f41426812d1fa28a6cc07a9f4ffc8e8463981b24895bf80a`

```yaml
id: alevel-lop-2
year: 2
title: "Tuyến A-Level · Lớp 2"
age: 7–8 tuổi
phase: primary-2
color: "#d98a3d"
motto: "Ngụ ngôn, phép nhân và những mảnh vườn — tiếng Anh rời độc thoại, bước vào câu chuyện song ngữ đầu tiên."
overview: "Lớp 2 là năm truyện ngụ ngôn và thánh tích: trẻ 7–8 tuổi bắt đầu nhìn ra 'cái thiện–cái ác' bên trong câu chuyện. Phép nhân rộng từ cộng lặp, ngôn ngữ chuyển từ 'nghe–nói' sang 'đọc–viết có cấu trúc', và tiếng Anh bước qua ngưỡng cửa đầu tiên: đọc–kể truyện song ngữ Anh–Việt."
milestones:
  - "Thuộc bảng cửu chương 1–12 gắn với nhịp điệu; cộng–trừ vững, đọc số lớn hơn."
  - "Đọc và kể lại truyện ngụ ngôn, thánh tích; viết câu đúng chính tả và ngữ pháp căn bản."
  - "Tiếng Anh khẩu ngữ lên mức B0–B1 sớm: kể con vật yêu thích, mô tả nơi chốn, đọc truyện ngắn song ngữ."
  - "Hoàn thành dự án 'làng nghề' hoặc 'mảnh vườn' nhỏ của lớp với kỹ năng thủ công."
weeksTotal: 36
festivalWeeks: 4
blocks:
  - subject: Ngôn ngữ
    weeks: 5
    topic: Ngụ ngôn & thánh tích từ khắp thế giới
    examStatus: waldorf-only
    goals:
      - "Kể và phân biệt ý nghĩa ngụ ngôn, thánh tích, truyện loài vật."
      - "Viết đoạn văn ngắn có cấu trúc mở–thân–kết."
    activities:
      - "Kịch hoá ngụ ngôn, vẽ tranh nhân vật, đặt tên 'bài học' cho truyện."
      - "Viết sổ câu chuyện cá nhân, chép thơ ca dao."
    skills:
      - Trí nhớ tường thuật
      - Viết đoạn
      - Tư duy đạo đức qua truyện
    development: "Tuổi 7–8 nhạy cảm với ranh giới thiện–ác; ngụ ngôn 'nói ngang' bằng hình ảnh — hiệu quả hơn lời giáo huấn, và là mạch ngầm của năng lực đọc hiểu sau này."
  - subject: Toán
    weeks: 5
    topic: Phép nhân mở rộng & bảng cửu chương 1–12
    examStatus: waldorf-only
    goals:
      - "Hiểu phép nhân là cộng lặp; thuộc và dùng bảng cửu chương tự tin."
      - "Bắt đầu chia qua câu chuyện 'chia đều cho bạn bè'."
    activities:
      - "Đếm bước chân, vỗ tay nhóm 2–3–4; vẽ vòng nhân hoa."
      - "Chia kẹo, hạt cho các bạn như một 'nhiệm vụ công bằng'."
    skills:
      - Cảm nhận số
      - Bảng cửu chương
      - Chia sẻ
    development: "Phép nhân 'mọc ra' từ nhịp vận động và câu chuyện — trẻ thuộc bằng cả cơ thể, không bằng bài tập máy móc."
  - subject: Hình vẽ nền tảng
    weeks: 3
    topic: Đường đối xứng & vòng xoắn
    examStatus: waldorf-only
    goals:
      - "Vẽ các hình đối xứng, vòng, xoắn — kiểm soát tay chính xác hơn."
    activities:
      - "Vẽ bướm đối xứng, bông hoa xoắn từ tâm; phản chiếu vào gương."
    skills:
      - Đối xứng
      - Kiểm soát nét
      - Cảm thụ hình học
    development: "Đối xứng và xoắn là 'hình học cơ thể' đầu tiên — nền trực giác hình học và kỹ năng vẽ chính xác cho bài thi sau."
  - subject: Đạo đức & văn hóa
    weeks: 3
    topic: Truyện các nhà thánh hiền và cách sống tốt
    examStatus: waldorf-only
    goals:
      - "Qua truyện thánh tích và ngụ ngôn, hiểu các đức tính: dũng cảm, trung thực, vị tha."
    activities:
      - "Thảo luận 'nếu mình là nhân vật…', vẽ tranh cử chỉ đẹp."
      - "Thực hành giúp việc lớp: trực nhật, tưới cây, giữ vệ sinh."
    skills:
      - Đồng cảm
      - Trách nhiệm
      - Tự phản ánh
    development: "Đức tính học qua gương người tốt trong truyện — tuổi này 'đói' những hình ảnh cái tốt rõ ràng để bắt chước."
  - subject: Thiên nhiên & làng quê
    weeks: 4
    topic: Cuộc sống quanh nhà — cây trồng, con vật, nghề truyền thống
    examStatus: waldorf-only
    goals:
      - "Quan sát vòng đời cây trồng, con vật quen thuộc và nghệ nhân làng nghề."
    activities:
      - "Thăm làng nghề, gặp nghệ nhân; làm một sản phẩm thủ công đơn giản."
      - "Gieo hạt, theo dõi sổ cây, thu hoạch rau."
    skills:
      - Quan sát thực địa
      - Kiên nhẫn
      - Trân trọng lao động
    development: "Tiếp xúc làng nghề và thiên nhiên nuôi kiến thức nền của địa lý–kinh tế về sau — và niềm kính trọng công việc làm bằng tay."
  - subject: Tiếng Anh & kể chuyện song ngữ
    weeks: 4
    topic: Đọc–kể truyện Anh–Việt đầu tiên
    examStatus: waldorf-only
    goals:
      - "Nghe hiểu và kể lại một câu chuyện ngắn tiếng Anh bằng ngôn ngữ của mình."
      - "Nhận diện từ, câu tiếng Anh trong sách tranh song ngữ."
    activities:
      - "Storytelling circle song ngữ: kể một câu, dịch vui một câu."
      - "Làm 'sổ truyện song ngữ' vẽ và viết bằng cả hai tiếng."
    skills:
      - Nghe hiểu
      - Kể chuyện
      - Nhận diện chữ Anh
    development: "Chuyển từ 'nghe tiếng Anh' sang 'kể tiếng Anh' là bước ngoặt ngôn ngữ ở tuổi 7–8 — nền của hội thoại và viết đoạn sau này."
  - subject: Ngữ pháp & chính tả
    weeks: 4
    topic: Câu mở rộng & quy tắc viết đẹp
    examStatus: waldorf-only
    goals:
      - "Mở rộng câu bằng tính từ, trạng từ; viết đúng chính tả từ quen."
    activities:
      - "Trò chơi 'thêm gia vị cho câu', viết thư cho người thân."
      - "Chép và học thuộc thơ, đồng dao."
    skills:
      - Ngữ pháp
      - Chính tả
      - Viết tay
    development: "Ngữ pháp đến qua trò chơi 'thêm gia vị' — trẻ thấy câu sống động trước khi nghe tên quy tắc."
  - subject: Vận động & nhịp điệu
    weeks: 4
    topic: Đồng dao, vận động và vần điệu song ngữ
    examStatus: waldorf-only
    goals:
      - "Thuộc kho đồng dao Việt và vần điệu Anh; kết hợp vận động."
    activities:
      - "Trò chơi vỗ tay, nhảy ô, đếm nhịp; đi dạo theo mùa."
      - "Trình diễn vần điệu song ngữ trong giờ hội."
    skills:
      - Nhịp điệu
      - Phối hợp
      - Trí nhớ vần
    development: "Vần điệu song ngữ và vận động rèn tai nghe và kỷ luật thân thể — mạch ngầm của phát âm và thể thao sau này."
  - subject: Ngày hội & văn nghệ
    weeks: 4
    topic: Lễ hội bốn mùa & kịch ngụ ngôn
    examStatus: waldorf-only
    goals:
      - "Tham gia chuẩn bị, trình diễn lễ hội và vở kịch ngụ ngôn của lớp."
    activities:
      - "Dựng vở kịch ngụ ngôn (lồng vài câu tiếng Anh), làm trang phục đơn giản."
      - "Múa, hát, chia sẻ trong ngày hội cuối năm."
    skills:
      - Văn hoá lễ hội
      - Biểu diễn
      - Hợp tác
    development: "Kịch để trẻ 'sống' bài học đạo đức bằng cả cơ thể — và lần đầu dũng cảm nói tiếng Anh trên sân khấu."
weeklyContinuous:
  - subject: Tiếng Anh (Cambridge)
    periodsPerWeek: 4
    focus: "English warm-up mỗi ngày: hát, thơ, hỏi–đáp; đọc truyện song ngữ — tiến dần tới mạch IGCSE 0500"
  - subject: Âm nhạc & hát
    periodsPerWeek: 2
    focus: "Hát dân ca, đàn năm dây; vần điệu Anh"
  - subject: Hội hoạ & thủ công
    periodsPerWeek: 2
    focus: "Màu nước, nặn sáp, đan móc đơn giản"
  - subject: Thể dục & eurythmy
    periodsPerWeek: 2
    focus: "Trò chơi vận động, cầu thăng bằng; eurythmy âm thanh–cử chỉ"
  - subject: Kịch & ngâm thơ
    periodsPerWeek: 1
    focus: "Kịch ngụ ngôn, ngâm thơ song ngữ"
research:
  - claim: "Ngụ ngôn và truyện ngụ ý hỗ trợ hiểu biết xã hội và lý luận đạo đức ở trẻ tiểu học — trẻ lý giải hành vi nhân vật để rút bài học, đúng cách Waldorf dùng truyện để giáo dục đạo đức."
    source: "Narvaez D. Journal of Moral Education, 30(2):157–166, 2001."
  - claim: "Song ngữ từ nhỏ (kể cả qua hát, kể chuyện) liên quan đến kiểm soát chú ý và linh hoạt nhận thức tốt hơn — nền tảng tuyến A-Level giữ tiếng Anh 'mềm' từ lớp 2."
    source: "Bialystok E. Child Development Perspectives, 9(3):186–191, 2015."
    url: "https://doi.org/10.1111/cdep.12116"
```


## Chi tiết chương trình

**Lớp 2 là năm đầu tiên trẻ 'nhìn vào trong'.** Truyện ngụ ngôn và thánh tích khắp thế giới — từ con quạ
và bình nước đến thánh Martin — cho phép trẻ 7–8 tuổi đối diện câu hỏi thiện–ác qua câu chuyện, không qua
lời dạy. Cùng lúc, toán mở rộng từ cộng sang nhân, và ngôn ngữ đi từ nghe–kể sang đọc–viết có cấu trúc.

**Tiếng Anh bước qua 'cánh cửa' kể chuyện.** Từ độc thoại mỗi sáng, trẻ chuyển sang kể lại truyện ngắn,
đọc sách tranh song ngữ, dựng kịch ngụ ngôn lồng tiếng Anh. Mạch ngôn ngữ vẫn 'mềm' — qua hát, thơ, trò
chơi — nhưng đã có hình hài của hội thoại và cấu trúc, đặt nền cho bậc đọc–viết học thuật ở các lớp sau.

**Nhịp 40 tuần.** Năm lớp 2 chạy khoảng 40 tuần — 36 tuần học + 4 tuần lễ hội tách biệt. Khối bài học
chính dày đặc đầu ngày; tiếng Anh, âm nhạc, hội hoạ–thủ công, thể dục–eurythmy và kịch chạy đều cả năm —
mỗi tuần trẻ đều có đủ vận động, nghệ thuật và câu chuyện.

<a id="nguon-03"></a>

## Lớp 3

Nguồn: `resources/content/alevel/alevel-lop-3.md`  
SHA-256: `cf7d8a8e1b80b92450a7124794dca857971b1e8a771fe0a0aa8742b65c772154`

```yaml
id: alevel-lop-3
year: 3
title: "Tuyến A-Level · Lớp 3"
age: 8–9 tuổi
phase: primary-3
color: "#a8a93e"
motto: "Chín tuổi — từ huyền thoại sáng thế bước vào đời thật: bếp lửa, ruộng đồng, nhà cửa và tiếng Anh chuyện thật."
overview: "Khoảng chín tuổi, Waldorf gọi là 'sự chín tuổi của thời thơ ấu': trẻ bắt đầu tách mình khỏi thế giới thần tiên, muốn hiểu việc thật — nấu bữa ăn, gặt lúa, dựng nhà, đong đếm, tiền bạc. Năm mở đầu bằng những huyền thoại nguồn cội của người Việt — 'Con rồng cháu tiên' và 'Đẻ đất đẻ nước' — thay cho truyện Cựu Ước kinh điển, để câu hỏi 'ta từ đâu ra' chạm ngay gốc rễ văn hoá của chính mình. Nửa cuối năm nối tiếp bằng câu chuyện lễ hội: Trung thu, truyện Cựu Ước và Tết."
milestones:
  - "Kể lại được hai huyền thoại sáng thế 'Con rồng cháu tiên' và 'Đẻ đất đẻ nước' — cột mốc ngôn ngữ và gốc rễ văn hoá đầu năm."
  - "Thành thạo đo lường: chiều dài, khối lượng, thời gian, tiền; tính dọc bốn phép tính vững vàng."
  - "Trải nghiệm chuỗi 'cái ăn – cái mặc – cái ở': nấu ăn, ngày mùa, xây nhà, làm vườn, nghề mộc."
  - "Hiểu nhịp năm qua lễ hội Trung thu, Cựu Ước và Tết — hình ảnh 'thời gian chảy qua đời sống'."
  - "Tiếng Anh câu chuyện thật: mô tả công việc, lễ hội, quy trình bằng câu đơn–kép."
weeksTotal: 35
festivalWeeks: 4
blocks:
  - subject: Những huyền thoại Sáng thế
    weeks: 3
    topic: "'Con rồng cháu tiên' & 'Đẻ đất đẻ nước' — mở năm bằng truyện nguồn cội"
    examStatus: waldorf-only
    goals:
      - "Nghe, kể lại và vẽ minh hoạ 'Con rồng cháu tiên' và 'Đẻ đất đẻ nước'."
      - "Hiểu 'mọi dân tộc có câu chuyện nguồn cội' — và mở câu hỏi về trật tự, sự xuất hiện của thế giới."
    activities:
      - "Kể chuyện thành nhiều buổi, trẻ vẽ sổ truyện và đóng kịch các cảnh."
      - "So sánh cách hai truyện trả lời 'đất nước từ đâu ra?' — làm quen tư duy câu chuyện."
    skills:
      - Kể chuyện
      - Đọc hiểu sâu
      - Liên hệ bản thân
    development: "Trong Waldorf quốc tế, lớp 3 thường mở bằng Cựu Ước; ở Việt Nam ta mở bằng huyền thoại sáng thế của chính mình — trẻ chín tuổi cần 'gốc' trước khi đi xa."
  - subject: Nấu ăn
    weeks: 2
    topic: Từ bếp gia đình — đong đếm, công thức và bữa ăn thật
    examStatus: waldorf-only
    goals:
      - "Đong, cân nguyên liệu theo công thức; hiểu 'từ nguyên liệu thành món ăn'."
      - "Làm quen từ vựng nấu ăn bằng tiếng Anh: ingredients, measure, recipe."
    activities:
      - "Nấu vài món đơn giản theo công thức; ghi sổ công thức lớp."
      - "Đọc 'recipe card' song ngữ, thực hành Show and Tell món đã làm."
    skills:
      - Đo lường thực dụng
      - Làm việc theo quy trình
      - Hợp tác
    development: "Nấu ăn là khối 'đo lường có nghĩa ngay lập tức': cân đường, đong nước — toán bám vào đời sống, tiếng Anh bám vào việc thật."
  - subject: Ngày mùa — Thu hoạch lúa
    weeks: 1
    topic: Từ ruộng lúa đến bát cơm — ngày gặt
    examStatus: waldorf-only
    goals:
      - "Chứng kiến và tham gia một phần chuỗi: gặt, tuốt, phơi, xay, giã."
      - "Hiểu 'bát cơm mình ăn đi qua bao nhiêu mồ hôi'."
    activities:
      - "Thăm đồng/ruộng vùng gần, trải nghiệm gặt tay hoặc tuốt lúa."
      - "Vẽ sổ 'hành trình hạt lúa', kể lại cho gia đình."
    skills:
      - Quan sát
      - Trân trọng thức ăn
      - Lao động chân tay
    development: "Khối 1 tuần nhỏ gọn nhưng neo rất sâu: ngày mùa đón tuổi chín bằng cái thật của đồng ruộng — bài học về nhịp chờ đợi và nỗ lực."
  - subject: Đo lường & Thực hành tính dọc
    weeks: 3
    topic: Mét, cân, giờ, tiền + tính dọc bốn phép tính
    examStatus: waldorf-only
    goals:
      - "Đo, ước lượng, đổi đơn vị chiều dài–khối lượng–thời gian–tiền."
      - "Thành thạo đặt tính rồi tính dọc cộng–trừ–nhân–chia với số có 2–3 chữ số."
    activities:
      - "Đo lớp học, sân trường, cân rau, đong nước — viết bảng kết quả."
      - "Bài toán tính dọc gắn chợ búa, mua bán, vận chuyển."
    skills:
      - Đo lường
      - Quy đổi đơn vị
      - Tính dọc
    development: "Đo lường và tính dọc là 'toán bám vào thế giới' — chuẩn bị trực tiếp cho phần số, đo và xử lý dữ liệu của toán Cambridge 0580."
  - subject: Hành trình Rừng rậm
    weeks: 1
    topic: Thám hiểm — định hướng, thực vật, động vật trong rừng
    examStatus: waldorf-only
    goals:
      - "Quan sát và phân loại thực vật, dấu chân, tiếng chim quanh vùng cây."
      - "Thực hành định hướng đơn giản: đọc bản đồ, tìm mốc, làm nhóm."
    activities:
      - "Buổi đi bộ thám hiểm; vẽ 'bản đồ kho báu' của lớp."
      - "Kể chuyện thám hiểm bằng tiếng Anh ở mức đơn: we saw…, we found…"
    skills:
      - Quan sát
      - Định hướng
      - Làm việc nhóm
    development: "Hành trình 1 tuần đánh thức giác quan và kỹ năng đọc 'không gian thật' — nền cho địa lý, sinh học và tư duy hệ thống sau này."
  - subject: Lý thuyết Âm nhạc
    weeks: 3
    topic: Nốt, khuông nhạc và nhịp — hiểu điều mình hát
    examStatus: waldorf-only
    goals:
      - "Đọc và viết nốt cơ bản trên khuông, nhận biết trường độ, nhịp."
      - "Liên hệ lý thuyết với bài hát đang hát — 'âm nhạc có cấu trúc'."
    activities:
      - "Chơi trò 'nốt nào hát đó'; viết câu nhạc 4–8 ô nhịp."
      - "Vẽ sơ đồ khuông nhạc, nhận diện quãng bằng tai."
    skills:
      - Đọc nhạc
      - Nghe phân tích
      - Ký hiệu
    development: "Khối lý thuyết làm cho âm nhạc thành 'ngôn ngữ có chữ viết' — trẻ chín tuổi thích giải mã ký hiệu, và đó lại là nền của tư duy trừu tượng."
  - subject: Xây dựng nhà
    weeks: 4
    topic: Từ mái tranh đến ngôi nhà — vật liệu, kết cấu, mô hình
    examStatus: waldorf-only
    goals:
      - "Hiểu các kiểu nhà, vật liệu và công đoạn dựng một ngôi nhà."
      - "Thực hành làm mô hình quy mô nhỏ: móng, khung, mái, trát."
    activities:
      - "Dựng mô hình nhà bằng đất, tre, giấy; vẽ mặt cắt ngôi nhà."
      - "Thăm công trường/làng nghề xây dựng truyền thống gần nhà."
    skills:
      - Thực hành
      - Hình học không gian
      - Kiên nhẫn
    development: "Dựng nhà gom mọi giác quan và tư duy kết cấu — bước nhảy không gian đúng tuổi chín, và mở đường cho hình học của toán Cambridge."
  - subject: Làm vườn
    weeks: 3
    topic: Trồng trọt theo mùa — và tạm biệt mùa thu bằng Tết Trung thu
    examStatus: waldorf-only
    goals:
      - "Gieo, chăm, thu hoạch một số loại rau/cây theo mùa."
      - "Hiểu ý nghĩa Tết Trung thu: thu hoạch, đoàn viên, trăng tròn."
    activities:
      - "Chăm vườn lớp, ghi sổ vườn theo tuần."
      - "Cuối khối: đọc/kể chuyện Trung thu (chị Hằng – chú Cuội), rước đèn, phá cỗ."
    skills:
      - Quan sát
      - Trách nhiệm
      - Văn hoá lễ hội
    development: "Làm vườn cho trẻ chín tuổi cái neo thực tại: đất, nước và quy luật chờ đợi. Tết Trung thu khép khối bằng niềm vui lễ hội — thời gian bắt đầu 'chảy thành câu chuyện'."
  - subject: Thời gian
    weeks: 3
    topic: Lịch, đồng hồ, mùa — thời gian chảy qua đời sống
    examStatus: waldorf-only
    goals:
      - "Đọc giờ, hiểu lịch, các đơn vị thời gian và nhịp mùa trong năm."
      - "Gắn thời gian với đời sống: việc theo giờ, lễ hội theo tháng."
    activities:
      - "Làm đồng hồ, lịch mùa lớp, theo dõi bóng nắng."
      - "Kể lại một ngày 'từ sáng đến tối' bằng tiếng Việt và tiếng Anh."
    skills:
      - Đọc giờ
      - Khái niệm thời gian
      - Liên hệ thực tế
    development: "Thời gian là khái niệm trừu tượng đầu tiên mà trẻ chạm bằng lịch và đồng hồ — điểm nối giữa đo lường và lịch sử về sau."
  - subject: Ngữ pháp & Viết sáng tạo
    weeks: 2
    topic: Truyện Cựu Ước & câu mở rộng — viết thành câu chuyện
    examStatus: waldorf-only
    goals:
      - "Kể và viết lại các cảnh truyện Cựu Ước (bản thuật cho thiếu niên) bằng lời riêng."
      - "Mở rộng câu với trạng ngữ; viết đoạn 4–6 câu có chủ đề."
    activities:
      - "Kể chuyện thành buổi; trẻ tóm tắt và minh hoạ vào sổ."
      - "Trò 'câu dài nhất': mở rộng câu dần bằng trạng ngữ chỉ thời gian, nơi chốn."
    skills:
      - Viết sáng tạo
      - Ngữ pháp
      - Đọc sử liệu
    development: "Cựu Ước về 'một dân tộc lữ hành tìm đường về nhà' đồng hành với tâm lý lạc lõng của tuổi chín — đây là nửa sau của năm, sau khi 'gốc Việt' đã được kể ở đầu năm."
  - subject: Tiền tệ
    weeks: 3
    topic: Chợ phiên — tính tiền, trả tiền, ngân sách
    examStatus: waldorf-only
    goals:
      - "Dùng tiền trong tình huống thật: mua bán, tính tiền, trả tiền thừa."
      - "Lập 'ngân sách nhỏ' cho dự án lớp."
    activities:
      - "'Chợ phiên lớp': bán–tính–tiền tiền thật, đổi tiền, trả tiền thừa."
      - "Lên kế hoạch chi tiêu chuyến dã ngoại bằng phép tính."
    skills:
      - Đo lường
      - Quản lý tiền
      - Dự toán
    development: "Tiền tệ là 'toán làm việc': mua bán khiến con số có ý nghĩa — nền trực giác kinh tế cho môn Kinh tế IGCSE 0455 rất nhiều năm sau."
  - subject: Toán học chuyên sâu
    weeks: 3
    topic: Tính dọc thành thạo — chuẩn bị phân số
    examStatus: waldorf-only
    goals:
      - "Ôn luyện và thực hành thành thạo tính dọc bốn phép tính."
      - "Làm quen ý niệm phân số đầu tiên: chia đều, chia phần, một phần."
    activities:
      - "Kho bài tập tính dọc theo thang tiến bộ cá nhân."
      - "Chia bánh/phân đoạn để 'cảm' phân số trước khi viết ký hiệu."
    skills:
      - Tính dọc
      - Phân số nhập môn
      - Tự kiểm tra
    development: "Khối cuối năm củng cố nền số vững — và 'mầm phân số' gieo bằng việc chia đều để lớp 4 bắt kịp đúng nhịp."
  - subject: Nghề thủ công & Nghề mộc
    weeks: 2
    topic: Làng nghề, nghề mộc và chuẩn bị Tết
    examStatus: waldorf-only
    goals:
      - "Làm quen một nghề thủ công truyền thống và công đoạn nghề mộc cơ bản."
      - "Làm sản phẩm bằng tay đúng dịp Tết: đồ trang trí, món quà nhỏ."
    activities:
      - "Thăm làng nghề; thực hành mộc quy mô nhỏ (bào, đục, chà nhám)."
      - "Làm lồng đèn, thiệp, đồ trang trí Tết cho lớp và gia đình."
    skills:
      - Khéo tay
      - Kiên nhẫn
      - Văn hoá Tết
    development: "Bàn tay làm ra cái đẹp trước kỳ nghỉ Tết — trẻ thấy 'mình làm được thứ có giá trị', và đất nước đi vào qua chính tay mình."
  - subject: Tổng kết cuối năm & Tiệc cộng đồng
    weeks: 2
    topic: Truyện Tết, tổng kết năm và tiệc cộng đồng
    examStatus: waldorf-only
    goals:
      - "Kể lại vòng câu chuyện cả năm: sáng thế → công việc → lễ hội → Tết."
      - "Tổ chức tiệc cộng đồng khép năm với sản phẩm trẻ đã làm."
    activities:
      - "Kể/đóng kịch truyện Tết; trưng bày sổ tay và sản phẩm thủ công."
      - "Tiệc cuối năm: trẻ đón khách, giới thiệu công trình của mình."
    skills:
      - Tổ chức
      - Biểu diễn
      - Tự hào học tập
    development: "Ngày hội khép lại 'năm cái thật' bằng niềm vui và sự công nhận — trẻ hiểu cả năm mình đã lớn ra sao, và Tết mở ra năm mới như một câu chuyện khác."
weeklyContinuous:
  - subject: Tiếng Anh (Cambridge)
    periodsPerWeek: 4
    focus: "Show and Tell, mô tả lễ hội và công việc, hỏi–đáp What/How/Why — tiến tới B1 sơ khai, hướng IGCSE 0500"
  - subject: Toán
    periodsPerWeek: 2
    focus: "Đo lường, đổi đơn vị, tính dọc, toán đời sống — vốn nền 0580"
  - subject: Âm nhạc & hát
    periodsPerWeek: 2
    focus: "Hát dân ca, bài hát lễ hội, đàn năm dây, vần điệu Anh"
  - subject: Hội hoạ & thủ công
    periodsPerWeek: 2
    focus: "Màu nước, nặn, may vá, làm đồ thủ công theo mùa"
  - subject: Thể dục & eurythmy
    periodsPerWeek: 2
    focus: "Trò chơi vận động, múa vòng; eurythmy"
research:
  - claim: "Khoảng 9 tuổi xuất hiện bước chuyển nhận thức khi trẻ tách 'cái thật' khỏi 'cái tưởng tượng' — Waldorf gọi là 'sự chín tuổi' và đáp ứng bằng học trải nghiệm thực tế; nghiên cứu cho thấy học qua thực hành cải thiện ghi nhớ và hiểu."
    source: "Dewey J. Experience and Education. Kappa Delta Pi, 1938; xem thêm Kolb DA. Experiential Learning. Prentice Hall, 1984."
  - claim: "Học qua tay (hands-on) và trải nghiệm thực địa giúp trẻ tiểu học gắn kết khái niệm trừu tượng với ý nghĩa — phù hợp với các khối Nấu ăn, Ngày mùa, Xây dựng nhà, Làm vườn, Nghề mộc."
    source: "Freeman S, et al. PNAS, 111(23):8410–8415, 2014."
  - claim: "Trẻ phát triển bản sắc văn hoá lành mạnh khi được kể những câu chuyện nguồn cội của chính dân tộc mình — nền tảng cho việc mở đầu năm bằng huyền thoại Việt ('Con rồng cháu tiên', 'Đẻ đất đẻ nước') thay cho truyện Cựu Ước, đồng thời đặt trẻ vào đúng câu hỏi tâm lý 'ta từ đâu ra' của tuổi chín."
    source: "Hammack PL. Narrative and the politics of identity. Oxford University Press, 2010; xem thêm tc văn hoá dân gian Việt Nam."
```


## Chi tiết chương trình

**Lớp 3 là năm 'bước ra khỏi câu chuyện'.** Waldorf đặt tên cho tuổi chín là lúc trẻ rời thế giới thần
tiên đi tìm cái thật. Vì vậy năm học xoay quanh công việc và đời sống: bếp lửa (Nấu ăn), ruộng đồng
(Ngày mùa – Thu hoạch lúa), nhà cửa (Xây dựng nhà), vườn tược (Làm vườn), nghề mộc và làng nghề, rồi
đong đếm, tính dọc và tiền bạc. Trẻ được chạm tay vào cơm, đất, tre, tiền thật — và từ đó đại số, hình
học, kinh tế của mười năm sau không còn là xa lạ.

**Mở năm bằng huyền thoại nguồn cội của người Việt.** Khác với Waldorf quốc tế mở lớp 3 bằng Cựu Ước,
năm học này mở bằng 'Con rồng cháu tiên' và 'Đẻ đất đẻ nước' — những câu chuyện sáng thế trả lời đúng
câu hỏi 'ta từ đâu ra' mà trẻ chín tuổi đang bắt đầu hỏi, lại ngay trong gốc rễ văn hoá của chính mình.
Câu chuyện Cựu Ước về 'một dân tộc lữ hành tìm đường về nhà' được dùng ở nửa cuối năm (khối Ngữ pháp &
Viết sáng tạo), khi trẻ đã có nền tảng ngôn ngữ để đón một câu chuyện dài khác.

**Nhịp năm chạy theo lễ hội.** Khối Làm vườn khép bằng Tết Trung thu — trăng tròn, rước đèn, đoàn viên —
rồi thời gian đi qua lịch, đồng hồ và bốn mùa; năm khép lại bằng truyện Tết, tiệc cộng đồng và những món
đồ thủ công trẻ tự làm. Trẻ cảm 'thời gian chảy qua đời sống' bằng chính các lễ hội mình tham gia.
[Xem kế hoạch bài giảng từng ngày của khối Làm vườn →](05-Giao-an-mau-Lam-vuon-lop-3.md)

**Tiếng Anh kể 'chuyện thật'.** Thay vì chuyện cổ tích, lớp 3 dùng Show and Tell, mô tả công việc, lễ hội
và quy trình làm ra đồ vật, trò chuyện What/How/Why. Người học 8–9 tuổi bắt đầu 'tường thuật' được thế
giới bằng tiếng Anh — một dấu mốc ngôn ngữ, đặt nền cho văn bản học thuật của Cambridge IGCSE sau này.

**Nhịp 39 tuần.** Năm lớp 3 chạy khoảng 39 tuần — 35 tuần học + 4 tuần lễ hội tách biệt (nghỉ theo đợt
sẽ đan xen theo mùa). Các khối thực tiễn (nấu ăn, ngày mùa, nhà cửa, làm vườn, mộc) chiếm nhiều giờ
thực hành; tiếng Anh, âm nhạc, hội hoạ–thủ công, thể dục–eurythmy và kịch chạy đều cả năm như hơi thở.

<a id="nguon-04"></a>

## Lớp 4

Nguồn: `resources/content/alevel/alevel-lop-4.md`  
SHA-256: `25b636615994874ade2f05431f8ee16ed72f67624a1f2a0e6fdc7ad3f1bba21a`

```yaml
id: alevel-lop-4
year: 4
title: "Tuyến A-Level · Lớp 4"
age: 9–10 tuổi
phase: primary-4
color: "#6d8b4e"
motto: "Thần thoại Bắc Âu, phân số và long đất — tiếng Anh bắt đầu 'viết ra': đoạn văn, câu chuyện và sự kiện thật."
overview: "Lớp 4 đánh dấu 'bước nhảy chín tuổi' hoàn tất: trẻ tự tin, dũng cảm, sẵn sàng đối diện cái lớn — thần thoại Bắc Âu rầm rộ, phân số mở cánh cửa toán thật, lịch sử và địa lý địa phương gắn trẻ với dòng chảy thời gian. Tiếng Anh rời 'nói', bước sang 'viết': đoạn văn, câu chuyện và bài tường thuật sự kiện đầu tiên."
milestones:
  - "Thần thoại Bắc Âu và địa lý địa phương: kể, viết, vẽ bản đồ; nhận diện giá trị lòng dũng cảm."
  - "Phân số: so sánh, cộng–trừ phân số cùng mẫu và khác mẫu đơn giản; tỉ lệ đầu tiên."
  - "Tiếng Anh viết ra: viết đoạn văn 4–6 câu kể chuyện, tả cảnh, tường thuật sự kiện."
  - "Chủ động trình bày trước lớp: thể hiện ý kiến, đặt câu hỏi."
weeksTotal: 36
festivalWeeks: 4
blocks:
  - subject: Ngôn ngữ & thần thoại
    weeks: 5
    topic: Thần thoại Bắc Âu — chinh phục cái lớn
    examStatus: waldorf-only
    goals:
      - "Kể, viết và phân tích thần thoại Bắc Âu; nhận diện xung đột và giá trị."
      - "Viết đoạn văn miêu tả, tường thuật có bố cục."
    activities:
      - "Kịch hoá thần thoại Thor, Odin; vẽ tranh tường nhân vật."
      - "Viết 'saga mini' của riêng mình trong sổ thần thoại."
    skills:
      - Viết tường thuật
      - Phân tích nhân vật
      - Trí tưởng tượng
    development: "Thần thoại Bắc Âu 'nói' trực tiếp với lòng dũng cảm của trẻ đang lớn — và là tư liệu văn học giàu hình ảnh cho kỹ năng đọc hiểu."
  - subject: Toán — Phân số
    weeks: 5
    topic: Phân số — cánh cửa đầu tiên vào 'toán thật'
    examStatus: waldorf-only
    goals:
      - "So sánh, cộng–trừ phân số cùng mẫu; khái niệm phân số bằng nhau."
      - "Dùng phân số trong chia bánh, chia đất, chia trách nhiệm."
    activities:
      - "Cắt bánh, giấy, đoạn dây thành phần bằng nhau; trò chơi phân số."
      - "Vẽ 'bánh xe phân số' và biểu đồ phần ăn gia đình."
    skills:
      - Khái niệm phân số
      - So sánh
      - Giải bài toán lời
    development: "Phân số là bước 'trừu tượng hoá' đầu tiên của số — tuổi 9–10 sẵn sàng chính xác; nền trực tiếp cho Đại số và phần số của Cambridge."
  - subject: Địa lý địa phương
    weeks: 4
    topic: Quê hương em — bản đồ, sông núi, giao thông
    examStatus: waldorf-only
    goals:
      - "Vẽ bản đồ trường, bản đồ xã; hiểu sông–núi–đường và ảnh hưởng lên đời sống."
    activities:
      - "Điền dã quanh khu phố/xã, vẽ bản đồ và sơ đồ giao thông."
      - "Tìm hiểu nghề đặc trưng của vùng mình qua người dân."
    skills:
      - Bản đồ
      - Thực địa
      - Địa lý địa phương
    development: "Địa lý địa phương neo trẻ vào 'góc thế giới của mình' — nền của tư duy bản đồ, tỉ lệ và địa lý học thuật sau này."
  - subject: Lịch sử & văn hoá
    weeks: 3
    topic: Lịch sử địa phương — trường làng, dòng họ, ký ức
    examStatus: waldorf-only
    goals:
      - "Hỏi chuyện người lớn tuổi, đọc ký ức địa phương để hiểu quá khứ."
    activities:
      - "Làm 'bài phỏng vấn' ông bà, nghệ nhân; dựng dòng thời gian ngôi trường."
      - "Viết nhật ký 'người chứng kiến' cho một sự kiện địa phương."
    skills:
      - Phỏng vấn
      - Dòng thời gian
      - Tường thuật lịch sử
    development: "Lịch sử địa phương giúp trẻ thấy 'mình thuộc về dòng chảy' — nền tảng cảm xúc cho môn Sử học thuật và Kinh tế."
  - subject: Tiếng Anh viết
    weeks: 4
    topic: Viết đoạn văn kể chuyện & tả cảnh đầu tiên
    examStatus: waldorf-only
    goals:
      - "Viết đoạn 4–6 câu: kể chuyện đã đọc, tả cảnh, tường thuật sự kiện."
      - "Dùng từ nối then/so/but; kiểm tra lại (self-check) bài viết."
    activities:
      - "Viết 'commentary' cho tranh, kể truyện tranh bằng câu tiếng Anh."
      - "Sổ 'Writing Journal' mỗi tuần một bài ngắn."
    skills:
      - Viết đoạn
      - Từ nối
      - Tự sửa bài viết
    development: "Viết ra là bước nhảy lớn nhất của ngôn ngữ thứ hai thời điểm này — nền của Paper 1 IGCSE 0500 chín năm sau."
  - subject: Sinh học & động vật
    weeks: 4
    topic: Con người & loài vật — vì sao cơ thể vận hành
    examStatus: waldorf-only
    goals:
      - "So sánh cơ thể người và động vật; hiểu vai trò các cơ quan."
    activities:
      - "Vẽ 'bản đồ cơ thể', mô hình hệ cơ quan; quan sát động vật thật."
      - "Thực hành chăm sóc vật nuôi trong trường."
    skills:
      - Sinh học con người
      - So sánh
      - Mô hình
    development: "Tuổi 9–10 hiểu 'con người là ai trong thế giới động vật' — mở đường Sinh học chi tiết và Hóa hữu cơ sau này."
  - subject: Ngữ pháp & chính tả nâng cao
    weeks: 3
    topic: Câu phức, dấu câu & từ loại
    examStatus: waldorf-only
    goals:
      - "Nhận diện danh–động–tính–trạng từ; dựng câu phức mở rộng."
    activities:
      - "Trò chơi 'ngôi nhà từ loại', viết đoạn giàu tính từ."
      - "Đọc–sửa bài của bạn (peer editing) nhẹ nhàng."
    skills:
      - Từ loại
      - Câu phức
      - Sửa bài
    development: "Ngữ pháp 'nhìn ra cấu trúc' trùng khoảnh khắc trẻ bắt đầu khủng hoảng Thần thoại — tư duy phân tích cất cánh."
  - subject: Nghệ thuật & thủ công
    weeks: 4
    topic: Thêu thùa, đan lát & kịch thần thoại
    examStatus: waldorf-only
    goals:
      - "Hoàn thiện sản phẩm nghệ thuật cá nhân: thêu, đan, gốm."
    activities:
      - "Thêu chữ thập, đan len, làm búp bê/marionette."
      - "Chuẩn bị đạo cụ cho vở kịch thần thoại."
    skills:
      - Khéo tay
      - Kiên nhẫn
      - Thẩm mỹ
    development: "Nghệ thuật nuôi cảm nhận thẩm mỹ và kiên nhẫn hoàn thành — 'món nợ nghệ thuật' của tuổi học thuật."
  - subject: Đọc & văn học
    weeks: 4
    topic: Chuyện dũng cảm qua các nền văn hoá
    examStatus: waldorf-only
    goals:
      - "Đọc hiểu và so sánh truyện dũng cảm Việt Nam–thế giới."
    activities:
      - "Đọc truyện dân gian Việt, truyện dũng cảm các nước; thảo luận."
      - "Viết 'phiếu nhân vật' và dựng kịch đọc."
    skills:
      - Đọc hiểu
      - So sánh văn hoá
      - Thảo luận
    development: "Văn học đa văn hoá mở tầm và nuôi đồng cảm — mạch ngầm của văn chương và tiếng Anh học thuật."
weeklyContinuous:
  - subject: Tiếng Anh (Cambridge)
    periodsPerWeek: 4
    focus: "Writing Journal, viết đoạn, kể chuyện — tiến tới B1, mạch IGCSE 0500"
  - subject: Toán
    periodsPerWeek: 2
    focus: "Phân số, đơn vị đo, toán lời — vốn nền 0580"
  - subject: Âm nhạc & hát
    periodsPerWeek: 2
    focus: "Hát bè, đàn, vần điệu; kịch thần thoại"
  - subject: Hội hoạ & thủ công
    periodsPerWeek: 2
    focus: "Màu nước, thêu, đan lát"
  - subject: Thể dục & eurythmy
    periodsPerWeek: 2
    focus: "Trò chơi vận động, thể thao; eurythmy"
research:
  - claim: "Truyện thần thoại và truyện sử thi hỗ trợ phát triển lý luận đạo đức và trí tưởng tượng — trẻ phân tích nhân vật để xây giá trị, phù hợp cách lớp 4 dùng thần thoại Bắc Âu."
    source: "Narvaez D. Journal of Moral Education, 30(2):157–166, 2001."
  - claim: "Thao tác trên vật thể (vẽ, đo, chia) hỗ trợ hiểu khái niệm phân số ở tiểu học; học bằng tay kết hợp hình ảnh cải thiện kết quả toán."
    source: "Siegler RS, et al. Developmental Psychology, 47(5):1254–1268, 2011."
```


## Chi tiết chương trình

**Lớp 4 là năm lòng dũng cảm.** Thần thoại Bắc Âu — Thor, Odin, Loki — cho trẻ 9–10 tuổi những hình ảnh
lớn của dũng cảm, mưu trí và hậu quả, giữa lúc đứa trẻ đang 'lớn nhanh' cần kiểu dũng cảm của riêng mình.
Cùng lúc, phân số mở cánh cửa toán thật, và địa lý–lịch sử địa phương neo đứa trẻ vào gốc rễ.

**Tiếng Anh chuyển sang 'viết ra'.** Từ câu chuyện được kể, lớp 4 lần đầu viết đoạn: kể lại truyện đã đọc,
tả cảnh, tường thuật sự kiện, ghi Writing Journal mỗi tuần. Đây là 'bước nhảy công khai' của ngôn ngữ thứ
hai — từ tư duy miệng sang tư duy chữ, đặt nền cho bài thi viết của IGCSE 0500 chín năm sau.

**Nhịp 40 tuần.** Năm lớp 4 chạy khoảng 40 tuần — 36 tuần học + 4 tuần lễ hội tách biệt. Các khối thần
thoại, phân số, địa lý–lịch sử địa phương chiếm buổi sáng; tiếng Anh, âm nhạc, hội hoạ–thủ công, thể
dục–eurythmy và kịch chạy đều cả năm như hơi thở của một 'cơ thể lớn dần'.

<a id="nguon-05"></a>

## Lớp 5

Nguồn: `resources/content/alevel/alevel-lop-5.md`  
SHA-256: `80daa75bd5cca3f2e03dd5dd7bdf0536453e38df4ba21b337052a2142b967ecc`

```yaml
id: alevel-lop-5
year: 5
title: "Tuyến A-Level · Lớp 5"
age: 10–11 tuổi
phase: primary-5
color: "#3e7f6b"
motto: "Ấn Độ, Ba Tư, Hy Lạp — văn minh cổ đại gặp số thập phân; tiếng Anh trở thành 'công cụ': tóm tắt, trình bày và phỏng vấn."
overview: "Lớp 5 là 'năm vàng' của tuổi thơ ấu: cơ thể cân đối, trí óc hài hoà, trẻ sẵn sàng khám phá văn minh nhân loại — từ Ấn Độ, Ba Tư đến Hy Lạp. Số thập phân và tỉ lệ mở cánh cửa toán học thuật, thực vật học đưa trẻ ra vườn, và tiếng Anh trở thành công cụ: tóm tắt, trình bày, phỏng vấn — chuẩn bị cho khối lượng học thuật sắp tới."
milestones:
  - "Kể và viết về các nền văn minh cổ đại; nối dòng lịch sử từ Ấn Độ–Ba Tư–Hy Lạp."
  - "Số thập phân, tỉ lệ, phần trăm đơn giản; giải bài toán nhiều bước."
  - "Tiếng Anh công cụ: tóm tắt bài, trình bày nhỏ, phỏng vấn và viết đoạn có óc tổ chức."
  - "Hoàn thành khoá thực địa thiên nhiên và nghiên cứu thực vật chuyên sâu."
weeksTotal: 36
festivalWeeks: 4
blocks:
  - subject: Văn minh cổ đại
    weeks: 5
    topic: Ấn Độ, Ba Tư, Hy Lạp — con đường của nhân loại
    examStatus: waldorf-only
    goals:
      - "Kể chuyện văn minh Ấn, Ba Tư, Hy Lạp; hiểu tư tưởng và thành tựu chính."
      - "Đọc–viết bài tóm tắt, dựng dòng thời gian."
    activities:
      - "Dựng mô hình, vẽ tranh văn minh; kịch hoá thần thoại Hy Lạp."
      - "Viết 'nhật ký du hành' qua các nền văn minh."
    skills:
      - Văn minh cổ đại
      - Dòng thời gian
      - Viết tổng hợp
    development: "Văn minh cổ đại cho trẻ 10–11 'bản đồ của quá khứ' — tư duy lịch sử không còn vụn vặt, nền cho Sử học thuật."
  - subject: Toán — Số thập phân
    weeks: 4
    topic: Số thập phân, tỉ lệ & phần trăm
    examStatus: waldorf-only
    goals:
      - "Số thập phân: đọc, viết, so sánh, cộng–trừ–nhân–chia."
      - "Tỉ lệ và phần trăm trong đời sống: chiết khấu, thống kê lớp học."
    activities:
      - "Trò chơi 'siêu thị': tính tiền, chiết khấu, hoá đơn."
      - "Lập bảng thống kê và biểu đồ kết quả khảo sát lớp."
    skills:
      - Số thập phân
      - Tỉ lệ–phần trăm
      - Biểu đồ
    development: "Số thập phân là 'toán học thuật' đầu tiên — chuẩn bị trực tiếp cho phần số và đại số của Cambridge 0580."
  - subject: Thực vật học
    weeks: 4
    topic: Từ rễ đến hoa — nghiên cứu thực vật trọn đời
    examStatus: waldorf-only
    goals:
      - "Nhận diện và mô tả rễ, thân, lá, hoa; vòng đời thực vật."
      - "So sánh các nhóm thực vật; thu thập và ép tiêu bản."
    activities:
      - "Khảo sát vườn trường; dựng 'phòng tiêu bản' cá nhân."
      - "Trồng và theo dõi một loài cây từ hạt đến hoa."
    skills:
      - Thực vật học
      - Quan sát
      - Tiêu bản
    development: "Thực vật học là 'khoa học trọn vẹn' đầu tiên — quan sát có phương pháp, nền cho Sinh học chi tiết sau này."
  - subject: Địa lý — từ bản địa ra thế giới
    weeks: 3
    topic: Việt Nam và các châu lục
    examStatus: waldorf-only
    goals:
      - "Bản đồ Việt Nam; các châu lục, đại dương, khí hậu cơ bản."
    activities:
      - "Vẽ bản đồ tay, xếp bản đồ Việt Nam; khảo sát địa lý địa phương."
      - "So sánh đời sống người Việt với vài quốc gia khác."
    skills:
      - Bản đồ
      - Địa lý thế giới
      - So sánh văn hoá
    development: "Địa lý 'mở ra thế giới' đồng thời neo lại Việt Nam — nền của Địa lý và Kinh tế quốc tế sau này."
  - subject: Hình học tự do
    weeks: 3
    topic: Hình học vẽ tay — vòng, xoắn, đa giác
    examStatus: waldorf-only
    goals:
      - "Vẽ chính xác đường tròn, xoắn, đa giác đều bằng compa, thước."
      - "Cảm thụ tỉ lệ vàng và vẻ đẹp của cấu trúc."
    activities:
      - "Vẽ 'bông hoa hình học', lưới xoắn; trang trí theo tỉ lệ."
      - "Nối hình học với thực vật, công trình kiến trúc."
    skills:
      - Hình học vẽ
      - Compa–thước
      - Cảm thụ tỉ lệ
    development: "Hình học tự do rèn trực giác không gian và tỉ lệ — nền của Hình học và Đồ thị trong Cambridge."
  - subject: Tiếng Anh công cụ
    weeks: 4
    topic: Tóm tắt, trình bày & phỏng vấn
    examStatus: waldorf-only
    goals:
      - "Tóm tắt một bài đọc bằng 3–5 câu tiếng Anh; trình bày nhỏ trước lớp."
      - "Hỏi–đáp phỏng vấn: thu thập và sắp xếp thông tin."
    activities:
      - "Mini-presentation: giới thiệu một nền văn minh bằng tiếng Anh."
      - "Phỏng vấn phụ huynh/thầy cô, viết tóm tắt bài phỏng vấn."
    skills:
      - Tóm tắt
      - Thuyết trình
      - Tổ chức thông tin
    development: "Tiếng Anh thành 'công cụ' — biết tóm tắt, trình bày, tổ chức ý — đúng chuẩn mạch Paper của IGCSE 0500."
  - subject: Ngữ pháp & viết có óc tổ chức
    weeks: 3
    topic: Đoạn văn có chủ đề, luận điểm đi kèm
    examStatus: waldorf-only
    goals:
      - "Viết đoạn có topic sentence, chi tiết hỗ trợ, kết đoạn."
    activities:
      - "Viết 'văn bản tổ chức' cho truyện, bài tường thuật."
      - "Thực hành outline trước khi viết; sửa bài theo nhóm."
    skills:
      - Cấu trúc đoạn
      - Tổ chức ý
      - Sửa bài
    development: "Cấu trúc đoạn văn là 'khuôn' của mọi bài thi viết — dạy sớm, đúng lúc, thành thói quen."
  - subject: Số học & tỉ lệ nâng cao
    weeks: 3
    topic: Bài toán nhiều bước & vận tốc đầu tiên
    examStatus: waldorf-only
    goals:
      - "Giải bài toán nhiều bước bằng nhiều chiến lược."
      - "Khái niệm vận tốc, quãng đường, thời gian."
    activities:
      - "Toán 'chợ lớn': ngân sách, chiết khấu, lãi đơn giản."
      - "Thí nghiệm vận tốc: đo xe đồ chơi, xe đạp."
    skills:
      - Giải toán nhiều bước
      - Vận tốc
      - Dự toán
    development: "Bài toán nhiều bước rèn tư duy hợp thành — chuẩn bị cho đại số và mô hình hoá IGCSE."
  - subject: Thực địa & dự án cuối năm
    weeks: 4
    topic: Khoá thực địa thiên nhiên & nghiên cứu cá nhân
    examStatus: waldorf-only
    goals:
      - "Học bằng trải nghiệm một chủ đề thiên nhiên/lịch sử trọn đời."
    activities:
      - "Chuyến thực địa 2–3 ngày: quan sát, thu thập, viết nhật ký."
      - "Dự án cá nhân: một 'triển lãm' ghép thực vật–địa lý–viết."
    skills:
      - Thực địa
      - Dự án cá nhân
      - Trình bày
    development: "Thực địa và dự án cho trẻ 10–11 'mùa gặt' tuổi thơ — kỹ năng tổ chức, trình bày, tự quản dự án đầu tiên."
  - subject: Văn nghệ & lễ hội
    weeks: 3
    topic: Olympia minitatur — kịch & hội làng cổ đại
    examStatus: waldorf-only
    goals:
      - "Dựng kịch/quảng trường về văn minh cổ đại; tổ chức lễ hội cuối năm."
    activities:
      - "Olympia nhỏ của lớp: chạy, ném, đấu vật theo nghi thức Hy Lạp."
      - "Trình diễn văn nghệ tổng hợp, lồng tiếng Anh."
    skills:
      - Văn hoá
      - Thi đấu lành mạnh
      - Tổ chức sự kiện
    development: "Lễ hội văn minh cổ đại 'sống lại' kiến thức — và cho trẻ cảm giác hoàn thành một năm vàng của tuổi thơ."
weeklyContinuous:
  - subject: Tiếng Anh (Cambridge)
    periodsPerWeek: 4
    focus: "Tóm tắt, trình bày, phỏng vấn, viết có cấu trúc — vững B1, mạch IGCSE 0500"
  - subject: Toán
    periodsPerWeek: 2
    focus: "Số thập phân, tỉ lệ, phần trăm, toán lời — vốn nền 0580"
  - subject: Âm nhạc & hát
    periodsPerWeek: 2
    focus: "Hát bè, đàn; nhạc Hy Lạp cổ đại"
  - subject: Hội hoạ & thủ công
    periodsPerWeek: 2
    focus: "Màu nước, điêu khắc, vẽ hình học"
  - subject: Thể dục & eurythmy
    periodsPerWeek: 2
    focus: "Thể thao, trò chơi; eurythmy"
research:
  - claim: "Trình bày và tóm tắt rèn kỹ năng tổ chức ý và ngôn ngữ học đường (academic language) — nền của thành công viết học thuật và kỳ thi."
    source: "Francis DJ, et al. Review of Educational Research, 76(3):379–413, 2006."
  - claim: "Trải nghiệm thực địa và dự án cá nhân cải thiện động lực và kết quả học — học qua trải nghiệm giúp tri thức gắn kết với ý nghĩa."
    source: "Kuh GD. In: High-Impact Educational Practices. AAC&U, 2008."
```


## Chi tiết chương trình

**Lớp 5 là 'năm vàng' — văn minh cổ đại làm sáng tỏ nhân loại.** Từ Ấn Độ, Ba Tư đến Hy Lạp, trẻ 10–11
tuổi lần đầu nhìn thấy con đường lớn của nhân loại như một bản đồ có văn minh, có anh hùng, có tư tưởng.
Đây là đỉnh cao của 'tuổi thơ ấu hài hoà' — cơ thể cân đối, trí óc tỉnh táo, tự tin — thời điểm vàng để
mở rộng chân trời lịch sử và văn hoá.

**Tiếng Anh trở thành 'công cụ', không còn là 'môn chơi'.** Lớp 5 lần đầu tóm tắt bài, trình bày nhỏ,
phỏng vấn và viết đoạn có óc tổ chức. Cùng với số thập phân và tỉ lệ, đây là mùa 'cởi cánh' cho khối học
thuật sắp tới — nhưng vẫn nằm trong nhịp khám phá, không phải nhồi nhét.

**Nhịp 40 tuần.** Năm lớp 5 chạy khoảng 40 tuần — 36 tuần học + 4 tuần lễ hội tách biệt. Các khối văn
minh, số thập phân, thực vật học chiếm buổi sáng; tiếng Anh, âm nhạc, hội hoạ–thủ công, thể dục–eurythmy
và kịch chạy đều cả năm như hơi thở — trẻ luôn có đủ vận động, nghệ thuật và câu chuyện trước khi bước
vào tuổi mười hai.

<a id="nguon-06"></a>

## Lớp 6

Nguồn: `resources/content/alevel/alevel-lop-6.md`  
SHA-256: `46f1f59c914e1afcc67c3ee4604b6ee220ca767344534e41a952f6422c6f0b48`

```yaml
id: alevel-lop-6
year: 6
title: "Tuyến A-Level · Lớp 6"
age: 11–12 tuổi
phase: primary-6
color: "#2f6f9f"
motto: "La Mã và Trung cổ, vật lý và thiên văn — tiếng Anh 'miền tên miền': đại số, địa lý, khoa học; bước vào tuổi mới lớn bằng lý luận."
overview: "Lớp 6 là 'ngưỡng cửa' của tuổi mới lớn: người học 11–12 tuổi bắt đầu tư duy nhân quả, thích lý luận, khao khát trật tự. Chương trình đón bằng La Mã–Trung cổ (luật, kiến trúc, nhà nước), vật lý âm thanh–ánh sáng–nhiệt, thiên văn, hình học và toán thương mại; tiếng Anh bước vào 'miền học thuật sơ khởi' — báo cáo, bài luận, thuật ngữ — để sẵn sàng cho IGCSE khi bước vào các lớp sau."
milestones:
  - "La Mã–Trung cổ: luật, kiến trúc, nhà nước; kể–viết và lý luận về 'trật tự xã hội'."
  - "Vật lý nhập môn: âm thanh, ánh sáng, nhiệt qua thực hành; thiên văn quan sát."
  - "Hình học và toán thương mại: chu vi, diện tích, phần trăm, lãi suất, ngân sách."
  - "Tiếng Anh học thuật sơ khởi: báo cáo ngắn, bài luận, thuật ngữ khoa học–địa lý."
weeksTotal: 36
festivalWeeks: 4
blocks:
  - subject: Lịch sử — La Mã & Trung cổ
    weeks: 5
    topic: Từ luật La Mã đến thành thị Trung cổ
    examStatus: waldorf-only
    goals:
      - "Hiểu nhà nước La Mã, luật, kiến trúc, đường xá; sự chuyển giao Trung cổ."
      - "Lý luận về 'trật tự xã hội' — vì sao người thành lập luật."
    activities:
      - "Dựng mô hình cầu dẫn, đấu trường, thành thị; kịch hoá phiên toà La Mã."
      - "Viết bài luận nhỏ: 'Luật để làm gì?'."
    skills:
      - Lịch sử La Mã–Trung cổ
      - Lý luận xã hội
      - Viết luận
    development: "Ở 11–12 tuổi trẻ bắt đầu muốn 'vì sao' — luật và trật tự xã hội là chủ đề vàng, nền của Kinh tế và Lịch sử hiện đại."
  - subject: Vật lý nhập môn
    weeks: 4
    topic: Âm thanh, ánh sáng, nhiệt — vật lý qua hiện tượng
    examStatus: waldorf-only
    goals:
      - "Quan sát và giải thích âm thanh, ánh sáng, nhiệt bằng thí nghiệm đơn giản."
      - "Ghi chép, đo lường theo trình tự khoa học."
    activities:
      - "Thí nghiệm đàn, cốc, gương parabol, phổ màu qua lăng kính."
      - "Vẽ sổ thí nghiệm có sơ đồ, số liệu, kết luận."
    skills:
      - Thí nghiệm
      - Quan sát định lượng
      - Ghi chép khoa học
    development: "Vật lý bắt đầu bằng hiện tượng có thể 'sờ' — nền tảng tự tin cho Vật lý IGCSE 0625 và hóa học sau."
  - subject: Thiên văn
    weeks: 3
    topic: Galileo và bầu trời — quan sát nhật–nguyệt–tinh tú
    examStatus: waldorf-only
    goals:
      - "Quan sát mặt trời, mặt trăng, chòm sao và chuyển động biểu kiến."
      - "Hiểu bước ngoặt Copernicus–Galileo trong lịch sử khoa học."
    activities:
      - "Sổ quan sát sao mỗi tuần; mô hình nhật tâm của lớp."
      - "Trình bày tiểu sử Galileo như câu chuyện dũng cảm trí tuệ."
    skills:
      - Quan sát
      - Lịch sử khoa học
      - Mô hình hoá
    development: "Thiên văn dạy 'thay đổi điểm nhìn' — kỹ năng tư duy hệ quy chiếu cần cho đại số và vật lý."
  - subject: Hình học — đo lường không gian
    weeks: 4
    topic: Chu vi, diện tích, thể tích & tỉ lệ vàng
    examStatus: waldorf-only
    goals:
      - "Tính chu vi, diện tích, thể tích hình quen thuộc; dùng trong thực tế."
      - "Cảm thụ tỉ lệ vàng trong kiến trúc La Mã–Trung cổ."
    activities:
      - "Đo sân trường, vẽ sơ đồ quy hoạch; mô hình nhà theo tỉ lệ."
      - "Nghiên cứu tỉ lệ vàng trong công trình cổ."
    skills:
      - Đo lường không gian
      - Hình học
      - Tỉ lệ
    development: "Hình học ứng dụng là 'toán của kiến trúc' — chuẩn bị trực tiếp cho Hình học Cambridge 0580."
  - subject: Toán thương mại
    weeks: 3
    topic: Phần trăm, lãi suất, ngân sách & kinh doanh nhỏ
    examStatus: waldorf-only
    goals:
      - "Phần trăm, chiết khấu, lãi suất, tỉ giá trong tình huống thật."
      - "Lập ngân sách và chạy một 'doanh nghiệp nhỏ' của lớp."
    activities:
      - "Chợ/doanh nghiệp lớp: sản xuất, bán, tính lời lỗ."
      - "Phân tích tỉ giá, chi phí chuyến thực địa."
    skills:
      - Phần trăm
      - Lãi suất
      - Quản trị kinh doanh nhỏ
    development: "Toán thương mại cho trẻ 11–12 'sờ tiền' — mạch ngầm của Kinh tế học, và nền đại số tự tin."
  - subject: Sinh học — thực vật & động vật đối sánh
    weeks: 3
    topic: Từ một tế bào đến cơ thể — con người trong tự nhiên
    examStatus: waldorf-only
    goals:
      - "So sánh cấu trúc thực vật–động vật; hiểu vai trò trao đổi chất."
    activities:
      - "Quan sát tế bào qua kính hiển vi, vẽ sơ đồ hệ cơ quan."
      - "Nghiên cứu một loài trọn đời và trình bày."
    skills:
      - Sinh học nền
      - Kính hiển vi
      - Trình bày
    development: "Sinh học đối sánh đánh thức câu hỏi 'con người là ai' — bước vào tuổi mới lớn với lòng tự trọng của cơ thể."
  - subject: Ngôn ngữ & viết học thuật
    weeks: 3
    topic: Báo cáo, bài luận & lý luận có dẫn chứng
    examStatus: waldorf-only
    goals:
      - "Viết báo cáo ngắn có cấu trúc và bài luận có luận điểm."
      - "Lý luận có dẫn chứng — mạch của mọi môn."
    activities:
      - "Viết báo cáo từ thí nghiệm, bài luận tranh luận nhẹ."
      - "Thực hành phản biện tôn trọng (debate lớp)."
    skills:
      - Viết báo cáo
      - Lý luận
      - Tranh biện
    development: "Viết học thuật sơ khởi đúng ngưỡng tuổi mới lớn — người 11–12 tuổi bắt đầu 'nghĩ bằng chữ', nền cho IGCSE."
  - subject: Tiếng Anh học thuật
    weeks: 4
    topic: Báo cáo, thuật ngữ và bài luận đầu tiên bằng tiếng Anh
    examStatus: waldorf-only
    goals:
      - "Viết đoạn–bài bằng tiếng Anh có cấu trúc, dùng thuật ngữ khoa học."
      - "Trình bày một chủ đề khoa học–lịch sử bằng tiếng Anh."
    activities:
      - "Mini-report khoa học, poster presentation song ngữ."
      - "Đọc và tóm tắt văn bản tiếng Anh về La Mã, vật lý."
    skills:
      - Viết học thuật
      - Thuật ngữ khoa học
      - Trình bày
    development: "Tiếng Anh 'học thuật' chính là nấc thang lên IGCSE — thuật ngữ, cấu trúc, báo cáo — nhưng vẫn qua chủ đề Waldorf gần gũi."
  - subject: Nghệ thuật & thủ công
    weeks: 4
    topic: Mosaic, điêu khắc gỗ & kiến trúc vẽ
    examStatus: waldorf-only
    goals:
      - "Làm mosaic, khắc gỗ, vẽ phối cảnh sơ khai."
    activities:
      - "Mosaic đồng tiền/hoa văn La Mã; khắc gỗ thành sản phẩm."
      - "Vẽ phối cảnh công trình cổ."
    skills:
      - Mosaic
      - Điêu khắc
      - Phối cảnh
    development: "Nghệ thuật nuôi cảm nhận trật tự và thẩm mỹ — phản chiếu chủ đề La Mã–Trung cổ; và giữ 'bộ đệm nghệ thuật' trước tuổi học thuật."
  - subject: Văn nghệ & lễ hội
    weeks: 3
    topic: Kịch La Mã–Trung cổ & hội làng cuối năm
    examStatus: waldorf-only
    goals:
      - "Dựng vở kịch và tổ chức lễ hội tổng kết năm học."
    activities:
      - "Kịch lịch sử (toà án dân chủ, hội chợ Trung cổ), lồng tiếng Anh."
      - "Trình diễn văn nghệ, thể thao tổng kết."
    skills:
      - Kịch lịch sử
      - Tổ chức
      - Biểu diễn
    development: "Lễ hội tổng kết 'đóng một chương' tuổi thơ ấu — trẻ bước vào tuổi mới lớn có mốc, có niềm tự hào."
weeklyContinuous:
  - subject: Tiếng Anh (Cambridge)
    periodsPerWeek: 4
    focus: "Báo cáo, thuật ngữ, bài luận ngắn, trình bày — vững B1–B2, mạch IGCSE 0500"
  - subject: Toán
    periodsPerWeek: 2
    focus: "Hình học, phần trăm, toán thương mại — vốn nền 0580"
  - subject: Âm nhạc & hát
    periodsPerWeek: 2
    focus: "Hát bè, đàn; nhạc La Mã–Trung cổ"
  - subject: Hội hoạ & thủ công
    periodsPerWeek: 2
    focus: "Mosaic, khắc gỗ, phối cảnh"
  - subject: Thể dục & eurythmy
    periodsPerWeek: 2
    focus: "Thể thao, trò chơi, vũ điệu; eurythmy"
research:
  - claim: "Sự phát triển của lý luận nhân quả ở trẻ 11–12 tuổi khiến đây là thời điểm sinh học thích hợp để mở môn Vật lý và Lịch sử 'vì sao' — đúng cách Waldorf đưa khoa học hiện tượng vào lớp 6."
    source: "Kuhn D. Development of Logical Reasoning. In: Handbook of Child Psychology. Wiley, 2013."
  - claim: "Học qua thiết thực và dự án (doanh nghiệp nhỏ, đo đạc, ngân sách) gắn toán với ý nghĩa, cải thiện kết quả và thái độ học — chuẩn bị tốt cho toán IGCSE."
    source: "Fuchs LS, et al. Journal of Educational Psychology, 105(4):932–945, 2013."
```


## Chi tiết chương trình

**Lớp 6 là 'ngưỡng cửa' của tuổi mới lớn.** Người học 11–12 tuổi không còn chấp nhận 'chuyện kể' một
chiều — các em hỏi vì sao, muốn lý luận, khao khát trật tự. La Mã và Trung cổ đem luật, kiến trúc, nhà
nước; vật lý và thiên văn đem hiện tượng đầu tiên của nhân quả; hình học và toán thương mại đem 'sờ' được
không gian và tiền. Đây là năm trí tuệ 'thức dậy' đúng nhịp phát triển.

**Tiếng Anh bước vào 'miền học thuật sơ khởi'.** Từ công cụ giao tiếp, lớp 6 thêm: báo cáo ngắn, bài luận,
thuật ngữ khoa học–địa lý, trình bày poster — ngôn ngữ của khối học thuật đang đến gần. Nhưng mọi thứ vẫn
xuất phát từ chủ đề Waldorf (đo đạc đấu trường La Mã, quan sát sao, thí nghiệm âm thanh), giữ cho ngôn ngữ
đầy đặn và thật.

**Nhịp 40 tuần.** Năm lớp 6 chạy khoảng 40 tuần — 36 tuần học + 4 tuần lễ hội tách biệt. Các khối La
Mã–Trung cổ, vật lý, thiên văn, hình học và toán thương mại chiếm buổi sáng; tiếng Anh, âm nhạc, hội
hoạ–thủ công, thể dục–eurythmy và kịch chạy đều cả năm — bảo vệ nhịp thở của 'nghệ sĩ đang đổi thay'
trước khi bước vào tuyến IGCSE chính thức.

<a id="nguon-07"></a>

## Lớp 7

Nguồn: `resources/content/alevel/alevel-lop-7.md`  
SHA-256: `7b7c33874e7efaa840fc74d94d9a43e3a41df8cb9319203d006483520b2c0e86`

```yaml
id: alevel-lop-7
year: 7
title: "Tuyến A-Level · Lớp 7"
age: 12–13 tuổi
phase: foundation
color: "#5a6e9e"
motto: "Bước vào vòng xoáy dậy thì — năm khởi động: thói quen, bầu trời và những cỗ máy đơn giản."
overview: "Lớp 7 của tuyến A-Level vẫn giữ trọn hơi thở Waldorf: khối bài học chính về cơ học, nhiệt, thiên văn, địa lý và lịch sử khai phá — nhưng được thiết kế để gieo những 'mạch nền' cho kỳ thi Cambridge phía trước. Người học 12–13 tuổi mới bước vào dậy thì: trí óc trừu tượng hé mở, cơ thể thay đổi, và các môn học trải nghiệm hiện tượng cần một nhịp tuần đủ đều để dần hình thành kỷ luật học tập tự giác."
milestones:
  - "Thành thạo phương trình một ẩn, tỉ lệ và đại lượng tỉ lệ — nền tảng của Đại số IGCSE."
  - "Làm quen tiếng Anh thi tuyển: đọc hiểu, viết đoạn, phát âm ở mức B1–B2 theo khung CEFR."
  - "Ghi chép thí nghiệm có phương pháp: giả thuyết, số liệu, đo lường, kết luận."
  - "Hoàn thành đồ thị, bản đồ và sổ quan sát thiên văn — tặng phẩm của 'năm bầu trời'."
weeksTotal: 36
festivalWeeks: 4
blocks:
  - subject: Vật lý
    weeks: 4
    topic: Cơ học hiện tượng — nhiệt, ánh sáng & máy đơn giản
    examStatus: waldorf-only
    goals:
      - "Quan sát nhiệt lan tỏa, ánh sáng khúc xạ, đòn bẩy và ròng rọc qua thí nghiệm."
      - "Nhận diện những 'cổ máy' đầu tiên của con người trong nhà và ngoài đồng."
    activities:
      - "Thí nghiệm truyền nhiệt bằng nến, kim loại và sáp."
      - "Dựng mô hình bập bênh, xe đạp và cầu kéo bằng máy đơn giản."
    skills:
      - Quan sát
      - Thí nghiệm
      - Mô hình hoá
    development: "Ở 12–13 tuổi, cơ học nên đến qua hiện tượng trước lý thuyết: đòn bẩy 'mọc ra' từ bập bênh, không phải từ công thức."
  - subject: Thiên văn
    weeks: 3
    topic: Bầu trời đêm & nhịp chuyển động của các thiên thể
    examStatus: waldorf-only
    goals:
      - "Theo dõi chòm sao, mặt trăng và sự thay đổi theo mùa."
      - "Hiểu mô hình Nhật tâm như bước ngoặt của tư duy khoa học."
    activities:
      - "Sổ quan sát sao mỗi tuần, vẽ bản đồ bầu trời."
      - "Trình diễn mô hình chuyển động Trái Đất – Mặt Trời – Mặt Trăng."
    skills:
      - Quan sát
      - Bản đồ
      - Tư duy hệ quy chiếu
    development: "Thiên văn là môn 'thay đổi điểm nhìn' kinh điển ở tuổi này — chuẩn bị cho lối suy luận trừu tượng của đại số và vật lý sau này."
  - subject: Địa lý
    weeks: 4
    topic: Trái Đất các châu lục — văn hoá, tài nguyên & thương mại
    examStatus: waldorf-only
    goals:
      - "Bản đồ thế giới: địa hình, khí hậu, tài nguyên từng châu lục."
      - "Kết nối địa lý với dòng chảy thương mại — mạch ngầm của Kinh tế học sau này."
    activities:
      - "Vẽ bản đồ các tuyến gia vị, tơ lụa và hương liệu."
      - "Khảo sát các vùng kinh tế Việt Nam qua bản đồ."
    skills:
      - Bản đồ
      - Kiến thức thế giới
      - Liên hệ thực tế
    development: "Địa lý gieo hạt cho tư duy hệ thống của kinh tế và lịch sử — tuổi 12–13 rất 'đói' thế giới."
  - subject: Lịch sử & Văn học
    weeks: 4
    topic: Thời Phục hưng & các cuộc khám phá thế giới
    examStatus: waldorf-only
    goals:
      - "Phục hưng, máy in, hành trình Columbus và các nhà hàng hải Đông Á."
      - "Đọc hồi ký du hành, viết nhật ký 'người khám phá'."
    activities:
      - "Đóng vai một nhà khám phá: chuẩn bị, hành trình, trở về."
      - "So sánh truyện truyền kỳ Việt Nam với văn học châu Âu cùng thời."
    skills:
      - Đọc sử liệu
      - Viết sáng tạo
      - Tư duy nhân vật
    development: "Lịch sử khám phá là 'chuyện thật đầy kịch tính' — móc nối tuổi này với khát vọng được đi xa, được thử thách."
  - subject: Toán
    weeks: 4
    topic: Phương trình một ẩn, tỉ lệ & đại lượng tỉ lệ
    examStatus: igcse
    syllabusCode: "0580"
    goals:
      - "Giải và lập phương trình bậc nhất một ẩn; kiểm tra nghiệm."
      - "Tỉ lệ, đơn vị đo, đổi đơn vị — 'ngôn ngữ số' của Cambridge."
    activities:
      - "Giải các bài toán thực tế: mua bán, pha chế, tiết kiệm."
      - "Xây 'kho câu hỏi' cá nhân để triển khai học tập tự kiểm tra."
    skills:
      - Đại số
      - Giải quyết vấn đề
      - Tự kiểm tra
    development: "Phương trình là 'vũ khí trừu tượng' đầu tiên của tuổi này — dạy ngay khi đầu óc bắt đầu sẵn sàng, vừa đủ chậm để không ép sớm."
  - subject: Khoa học
    weeks: 3
    topic: Nhập môn quan sát khoa học — đo lường, số liệu, ghi chú
    examStatus: igcse
    syllabusCode: "0625"
    goals:
      - "Dùng thước, cân, đồng hồ bấm giờ; ghi số liệu có đơn vị."
      - "Viết báo cáo ngắn theo trình tự Đặt vấn đề – Quan sát – Kết luận."
    activities:
      - "Thí nghiệm đo thời gian rơi của vật qua các chiều cao."
      - "Theo dõi biểu đồ nhiệt độ nước khi đun."
    skills:
      - Đo lường
      - Ghi chép
      - Trình bày số liệu
    development: "Kỹ năng thực hành của IGCSE Vật lý (Paper 6) cần được rèn từ năm này — nhưng qua thí nghiệm thật, không qua đề mẫu."
  - subject: Sinh học
    weeks: 4
    topic: Con người — dinh dưỡng & hệ bài tiết
    examStatus: waldorf-only
    goals:
      - "Hiểu đường đi của thức ăn và các chất dinh dưỡng trong cơ thể."
      - "Liên hệ lựa chọn ăn uống của chính mình với sinh lý học."
    activities:
      - "Vẽ 'bản đồ hành trình' của một bữa ăn trong cơ thể."
      - "Khảo sát nhãn dinh dưỡng sản phẩm trong siêu thị."
    skills:
      - Sinh lý học
      - Liên hệ bản thân
      - Vẽ sơ đồ
    development: "Sinh học con người là môn 'về chính mình' — rất hợp với giai đoạn cơ thể đang thay đổi mỗi ngày."
  - subject: Hóa học
    weeks: 4
    topic: Đốt cháy & muối — hai 'câu chuyện đầu tiên' của hóa học
    examStatus: waldorf-only
    goals:
      - "Điều kiện cháy; sản phẩm của sự cháy; muối từ đâu ra."
      - "An toàn hóa chất trong thí nghiệm."
    activities:
      - "Thí nghiệm ngọn lửa nến dưới lọ thủy tinh, tàn que diêm."
      - "Kết tinh muối, quan sát tinh thể dưới kính lúp."
    skills:
      - Thí nghiệm an toàn
      - Quan sát tinh thể
      - Kiến thức vật chất
    development: "Hóa học ở lớp 7 là chuyện hai 'phường' lớn nhất của vật chất: lửa và muối — hấp dẫn, dễ nhớ, nền tảng vững."
  - subject: Nghệ thuật & Thủ công
    weeks: 3
    topic: Điêu khắc, hội họa & thủ công theo mùa
    examStatus: waldorf-only
    goals:
      - "Điêu khắc gỗ mềm, vẽ chì than, dệt và làm gốm thô."
      - "Hoàn thiện 'hộp công cụ tay nghề' cá nhân."
    activities:
      - "Dự án điêu khắc kéo dài nhiều tuần để hoàn thành."
      - "Bảo trì và thu hoạch vườn trường."
    skills:
      - Khéo tay
      - Kiên nhẫn
      - Tự quản dự án
    development: "Nghệ thuật tiếp tục là 'môn cân bằng' trong năm dậy thì — tay nghề dạy sự kiên nhẫn mà bài giảng không thay được."
  - subject: Âm nhạc & Kịch
    weeks: 3
    topic: Hợp xướng, dàn nhạc & vở kịch học đường
    examStatus: waldorf-only
    goals:
      - "Chơi một nhạc cụ, hát hợp xướng, dựng kịch ngắn."
      - "Cảm nhận cấu trúc âm nhạc như 'toán học của cảm xúc'."
    activities:
      - "Trình diễn cuối năm cho gia đình và cộng đồng."
      - "Phân tích một bản nhạc nổi tiếng: nhịp, hòa âm, phát triển chủ đề."
    skills:
      - Cảm thụ âm nhạc
      - Trình diễn
      - Làm việc nhóm
    development: "Âm nhạc rèn neuron thính giác và kỷ luật trình diễn — nền tảng học ngôn ngữ và tiếng Anh thi cử."
weeklyContinuous:
  - subject: Toán
    periodsPerWeek: 3
    focus: "Số học, đại số nhập môn, hình học trực giác — vốn nền cho IGCSE 0580"
  - subject: Tiếng Anh (Cambridge)
    periodsPerWeek: 4
    focus: "Đọc hiểu, viết đoạn, phát âm — xây dựng B1–B2 theo khung CEFR, hướng tới IGCSE 0500"
  - subject: Khoa học (tiếng Anh)
    periodsPerWeek: 2
    focus: "Thuật ngữ khoa học tiếng Anh và kỹ năng thí nghiệm — tiếng Anh là 'scaffold' học thuật"
  - subject: Tiếng Việt & Văn hóa
    periodsPerWeek: 2
    focus: "Ngữ văn, lịch sử và văn hóa Việt Nam song hành — giữ gốc văn hóa trong chương trình ngoại ngữ"
research:
  - claim: "Ở tuổi dậy thì, nhịp sinh học muộn hơn và nhu cầu ngủ tăng lên; trường theo nhịp Waldorf (khối dạy buổi sáng, không ép học khuya) phù hợp với đồng hồ sinh học thực sự của học sinh 12–15 tuổi."
    source: "Carskadon MA. In: Wolfson AR, Montgomery-Downs HE (eds.) The Oxford Handbook of Infant, Child, and Adolescent Sleep. Oxford University Press, 2011."
  - claim: "Hoạt động thể chất có cấu trúc tương quan thuận với kết quả học tập và chức năng nhận thức ở tuổi vị thành niên — nên tuyến A-Level vẫn giữ nhịp vận động, nghệ thuật mỗi ngày thay vì cắt toàn bộ cho môn thi."
    source: "Alvarez-Bueno C, et al. Frontiers in Pediatrics, 5:40, 2017."
    url: "https://doi.org/10.3389/fped.2017.00040"
```


## Chi tiết chương trình

**Lớp 7 — điểm khởi đầu của mạch Cambridge — không phải năm 'học sớm để thi' — mà là năm gieo mạch.** Mọi
nội dung IGCSE phía trước (lượng giác, cân bằng phương trình, kinh tế vi mô) đều nuôi dưỡng từ những
'chuyện hiện tượng' của Waldorf: đòn bẩy từ bập bênh, tinh thể muối từ bếp gia đình, phương trình từ
câu hỏi 'bao nhiêu' cụ thể. Vì vậy, môn học liên tục hàng tuần (Toán – Tiếng Anh – Khoa học) chỉ chiếm
phần nhỏ, đều đặn, không phải 'cày' — đủ để hình thành nhịp ôn tập đúng nguyên lý giảng dạy phủ thời
gian (spacing).

**Điểm mốc thực sự của Lớp 7 là thói quen.** Kỷ luật học tập tự giác — ghi chú, tự kiểm tra, tóm tắt —
được xây qua từng khối, không phải qua áp lực điểm số. Người học còn giữ trọn lịch nghệ thuật, âm nhạc,
kịch và vận động: đó chính là 'bộ đệm' giúp bộ não 13 tuổi đang tái cấu trúc không bị quá tải.

**Trong năm này không có kỳ thi chính thức nào.** IGCSE chính thức sẽ bắt đầu ở Lớp 9; hai lớp
nền tảng đầu tiên mang tính 'xây ống dẫn': để khi bài thi thực sự đến, học sinh đã có sẵn thói quen, 
ngôn ngữ và kho câu hỏi cá nhân của mình.

<a id="nguon-08"></a>

## Lớp 8

Nguồn: `resources/content/alevel/alevel-lop-8.md`  
SHA-256: `de3edd6645b66574e10f9644ae788f1150ab2ef94d393c4ce3b3ce7b1136a20e`

```yaml
id: alevel-lop-8
year: 8
title: "Tuyến A-Level · Lớp 8"
age: 13–14 tuổi
phase: foundation-igcse
color: "#7a6f9e"
motto: "Đất chín để gieo: hóa học đời sống, giải phẫu con người và đại số hai ẩn — mạch IGCSE bắt đầu chính thức hoá."
overview: "Lớp 8 là cầu nối: vẫn đứng vững trong nhịp khối bài học, nhưng môn Toán và Tiếng Anh chính thức chuyển sang 'khung IGCSE'. Người học 13–14 tuổi đã đủ lớn để đối mặt Đại số hai ẩn, đồ thị và những văn bản học thuật; khoa học bắt đầu 'tiếng Anh hoá' từng bước để khi vào lớp 9, các môn này không còn là rào cản ngôn ngữ."
milestones:
  - "Giải hệ phương trình hai ẩn và đọc hiểu đồ thị hàm số — vốn nền Đại số IGCSE 0580."
  - "Tiếng Anh vững ở mức B1+; bắt đầu viết đoạn văn học thuật theo cấu trúc IGCSE."
  - "Quen thuật ngữ khoa học tiếng Anh cho ba môn Vật lý–Hóa học–Sinh học."
  - "Hoàn thành suốt 'hồ sơ khám phá' đầu tiên: một dự án cá nhân có chủ đích."
weeksTotal: 36
festivalWeeks: 4
blocks:
  - subject: Hóa học
    weeks: 5
    topic: Hóa hữu cơ đời sống — đường, chất béo, đạm
    examStatus: waldorf-only
    goals:
      - "Nhận diện ba 'nhà' lớn của vật chất sống và cách chúng chuyển hóa."
      - "Thí nghiệm an toàn: đốt, đun, nhận biết sản phẩm cháy."
    activities:
      - "Làm thí nghiệm với đường, dầu ăn, lòng trắng trứng."
      - "Vẽ sơ đồ vòng tuần hoàn chất dinh dưỡng trong bếp gia đình."
    skills:
      - Kiến thức hữu cơ
      - Thí nghiệm an toàn
      - Sơ đồ hóa
    development: "Ở 13–14, hóa hữu cơ kể 'chuyện của miếng ăn' — tự nhiên, gần gũi và mở đường cho Hóa học IGCSE 0620."
  - subject: Sinh học
    weeks: 5
    topic: Từ hệ sinh thái đến giải phẫu cơ thể người
    examStatus: waldorf-only
    goals:
      - "Chuỗi thức ăn, lưới sinh thái và mối quan hệ giữa các loài."
      - "Giải phẫu: xương, cơ, tim, phổi — cách cơ thể tự vận hành."
    activities:
      - "Điều tra một mảnh vườn/hồ nước: lập lưới sinh thái."
      - "Mô hình 'ngôi nhà cơ thể' vẽ các hệ cơ quan."
    skills:
      - Hệ sinh thái
      - Giải phẫu
      - Mô hình hóa
    development: "Từ vĩ mô đến vi mô của chính mình — đúng quỹ đạo trí tuệ của tuổi này, và đúng thứ tự bài Sinh học IGCSE 0610."
  - subject: Vật lý
    weeks: 5
    topic: Âm thanh, điện & từ — thí nghiệm mạch đơn giản
    examStatus: waldorf-only
    goals:
      - "Nguồn gốc và lan truyền của âm thanh; giao thoa ban đầu."
      - "Mạch điện đơn giản: nguồn, dây, bóng đèn, công tắc; nam châm."
    activities:
      - "Thí nghiệm đàn, sáo và thanh thép: tần số & cao độ."
      - "Lắp mạch điện gia đình thu nhỏ, phân tích tại sao sáng/tối."
    skills:
      - Thí nghiệm điện
      - Sóng & âm
      - Sơ đồ mạch
    development: "Điện và âm là nơi người 14 tuổi 'sờ được' hiện tượng trừu tượng — nền vật lý IGCSE 0625 không chán."
  - subject: Toán
    weeks: 6
    topic: Hệ phương trình hai ẩn & đồ thị hàm số
    examStatus: igcse
    syllabusCode: "0580"
    goals:
      - "Giải hệ hai ẩn bằng thế và cộng đại số; kể chuyện bằng đồ thị."
      - "Hàm số, hệ số góc, giao điểm — ngôn ngữ đồ thị của Cambridge."
    activities:
      - "Vẽ đồ thị chuyển động thật: tốc độ xe đạp, giá tiêu dùng."
      - "Xây 'kho câu hỏi' Đại số cá nhân kết hợp tự kiểm tra."
    skills:
      - Đại số
      - Đồ thị
      - Giải hệ phương trình
    development: "Đại số hai ẩn là 'bước nhảy trừu tượng hóa' đúng thời điểm của tuổi 14 — IGCSE đến vừa vặn."
  - subject: Lịch sử
    weeks: 6
    topic: Thời đại khám phá — kinh tế hàng hải & thương mại thế giới
    examStatus: waldorf-only
    goals:
      - "Các tuyến thương mại, công ty Đông Ấn, hệ thống thuế và nợ công."
      - "Vì sao một quốc gia giàu — khởi động tư duy kinh tế."
    activities:
      - "Trò chơi mô phỏng thương trường 'thuyền buôn' giữa các lớp."
      - "Đọc tiểu sử thương nhân, viết nhật ký từ góc nhìn hàng hóa."
    skills:
      - Kinh tế lịch sử
      - Đọc sử liệu
      - Mô phỏng
    development: "Lịch sử kinh tế gieo 'mầm kinh tế học' — sẵn sàng cho Kinh tế IGCSE 0455 từ lớp 9."
  - subject: Văn học & Viết
    weeks: 5
    topic: Tiểu thuyết hình thành, khoa học viễn tưởng & phiêu lưu
    examStatus: waldorf-only
    goals:
      - "Đọc một tiểu thuyết trọn vẹn; nhận diện nhân vật, xung đột, chủ đề."
      - "Viết đoạn văn có luận điểm rõ ràng — mạch của Paper 1 môn 0500."
    activities:
      - "Thảo luận, đóng vai nhân vật, viết 'chương kết' thay thế."
      - "Phân tích một bài viết mẫu IGCSE theo cấu trúc từng bước."
    skills:
      - Đọc tiểu thuyết
      - Viết luận
      - Phản biện
    development: "Văn học dạy 'đọc mạch ngầm' — kỹ năng mà kỳ thi tiếng Anh 0500 và đời sống trí tuệ đều cần."
  - subject: Nghệ thuật & Thủ công
    weeks: 4
    topic: Điêu khắc, nghiên cứu màu & thiết kế
    examStatus: waldorf-only
    goals:
      - "Nghiên cứu màu sắc như ngôn ngữ thị giác."
      - "Điêu khắc vật liệu mới: đất sét, thạch cao, gỗ."
    activities:
      - "Dự án 'bánh xe màu' cá nhân và chuỗi tranh tĩnh vật."
      - "Thiết kế bìa, áp phích cho vở kịch học đường."
    skills:
      - Nghiên cứu màu
      - Điêu khắc
      - Thiết kế
    development: "Mỹ thuật nuôi khả năng quan sát tinh tế — chuyển giao được sang khoa học và đọc hiểu."
weeklyContinuous:
  - subject: Toán
    periodsPerWeek: 3
    focus: "Đại số nâng dần, hình học, đồ thị — theo khung IGCSE 0580"
  - subject: Tiếng Anh (Cambridge)
    periodsPerWeek: 4
    focus: "Đọc văn bản học thuật, viết đoạn cấu trúc, phát âm — tiến tới B2, hướng IGCSE 0500"
  - subject: Khoa học (triple sciences)
    periodsPerWeek: 2
    focus: "Thuật ngữ và kỹ năng thí nghiệm IGCSE cho ba môn 0625 / 0620 / 0610"
  - subject: Tiếng Việt & Văn hóa
    periodsPerWeek: 2
    focus: "Ngữ văn, lịch sử và văn hóa Việt Nam song hành — giữ gốc văn hóa"
research:
  - claim: "Tiếp xúc song ngữ từ sớm rèn luyện kiểm soát chú ý và chức năng điều hành — lý do tuyến A-Level giữ 'song ngữ học thuật' (học bằng tiếng Anh, sống văn hóa bằng tiếng Việt) chứ không bỏ một bên."
    source: "Bialystok E. Child Development Perspectives, 9(3):186–191, 2015."
    url: "https://doi.org/10.1111/cdep.12116"
  - claim: "Não vị thành niên là 'hệ thống kép': hệ kích thích chín sớm, hệ kiểm soát chín muộn — nên việc đưa ngữ pháp học thuật và kỷ luật tổ chức vào tuổi 13–14 là đúng lúc cho khả năng quản trị bản thân."
    source: "Steinberg L. Current Directions in Psychological Science, 14(2):69–72, 2005."
```


## Chi tiết chương trình

**Lớp 8 đánh dấu lần 'chính thức hoá' đầu tiên.** Toán, Tiếng Anh và Khoa học chuyển từ 'môn vui'
sang 'khung Cambridge': thuật ngữ tiếng Anh, cấu trúc đoạn, kỹ thuật trả lời câu hỏi — nhưng khối bài
học chính vẫn là Waldorf đích thực. Hóa hữu cơ kể chuyện đường và chất béo, vật lý dạy qua mạch điện,
sinh học nhìn thấy chính mình. Đây là năm 'hai bàn chân': một chân trong hiện tượng, một chân đang
bước vào ngôn ngữ học thuật.

**Đồ thị và hệ phương trình là 'chìa khóa' của năm.** Người 14 tuổi bắt đầu nhìn ra khuôn mẫu trong
số liệu — vẽ đồ thị chuyển động thật, đọc biến thiên giá cả — và đây chính là mạch của mọi câu 'data
response' từ Đại số đến Kinh tế sau này.

**Văn học chuyển vai**: không còn là 'nghe kể', mà là 'đọc và phân tích' — một tiểu thuyết trọn vẹn,
đóng vai nhân vật, viết luận điểm. Đó là nhịp bước thẳng vào Paper 1 của môn Tiếng Anh 0500 (Lớp 9–10)
mà không hụt hơi.

<a id="nguon-09"></a>

## Lớp 9

Nguồn: `resources/content/alevel/alevel-lop-9.md`  
SHA-256: `dae9cf47e7bdc38b07e011f91ae2be6abef88dd5b7f4d06652c151d66e71ae8e`

```yaml
id: alevel-lop-9
year: 9
title: "Tuyến A-Level · Lớp 9"
age: 14–15 tuổi
phase: igcse-1
color: "#9e5f8a"
motto: "IGCSE bắt đầu — sáu môn thi chính thức song hành cùng những dự án Waldorf: luyện tập có nhịp, không cày."
overview: "Lớp 9 là năm mở màn IGCSE: chương trình Cambridge chính thức đi vào sáu môn — Toán 0580, Tiếng Anh 0500, Vật lý 0625, Hóa học 0620, Sinh học 0610, Kinh tế 0455. Nhưng phương pháp vẫn là Waldorf: khối bài học dày (mỗi môn vài tuần liền), thí nghiệm thật, dự án thực địa. Kỹ thuật ghi nhớ và làm bài được đưa vào theo khoa học học tập (retrieval practice, spaced practice) — chứ không phải bằng 'cày đề'. Lịch sử hiện đại và văn học tiếp tục là bộ môn cân bằng cho tuổi mới lớn."
milestones:
  - "Hoàn thành 50% chương trình IGCSE sáu môn: Đại số–Số học (0580), Vật lý cơ học–sóng (0625), Hóa nguyên tử–liên kết (0620), Sinh tế bào–dinh dưỡng (0610), Kinh tế vi mô (0455)."
  - "Tiếng Anh 0500 vững: đọc hiểu, tóm tắt, viết chỉ dẫn và văn bản thực dụng."
  - "Thành thạo kỹ thuật làm bài IGCSE: đọc đề, phân bổ thời gian, khoanh vùng từ khóa."
  - "Hoàn thành hai dự án thực địa khoa học có đo lường, ghi chú và báo cáo."
weeksTotal: 36
festivalWeeks: 4
blocks:
  - subject: "Toán · IGCSE 0580"
    weeks: 6
    topic: Số, Đại số & đồ thị — học kỳ 1 chương trình Cambridge
    syllabusCode: "0580"
    examStatus: igcse
    goals:
      - "Số hữu tỉ, phần trăm, lũy thừa, căn; dãy số và biến đổi đại số."
      - "Giải phương trình/hệ, bất đẳng thức, hàm số và đồ thị bậc nhất."
    activities:
      - "Luyện 'kho câu hỏi' theo chủ đề, kiểm tra ngắt quãng theo spaced practice."
      - "Giải bài toán thực tế kiểu Cambridge: tiền, tỉ lệ, diện tích."
    skills:
      - Đại số
      - Giải quyết vấn đề
      - Kỹ thuật làm bài
    development: "Đại số là trục của Paper 1/2 môn 0580 — dạy thành khối dày cho suy nghĩ 'chìm', rồi luyện ngắt quãng để bền nhớ."
  - subject: "Tiếng Anh · IGCSE 0500"
    weeks: 6
    topic: Đọc hiểu, tóm tắt & viết thực dụng — Paper 1
    syllabusCode: "0500"
    examStatus: igcse
    goals:
      - "Đọc 3–4 văn bản liên chủ đề; trả lời câu hỏi chi tiết và suy luận."
      - "Viết tóm tắt, văn bản chỉ dẫn, thư/bài viết có mục đích rõ."
    activities:
      - "Thực hành đọc nhanh và 'săn ý' trong văn bản thi thật."
      - "Viết theo rubric chấm điểm, tự chấm và sửa theo nhóm."
    skills:
      - Đọc hiểu
      - Tóm tắt
      - Viết thực dụng
    development: "0500 kiểm tra tư duy ngôn ngữ ở mức học thuật — nền tảng cho AS English Language 9093 ở lớp 11."
  - subject: "Vật lý · IGCSE 0625"
    weeks: 5
    topic: Cơ học, năng lượng & sóng — tập 1 chương trình Cambridge
    syllabusCode: "0625"
    examStatus: igcse
    goals:
      - "Chuyển động thẳng, lực, khối lượng, áp suất; công–năng lượng–công suất."
      - "Sóng: phản xạ, khúc xạ, giao thoa, âm thanh và ánh sáng."
    activities:
      - "Thí nghiệm định lượng: con lắc, máng nghiêng, lò xo Hooke."
      - "Bài thực hành Paper 6: xác định giới hạn, sai số, đồ thị tuyến tính."
    skills:
      - Cơ học
      - Sóng
      - Thực hành Paper 6
    development: "Lớp 9 đưa cơ học Waldorf lên tầm định lượng — đúng tuổi để hiểu công thức như 'ngôn ngữ gọn' của hiện tượng."
  - subject: "Hóa học · IGCSE 0620"
    weeks: 5
    topic: Cấu tạo nguyên tử, liên kết & định lượng — tập 1
    syllabusCode: "0620"
    examStatus: igcse
    goals:
      - "Hạt cơ bản, electron, bảng tuần hoàn, liên kết ion–cộng hóa trị–kim loại."
      - "Mol, khối lượng mol, tỉ lệ phản ứng; công thức hóa học."
    activities:
      - "Mô hình hóa electron và liên kết bằng hạt, dây và bảng."
      - "Thí nghiệm nhận biết khí và kết tinh; tính toán khối lượng."
    skills:
      - Nguyên tử & liên kết
      - Định lượng
      - Thí nghiệm hóa
    development: "Mol là 'cánh cửa định lượng' của hóa học — giảng chậm bằng hình ảnh để không trở thành công thức vô nghĩa."
  - subject: "Sinh học · IGCSE 0610"
    weeks: 5
    topic: Tế bào, vận chuyển & dinh dưỡng — tập 1
    syllabusCode: "0610"
    examStatus: igcse
    goals:
      - "Cấu tạo tế bào, enzyme, vận chuyển qua màng."
      - "Dinh dưỡng thực vật và động vật; hệ tuần hoàn và hô hấp sơ cấp."
    activities:
      - "Thí nghiệm quang hợp, hô hấp hạt nảy mầm; kính hiển vi tiêu bản."
      - "Báo cáo thực hành theo mẫu Cambridge Paper 6."
    skills:
      - Sinh học tế bào
      - Dinh dưỡng
      - Quan sát vi mô
    development: "Enzyme và vận chuyển màng là 'lạ' nhất với người 15 tuổi — dạy qua ẩm thực và sức khỏe hằng ngày."
  - subject: "Kinh tế · IGCSE 0455"
    weeks: 4
    topic: Vấn đề kinh tế cơ bản & thị trường — tập 1
    syllabusCode: "0455"
    examStatus: igcse
    goals:
      - "Khan hiếm, cơ hội phí, ba câu hỏi kinh tế; các loại hàng hóa."
      - "Cung–cầu, giá cả, độ co giãn và vai trò thị trường."
    activities:
      - "Trò chơi thị trường: đấu giá, thiếu hụt, giá trần sàn."
      - "Đọc dữ liệu (data response) từ thống kê thực của Việt Nam."
    skills:
      - Kinh tế vi mô
      - Đọc số liệu
      - Lập luận
    development: "0455 dạy tư duy lựa chọn — hợp tuổi hình thành phán đoán; data response rèn đọc bảng số liệu."
  - subject: "Lịch sử & Văn học"
    weeks: 3
    topic: Những cuộc cách mạng & văn học hiện thực
    examStatus: waldorf-only
    goals:
      - "Cách mạng công nghiệp, cách mạng Pháp, các phong trào giải phóng thế kỷ 19–20."
      - "Đọc truyện ngắn hiện thực: Nam Cao, O.Henry, Tô Hoài."
    activities:
      - "Hội thảo 'người trong cuộc': mỗi học sinh hóa thân một nhân vật lịch sử."
      - "Viết truyện ngắn lấy bối cảnh một cuộc cách mạng."
    skills:
      - Đọc sử liệu
      - Viết sáng tạo
      - Tranh luận
    development: "Lịch sử cách mạng giữ 'hơi người' trong năm thi — chống cạn kiệt tinh thần học thuật."
  - subject: "Dự án thực địa & Kỹ thuật thi"
    weeks: 2
    topic: Hai dự án khoa học thực địa + mock exam giữa kỳ
    examStatus: waldorf-only
    goals:
      - "Khảo sát một hệ thống thật: chất lượng nước, độ cao, ô nhiễm tiếng ồn."
      - "Làm quen áp lực phòng thi: đề mẫu, thời gian, kiểm tra chéo."
    activities:
      - "Viết báo cáo khoa học theo chuẩn Cambridge (aim, method, data, conclusion)."
      - "Tổ chức hai buổi mock; rút kinh nghiệm chiến thuật làm bài."
    skills:
      - Thực địa
      - Báo cáo khoa học
      - Quản lý thời gian
    development: "Dự án thật là 'phòng thí nghiệm tinh thần' cho áp lực thi cử — học sinh thấy mình làm được, tự tin bước vào Lớp 10."
weeklyContinuous:
  - subject: Toán
    periodsPerWeek: 5
    focus: "Problem-solving & luyện đề IGCSE 0580 — mỗi ngày một chút, ngắt quãng"
  - subject: Tiếng Anh
    periodsPerWeek: 4
    focus: "Luyện viết 0500 + speaking/discussion — tiếng Anh thành thói quen hằng ngày"
  - subject: Khoa học (triple sciences)
    periodsPerWeek: 3
    focus: "Kỹ năng thực hành Paper 6 cho 0625 / 0620 / 0610"
  - subject: Kinh tế
    periodsPerWeek: 2
    focus: "Đọc dữ liệu kinh tế thời sự — mạch data response 0455"
  - subject: Tiếng Việt & Thể thao
    periodsPerWeek: 2
    focus: "Ngữ văn, văn hóa và vận động hằng ngày — bộ đệm tinh thần"
research:
  - claim: "Trong số các kỹ thuật học tập, luyện tập nhớ lại (retrieval practice) và học ngắt quãng (spaced practice) cho hiệu quả bền nhất với trung học — đây là nền tảng của 'kho câu hỏi' cá nhân và mock exam trong tuyến IGCSE."
    source: "Dunlosky J, et al. Psychological Science in the Public Interest, 14(1):4–58, 2013."
    url: "https://doi.org/10.1177/1529100612453266"
  - claim: "Niềm tin 'trí thông minh có thể phát triển' (growth mindset) dự đoán điểm số tiến bộ trong giai đoạn chuyển cấp đầy thử thách — lý do tuyến A-Level nhấn 'cố gắng và chiến thuật' thay vì 'năng khiếu sẵn có'."
    source: "Blackwell LS, Trzesniewski KH, Dweck CS. Child Development, 78(1):246–263, 2007."
```


## Chi tiết chương trình

**Lớp 9 là năm 'cân bằng đỉnh điểm'.** Sáu môn IGCSE đi qua khối bài học dày đặc đầu ngày, mỗi môn một
chủ đề lớn liên tục nhiều tuần — đúng tinh thần Waldorf 'chìm sâu một chủ đề'. Nhưng đằng sau, một
'máy ôn tập' chạy hằng ngày: kho câu hỏi cá nhân, kiểm tra ngắt quãng, mock exam giữa kỳ. Không cày đề
dồn dập, không học nhồi — vì bằng chứng cho thấy nhớ lại và phủ thời gian bền hơn hẳn.

**Kinh tế xuất hiện từ lớp 9.** Đây là điểm khác biệt của tuyến A-Level: không phải môn 'phụ', mà là một
trong sáu môn IGCSE chính thức, dạy qua trò chơi thị trường và số liệu Việt Nam — để học sinh quen đọc
thế giới qua lăng kính khan hiếm và lựa chọn từ sớm.

**Hai dự án thực địa là 'trái tim' của năm.** Đo chất lượng nước một con sông, khảo sát tiếng ồn khu phố,
đếm đa dạng sinh học một mảnh vườn — học sinh viết báo cáo đúng chuẩn Cambridge và học cách đối mặt áp
lực một cách thực tế. Đây là thứ 'bài tập về nhà' mà không một cuốn sách nào thay được.

<a id="nguon-10"></a>

## Lớp 10

Nguồn: `resources/content/alevel/alevel-lop-10.md`  
SHA-256: `42c6db545b79eb2a6597a866f43bef29c4cb36a26580b327af4bc4defa169da4`

```yaml
id: alevel-lop-10
year: 10
title: "Tuyến A-Level · Lớp 10"
age: 15–16 tuổi
phase: igcse-2
color: "#a95468"
motto: "Chạm đích IGCSE — sáu môn hoàn tất, mock exams liên tiếp và kỳ thi chính thức; dự án cuối cấp vẫn giữ hơi người."
overview: "Lớp 10 là đích của chặng IGCSE: nửa sau chương trình sáu môn được hoàn tất, chuyển sang ôn luyện chiến thuật, mock exams và kỳ thi chính thức Cambridge (đợt tháng 5–6 hoặc 10–11). Trong lúc áp lực cao nhất, chương trình cố tình giữ các khối nghệ thuật, vận động và dự án cuối cấp — vì não vị thành niên cần 'nhịp thở' để tái cấu trúc, không phải bị đẩy đến kiệt sức."
milestones:
  - "Hoàn tất 100% chương trình IGCSE sáu môn và vượt qua kỳ thi chính thức Cambridge đợt cuối Lớp 10."
  - "Thành thạo chiến thuật làm bài: đọc đề, phân bổ thời gian, kiểm tra chéo."
  - "Chốt điểm mạnh/yếu từ mock exam để lập kế hoạch ôn tập cá nhân."
  - "Bảo vệ 'dự án cuối cấp' trước hội đồng — chuẩn bị tinh thần nghiên cứu cho AS Level."
weeksTotal: 36
festivalWeeks: 4
blocks:
  - subject: "Toán · IGCSE 0580"
    weeks: 6
    topic: Hình học, đo lường, lượng giác & xác suất-thống kê — tập 2
    syllabusCode: "0580"
    examStatus: igcse
    goals:
      - "Hình học phẳng/không gian, định lý, chu vi–diện tích–thể tích; lượng giác."
      - "Vectors, biến đổi hình học, xác suất và thống kê mô tả."
    activities:
      - "Giải trọn bộ đề Paper 2/4 (Extended) với đồng hồ thật."
      - "Phân tích sai số cá nhân từ mock exam thành danh sách 'điểm cần sửa'."
    skills:
      - Hình học & lượng giác
      - Xác suất thống kê
      - Kỹ thuật thi Extended
    development: "Nửa sau 0580 là 'đất' của tư duy không gian và lập luận xác suất — người 16 tuổi đủ chín để vào tầng Extended."
  - subject: "Tiếng Anh · IGCSE 0500"
    weeks: 5
    topic: Viết mở rộng, ngôn ngữ hình ảnh & kỹ thuật thi
    syllabusCode: "0500"
    examStatus: igcse
    goals:
      - "Viết văn miêu tả–kể chuyện–thuyết phục theo đề mở rộng."
      - "Phân tích cách tác giả dùng từ ngữ và cấu trúc để gây hiệu quả."
    activities:
      - "Luyện đề mẫu theo khung thời gian chuẩn; chấm chéo theo rubric."
      - "Xây 'bộ công cụ câu mở đầu' và chuyển đoạn cá nhân."
    skills:
      - Viết sáng tạo
      - Phân tích ngôn ngữ
      - Kỹ thuật thi
    development: "0500 bồi đắp 'cảm thụ ngôn ngữ' — nền cho AS English Language 9093 nơi phân tích trở thành nội dung chính."
  - subject: "Vật lý · IGCSE 0625"
    weeks: 5
    topic: Điện, từ, hạt nhân & thiên văn — tập 2
    syllabusCode: "0625"
    examStatus: igcse
    goals:
      - "Điện học, từ học, điện từ cảm ứng; năng lượng hạt nhân và phóng xạ."
      - "Vật lý thiên văn: các ngôi sao, vũ trụ giãn nở."
    activities:
      - "Thí nghiệm mạch điện, nam châm điện; mô hình lò phản ứng."
      - "Bài thực hành Paper 6 hoàn chỉnh với sai số và đồ thị."
    skills:
      - Điện & từ
      - Hạt nhân
      - Thực hành định lượng
    development: "Điện từ và hạt nhân là tầng 'trừu tượng nhất' của IGCSE — đúng lúc người 16 tuổi hứng thú với thế giới vô hình."
  - subject: "Hóa học · IGCSE 0620"
    weeks: 5
    topic: Năng lượng, tốc độ, cân bằng & hóa hữu cơ — tập 2
    syllabusCode: "0620"
    examStatus: igcse
    goals:
      - "Phản ứng tỏa–thu nhiệt, tốc độ phản ứng, cân bằng hóa học."
      - "Hóa hữu cơ: alkan, alken, alcohol, polymer; điều chế khí công nghiệp."
    activities:
      - "Thí nghiệm tốc độ phản ứng (bột, nhiệt độ, chất xúc tác)."
      - "Vẽ chuỗi chuyển hóa hữu cơ và bài tập tính toán hoàn chỉnh."
    skills:
      - Hóa lý
      - Hữu cơ
      - Tính toán hóa
    development: "Cân bằng và tốc độ phản ứng là 'hóa học động' — chuyển tiếp mượt sang AS Chemistry 9701."
  - subject: "Sinh học · IGCSE 0610"
    weeks: 5
    topic: Điều hòa, di truyền & sinh thái — tập 2
    syllabusCode: "0610"
    examStatus: igcse
    goals:
      - "Điều hòa nội môi, hệ thần kinh, hormone; sinh sản."
      - "Di truyền Mendel, DNA, biến dị; hệ sinh thái và tác động con người."
    activities:
      - "Mô hình hóa quá trình điều hòa đường huyết, bài tập phả hệ."
      - "Điều tra một hệ sinh thái địa phương, đánh giá tác động môi trường."
    skills:
      - Điều hòa cơ thể
      - Di truyền
      - Sinh thái học
    development: "Di truyền và điều hòa nội môi là đỉnh của 0610 — nơi học sinh thấy 'cơ chế của sự sống'."
  - subject: "Kinh tế · IGCSE 0455"
    weeks: 4
    topic: Kinh tế vĩ mô, chính sách & thương mại — tập 2
    syllabusCode: "0455"
    examStatus: igcse
    goals:
      - "Tiền, ngân hàng, thu nhập quốc dân, lạm phát–thất nghiệp–tăng trưởng."
      - "Thuế, chính sách tài khóa–tiền tệ, thương mại quốc tế và tỷ giá."
    activities:
      - "Đọc báo cáo kinh tế vĩ mô thời sự; phân tích data response."
      - "Tranh luận: can thiệp chính phủ hay để thị trường tự do."
    skills:
      - Kinh tế vĩ mô
      - Đọc số liệu
      - Tranh luận
    development: "Vĩ mô dạy nhìn nền kinh tế như 'hệ thống' — nền tảng AS Economics 9708 với AD/AS và chính sách."
  - subject: "Dự án cuối cấp"
    weeks: 3
    topic: Dự án nghiên cứu cá nhân & bảo vệ trước hội đồng
    examStatus: waldorf-only
    goals:
      - "Chọn một câu hỏi tự đặt, lập kế hoạch, thu thập và phân tích tư liệu."
      - "Bảo vệ kết quả trước hội đồng giáo viên và bạn bè."
    activities:
      - "Viết báo cáo 1.500–2.500 từ theo chuẩn khoa học."
      - "Trình bày bằng slide + hỏi đáp; nhận phản hồi và sửa lần cuối."
    skills:
      - Nghiên cứu
      - Viết báo cáo
      - Bảo vệ quan điểm
    development: "Dự án là 'bản tập' của AS/A2 Project — đưa người 16 tuổi từ người làm bài thi thành người đặt câu hỏi."
  - subject: "Ôn tập & Kỳ thi"
    weeks: 3
    topic: Mock exams, ôn tập chiến thuật & kỳ thi chính thức
    examStatus: igcse
    goals:
      - "Ba đợt mock full-paper với thời gian thật và chấm theo rubric."
      - "Lập 'kế hoạch ôn tập cá nhân' từ lỗi mock; thi chính thức đợt 5–6."
    activities:
      - "Bảng theo dõi tiến độ 6 môn, ưu tiên theo điểm yếu."
      - "Thực hành nghi thức phòng thi, quản lý cảm xúc và giấc ngủ trước thi."
    skills:
      - Quản lý ôn tập
      - Kỹ thuật thi
      - Quản lý cảm xúc
    development: "Đối mặt áp lực thi đúng cách là 'môn học đời' — dạy chiến thuật thay vì lo sợ."
weeklyContinuous:
  - subject: Toán
    periodsPerWeek: 5
    focus: "Luyện đề Extended 0580 hằng ngày, phân tích lỗi ngay sau buổi"
  - subject: Tiếng Anh
    periodsPerWeek: 4
    focus: "Viết mở rộng 0500 + speaking; phản hồi sửa lỗi liên tục"
  - subject: Khoa học (triple sciences)
    periodsPerWeek: 3
    focus: "Hoàn thiện kỹ năng Paper 6 và luyện đề theo chủ đề"
  - subject: Kinh tế
    periodsPerWeek: 2
    focus: "Data response hằng tuần từ số liệu thời sự"
  - subject: Tiếng Việt & Thể thao
    periodsPerWeek: 2
    focus: "Ngữ văn, văn hóa, vận động — bộ đệm tinh thần trong mùa thi"
research:
  - claim: "Kiểm tra (testing) không chỉ đo lường mà còn tăng cường ghi nhớ và chuyển di kiến thức — nền tảng để mock exams được dùng như công cụ học tập, không chỉ áp lực."
    source: "Roediger HL III, Karpicke JD. Perspectives on Psychological Science, 1(3):181–210, 2006."
  - claim: "Vỏ não trước trán — trung tâm kiểm soát cảm xúc và ra quyết định — vẫn phát triển mạnh ở tuổi 15–16; vì vậy quản lý cảm xúc thi cử và giấc ngủ là phần nội dung chính thức, không phải 'phụ trội'."
    source: "Steinberg L. Current Directions in Psychological Science, 14(2):69–72, 2005."
```


## Chi tiết chương trình

**Lớp 10 là năm của 'hai chiếc la bàn': nội dung và chiến thuật.** Nửa sau của sáu môn IGCSE được dạy
trọn — nhưng quan trọng không kém là học sinh bắt đầu học *cách thi*: đọc đề trong 5 phút đầu, phân bổ
thời gian theo số điểm, khoanh vùng từ khóa, kiểm tra chéo. Mock exams ba đợt không phải để 'đánh giá',
mà để từng lỗi sai trở thành một mục trong kế hoạch ôn tập cá nhân.

**Dự án cuối cấp là 'phản đề' của bài thi.** Kỳ thi hỏi 'em biết gì'; dự án hỏi 'em muốn biết gì'. Chọn
một câu hỏi tự đặt, lập kế hoạch, thu thập tư liệu, viết báo cáo 2.000 từ và đứng bảo vệ trước hội đồng —
đây là bản tập trực tiếp của AS/A2 research project và kỹ năng tự học đại học.

**Giấc ngủ là 'môn học' chính thức của Lớp 10.** Não vị thành niên cần 8–10 giờ; ôn thi đến khuya là tự
hủy chính mình. Lịch học được sắp để mùa mock/thật có thời gian nghỉ đúng nhịp — vì nghiên cứu rõ ràng:
ngủ đủ tăng cường củng cố trí nhớ trong lúc ôn thi, còn thức khuya cướp mất nó.

<a id="nguon-11"></a>

## Lớp 11

Nguồn: `resources/content/alevel/alevel-lop-11.md`  
SHA-256: `74c01804fe129854d8733bb32f6a9fbecc6bd3a3a53d590463c2b28869952dd6`

```yaml
id: alevel-lop-11
year: 11
title: "Tuyến A-Level · Lớp 11"
age: 16–17 tuổi
phase: as
color: "#c07a3e"
motto: "AS Level — sáu môn Cambridge lên tầm đại học: tư duy phân tích, nghiên cứu và một dự án nghiên cứu của chính mình."
overview: "Lớp 11 mở đầu cấp độ A-Level: học sinh bước vào AS Level sáu môn — Toán 9709, Ngôn ngữ Anh 9093, Vật lý 9702, Hóa học 9701, Sinh học 9700, Kinh tế 9708 — với khối lượng và độ sâu chuẩn năm nhất đại học. Nhịp Waldorf vẫn được giữ: khối bài học dày, tranh luận, dự án nghiên cứu cá nhân; nhưng lần đầu tiên học sinh 'sở hữu' một câu hỏi nghiên cứu của riêng mình và luyện tập ghi nhớ theo nguyên lý 'khó khăn thích đáng'."
milestones:
  - "Hoàn tất 50% chương trình A-Level: toàn bộ phần AS của sáu môn 9709 / 9093 / 9702 / 9701 / 9700 / 9708."
  - "Viết và bảo vệ báo cáo nghiên cứu năm 11 theo chuẩn khoa học đại học."
  - "Chốt danh mục chuyên sâu A2 cho Lớp 12 dựa trên sở thích và điểm mạnh."
  - "Luyện tập chiến thuật AS: câu hỏi nhiều điểm, lập luận có dẫn chứng, phân tích dữ liệu."
weeksTotal: 36
festivalWeeks: 4
blocks:
  - subject: "Toán · AS 9709"
    weeks: 6
    topic: Pure Mathematics 1 — lượng giác, hàm số, chuỗi & vi phân
    syllabusCode: "9709"
    examStatus: as
    goals:
      - "Hàm số, lượng giác, chuỗi, nhị thức Newton, tọa độ."
      - "Giới hạn, đạo hàm và ứng dụng (cực trị, tiếp tuyến)."
    activities:
      - "Giải bài toán P1 từ đơn giản đến 'nhất thiết' theo độ khó thích đáng."
      - "Xây sổ tay 'định lý + thí dụ' cá nhân để luyện nhớ lại."
    skills:
      - Giải tích
      - Lượng giác
      - Chứng minh
    development: "P1 là lần đầu học sinh 'nhìn thấy vô cực' qua giới hạn — đúng bước nhảy trí tuệ của tuổi 16–17."
  - subject: "Ngôn ngữ Anh · AS 9093"
    weeks: 5
    topic: Đọc hiểu văn bản & viết luận phân tích ngôn ngữ
    syllabusCode: "9093"
    examStatus: as
    goals:
      - "Phân tích ngôn ngữ theo bối cảnh: chủ thể, khán giả, mục đích."
      - "Viết văn bản có mục đích rõ và bài phân tích liên văn bản."
    activities:
      - "Phân tích một bài nói chuyện/đoạn quảng cáo/một trang báo."
      - "Viết luận có luận điểm, dẫn chứng ngôn ngữ cụ thể."
    skills:
      - Phân tích ngôn ngữ
      - Viết luận
      - Tư duy phản biện
    development: "9093 dạy đọc 'mã' ngôn ngữ — nền tảng học thuật cho mọi môn còn lại."
  - subject: "Vật lý · AS 9702"
    weeks: 5
    topic: Cơ học, sóng, điện & chuyển động tròn — AS topics
    syllabusCode: "9702"
    examStatus: as
    goals:
      - "Chuyển động, lực, động lượng, năng lượng; sóng và giao thoa."
      - "Điện học: dòng, điện trở, điện trường; chuyển động tròn đều."
    activities:
      - "Thí nghiệm định lượng: con lắc đơn, sợi quang, mạch cầu Wheatstone."
      - "Phân tích sai số và đồ thị theo chuẩn Practical Paper."
    skills:
      - Cơ học nâng cao
      - Sóng & điện
      - Thực hành định lượng
    development: "AS Physics đưa 'hiện tượng Waldorf' lên ngôn ngữ giải tích — người 17 tuổi đủ trừu tượng để theo."
  - subject: "Hóa học · AS 9701"
    weeks: 5
    topic: Cấu trúc, mol, nhiệt hóa, động hóa & hóa hữu cơ — AS topics
    syllabusCode: "9701"
    examStatus: as
    goals:
      - "Cấu trúc electron, liên kết, dạng hình học phân tử; enthalpy."
      - "Tốc độ phản ứng, cân bằng (Kc), hóa hữu cơ AS: alkan, alken, halogenoalkan."
    activities:
      - "Thí nghiệm xác định enthalpy; phân tích kết quả bằng đồ thị."
      - "Viết cơ chế phản ứng hữu cơ bằng mô hình electron chuyển dịch."
    skills:
      - Hóa lý nâng cao
      - Cơ chế hữu cơ
      - Tính toán
    development: "Enthalpy và cơ chế phản ứng là 'tầng năng lượng' của hóa học — đúng lúc tư duy hệ thống chín."
  - subject: "Sinh học · AS 9700"
    weeks: 5
    topic: Tế bào, phân tử, enzyme, vận chuyển & đa dạng sinh học — AS topics
    syllabusCode: "9700"
    examStatus: as
    goals:
      - "Cấu trúc tế bào, macromolecule, enzyme và ức chế."
      - "Vận chuyển màng, phân chia tế bào, đa dạng sinh học và bảo tồn."
    activities:
      - "Thí nghiệm enzyme với biến thiên pH/nhiệt độ; tính tốc độ."
      - "Điều tra đa dạng loài ở một khu vực; phân tích chỉ số."
    skills:
      - Sinh học phân tử
      - Thí nghiệm enzyme
      - Thống kê sinh học
    development: "AS Biology nhìn sâu vào 'máy móc của sự sống' ở cấp phân tử — chín muồi cho tư duy hệ thống."
  - subject: "Kinh tế · AS 9708"
    weeks: 5
    topic: Kinh tế vi mô & vĩ mô cơ bản — AS topics
    syllabusCode: "9708"
    examStatus: as
    goals:
      - "PPF, cung–cầu, độ co giãn, thất bại thị trường; định lượng."
      - "Đo lường kinh tế vĩ mô: GDP, AD/AS, mục tiêu vĩ mô."
    activities:
      - "Phân tích data response và essay theo chuẩn chấm Cambridge."
      - "Tranh luận chính sách: thuế, trợ cấp, can thiệp giá."
    skills:
      - Kinh tế vi mô–vĩ mô
      - Viết essay kinh tế
      - Phân tích dữ liệu
    development: "AS Economics chính thức hóa 'tư duy lựa chọn' thành lý thuyết và mô hình — nền tảng đại học vững."
  - subject: "Nghiên cứu cá nhân"
    weeks: 3
    topic: Dự án nghiên cứu năm 11 — từ câu hỏi đến báo cáo khoa học
    examStatus: waldorf-only
    goals:
      - "Đặt câu hỏi nghiên cứu thật, tổng quan tư liệu, thiết kế phương pháp."
      - "Thu thập dữ liệu, phân tích và viết báo cáo + bảo vệ."
    activities:
      - "Chọn đề tài liên môn (khoa học–kinh tế–xã hội)."
      - "Trình bày trước hội đồng; nhận phản hồi chuyên sâu."
    skills:
      - Phương pháp nghiên cứu
      - Viết báo cáo
      - Bảo vệ quan điểm
    development: "Nghiên cứu là 'môn đưa người học thành người tìm tòi' — tinh thần cao nhất của Waldorf thời đại đại học."
  - subject: "Nghệ thuật & Triết học"
    weeks: 2
    topic: Kịch, tranh luận và những câu hỏi của người 17 tuổi
    examStatus: waldorf-only
    goals:
      - "Đọc và đóng một vở kịch hiện đại; thảo luận triết học nhân sinh."
      - "Tranh luận có dẫn chứng về các chủ đề khoa học–đạo đức."
    activities:
      - "Vở kịch học đường năm 11."
      - "Hội thảo triết học: tự do, trách nhiệm, công nghệ và con người."
    skills:
      - Tranh luận
      - Cảm thụ kịch
      - Tư duy triết học
    development: "Triết học và kịch là 'phanh tay' cho năm học đòi hỏi cao — giữ con người trong học sinh."
weeklyContinuous:
  - subject: Toán
    periodsPerWeek: 5
    focus: "Luyện đề AS 9709 theo chủ đề; sổ tay định lý + thí dụ"
  - subject: Ngôn ngữ Anh
    periodsPerWeek: 4
    focus: "Viết luận 9093 + phân tích liên văn bản hằng tuần"
  - subject: Khoa học (triple sciences)
    periodsPerWeek: 3
    focus: "Practical Paper AS + luyện câu hỏi nhiều điểm"
  - subject: Kinh tế
    periodsPerWeek: 3
    focus: "Essay & data response AS 9708; theo dõi chính sách thời sự"
  - subject: Tiếng Việt & Thể thao
    periodsPerWeek: 2
    focus: "Ngữ văn, văn hóa, vận động — giữ gốc và nhịp thở"
research:
  - claim: "'Khó khăn thích đáng' (desirable difficulties) — học tập có độ khó vừa phải, luyện ngắt quãng, tự kiểm tra — tăng cường ghi nhớ lâu dài hơn là học lặp lại dễ dàng; đây là thiết kế 'sổ tay định lý + thí dụ' của tuyến A-Level."
    source: "Bjork EL, Bjork RA. In: Psychology and the Real World: Essays Illustrating Fundamental Contributions to Society, Worth, 2011."
  - claim: "Giai đoạn ủ (incubation) sau khi 'mắc kẹt' ở một vấn đề giúp cải thiện giải quyết vấn đề — lý do tuyến A-Level luôn chèn giờ nghỉ, vận động và nghệ thuật giữa các khối học đòi hỏi cao."
    source: "Sio UN, Ormerod TC. Psychological Bulletin, 135(1):94–120, 2009."
```


## Chi tiết chương trình

**Lớp 11 là 'bước vào đại học' trước tuổi.** AS Level không còn là 'học cho thuộc' mà là 'học để lập
luận': mỗi câu trả lời phải có luận điểm, dẫn chứng và phân tích. Toán chạm giải tích, hóa học chạm
enthalpy, sinh học chạm enzyme, kinh tế chạm mô hình AD/AS — và ngôn ngữ Anh trở thành công cụ phân tích
thay vì môn ngoại ngữ. Đây là lúc sáu môn 'cất cánh' cùng nhau.

**Dự án nghiên cứu năm 11 là chữ ký của tuyến.** Khác bài thi (hỏi 'em biết gì'), dự án hỏi 'em muốn
biết gì và chứng minh thế nào'. Học sinh chọn câu hỏi liên môn, tổng quan tư liệu, thiết kế phương pháp,
thu dữ liệu, viết báo cáo và đứng bảo vệ. Đây cũng là 'bài khảo sát' giúp chốt danh mục A2 của Lớp 12.

**Độ khó được thiết kế có chủ đích.** Tuyến này không tránh khó — mà làm cho độ khó 'thích đáng': khó
vừa đủ để não phải tái tổ chức, nhưng không đến mức sụp đổ. Mỗi khối đều có nhịp nghỉ, vận động, nghệ
thuật — vì giai đoạn ủ (incubation) là một phần thực sự của tư duy, không phải thời gian 'lãng phí'.

<a id="nguon-12"></a>

## Lớp 12

Nguồn: `resources/content/alevel/alevel-lop-12.md`  
SHA-256: `37422b334278a05b83ce8fbeb6255d6f93362e5c0a8a5426f2accd53207a58b9`

```yaml
id: alevel-lop-12
year: 12
title: "Tuyến A-Level · Lớp 12"
age: 17–18 tuổi
phase: a2
color: "#2f6f6f"
motto: "A2 & tác phẩm cuối cấp — hoàn tất A-Level Certificate và một 'cuộc nói chuyện của người trưởng thành': Faust, khoa học và những câu hỏi của cuộc đời."
overview: "Lớp 12 là đích của tuyến: phần A2 của sáu môn được hoàn tất, kỳ thi chính thức A-Level diễn ra và học sinh nhận Chứng chỉ A-Level Cambridge. Song song, chương trình giữ trọn tinh thần Waldorf cuối cấp: tác phẩm văn học vĩ đại (Faust), khối triết học khoa học, và 'cuộc nói chuyện của người trưởng thành' — nơi học sinh trình bày quan điểm của mình về thế giới. Đây không phải năm 'nước rút' mà là năm 'hội tụ'."
milestones:
  - "Hoàn tất 100% chương trình A-Level và đạt Chứng chỉ A-Level Cambridge (A2 của sáu môn)."
  - "Bảo vệ 'tác phẩm cuối cấp' — nghiên cứu hoặc sáng tác tổng hợp toàn bộ hành trình."
  - "Viết 'tuyên ngôn của người 18 tuổi': quan điểm cá nhân về khoa học, xã hội và con người."
  - "Hoàn thiện hồ sơ ứng tuyển đại học: bảng điểm, bài luận cá nhân, giới thiệu dự án."
weeksTotal: 36
festivalWeeks: 4
blocks:
  - subject: "Toán · A2 9709"
    weeks: 6
    topic: Pure Mathematics 3 + một hướng (Mechanics / Statistics)
    syllabusCode: "9709"
    examStatus: a2
    goals:
      - "P3: hàm số log–mũ, lượng giác nâng cao, tích phân, phức, phương trình vi phân sơ cấp."
      - "Chọn M1 hoặc S2: cơ học (lực, ma sát, xung lực) hoặc thống kê nâng cao."
    activities:
      - "Giải trọn bộ đề P3 và hướng chọn; phân tích lỗi thành 'sổ sửa sai'."
      - "Mô hình hóa một bài toán thực tế bằng cơ học/thống kê."
    skills:
      - Giải tích nâng cao
      - Mô hình toán
      - Kỹ thuật thi A2
    development: "P3 là 'đỉnh' của toán trung học — nơi người 18 tuổi nhìn thấy toán như ngôn ngữ của thế giới vô hình."
  - subject: "Ngôn ngữ Anh · A2 9093"
    weeks: 5
    topic: Biến đổi ngôn ngữ, ngôn ngữ trẻ em & tiếng Anh toàn cầu
    syllabusCode: "9093"
    examStatus: a2
    goals:
      - "Sự biến đổi ngôn ngữ theo thời gian; địa phương hóa và toàn cầu hóa."
      - "Tiếp thu ngôn ngữ trẻ em và 'ngôn ngữ bản thân' (language and the self)."
    activities:
      - "Khảo sát biến đổi tiếng Anh qua văn bản các thời kỳ."
      - "Thu thập và phân tích dữ liệu ngôn ngữ trẻ nhỏ trong cộng đồng."
    skills:
      - Ngôn ngữ học
      - Nghiên cứu ngôn ngữ
      - Viết luận phân tích
    development: "9093 A2 đưa học sinh vào ngôn ngữ học thực thụ — tư duy phản tư về chính ngôn ngữ mình đang nói."
  - subject: "Vật lý · A2 9702"
    weeks: 5
    topic: Điện trường–từ trường, lượng tử, hạt nhân & vật lý y khoa
    syllabusCode: "9702"
    examStatus: a2
    goals:
      - "Điện trường, từ trường, cảm ứng điện từ; dao động và sóng dừng."
      - "Vật lý lượng tử, mô hình hạt nhân, vật lý y khoa và thiên văn học."
    activities:
      - "Thí nghiệm giao thoa, cộng hưởng; mô hình phân rã phóng xạ."
      - "Nghiên cứu một kỹ thuật y khoa (MRI, PET, X-quang) thành báo cáo."
    skills:
      - Vật lý hiện đại
      - Mô hình lượng tử
      - Nghiên cứu ứng dụng
    development: "A2 Physics là 'ranh giới hiểu biết' của loài người — vừa khiêm nhường vừa phấn khích với người 18 tuổi."
  - subject: "Hóa học · A2 9701"
    weeks: 5
    topic: Cân bằng nâng cao, hóa vô cơ chu kỳ & hóa hữu cơ nâng cao
    syllabusCode: "9701"
    examStatus: a2
    goals:
      - "Entropy, năng lượng tự do, cân bằng acid–base, điện hóa."
      - "Kim loại chuyển tiếp, arenes, polymer, tổng hợp hữu cơ."
    activities:
      - "Thí nghiệm chuẩn độ, điện phân; phân tích kết quả định lượng."
      - "Vẽ sơ đồ tổng hợp hữu cơ nhiều bước với điều kiện phản ứng."
    skills:
      - Hóa lý nâng cao
      - Tổng hợp hữu cơ
      - Thực hành định lượng
    development: "A2 Chemistry nối dài 'năng lượng và vật chất' — nền tảng trực tiếp cho hóa đại học và kỹ thuật."
  - subject: "Sinh học · A2 9700"
    weeks: 5
    topic: Điều hòa nội môi, công nghệ gen, hô hấp & hệ sinh thái — A2 topics
    syllabusCode: "9700"
    examStatus: a2
    goals:
      - "Điều hòa nội môi và thần kinh–nội tiết; sinh sản và biểu hiện gen."
      - "Công nghệ DNA, kỹ thuật gen, sinh tổng hợp protein; sinh thái học."
    activities:
      - "Thí nghiệm hô hấp/quang hợp định lượng; phân tích enzyme."
      - "Tranh luận đạo đức: chỉnh sửa gen, sinh vật biến đổi gen."
    skills:
      - Sinh học phân tử
      - Công nghệ gen
      - Đạo đức sinh học
    development: "A2 Biology đặt học sinh vào 'ranh giới mới' của sinh học hiện đại — với câu hỏi đạo đức đi kèm."
  - subject: "Kinh tế · A2 9708"
    weeks: 5
    topic: Lý thuyết doanh nghiệp, thị trường, thương mại & phát triển — A2 topics
    syllabusCode: "9708"
    examStatus: a2
    goals:
      - "Lý thuyết hãng, cấu trúc thị trường, phân tích cạnh tranh."
      - "Thương mại quốc tế, tỷ giá, phát triển kinh tế và chính sách."
    activities:
      - "Phân tích một doanh nghiệp Việt Nam bằng mô hình thị trường."
      - "Essay A2: đánh giá chính sách phát triển với dữ liệu thật."
    skills:
      - Kinh tế doanh nghiệp
      - Thương mại & phát triển
      - Viết essay phân tích
    development: "A2 Economics giúp người 18 tuổi đọc 'thế giới kinh tế' một cách có mô hình và có trách nhiệm."
  - subject: "Tác phẩm cuối cấp"
    weeks: 3
    topic: Tác phẩm cuối cấp & 'cuộc nói chuyện của người trưởng thành'
    examStatus: waldorf-only
    goals:
      - "Chọn nghiên cứu hoặc sáng tác tổng hợp hành trình 12 năm."
      - "Trình bày trước toàn trường; trả lời chất vấn từ hội đồng."
    activities:
      - "Viết và bảo vệ tác phẩm (báo cáo, tiểu luận, phim, tác phẩm nghệ thuật)."
      - "Chuẩn bị hồ sơ đại học từ chính tác phẩm và dự án các năm."
    skills:
      - Tổng hợp
      - Trình bày trước công chúng
      - Bảo vệ quan điểm
    development: "Tác phẩm cuối cấp là 'lời chào người lớn' — nơi học sinh nhìn lại mình đã trưởng thành thế nào."
  - subject: "Văn học & Triết học"
    weeks: 1
    topic: Faust & những câu hỏi vĩ đại — tự do, tri thức và trách nhiệm
    examStatus: waldorf-only
    goals:
      - "Đọc và thảo luận Faust (Goethe) như biểu tượng của người hiện đại."
      - "Đối thoại giữa khoa học, nghệ thuật và đạo đức."
    activities:
      - "Hội thảo triết học: kiến thức có giới hạn không, và giá của nó."
      - "Viết tiểu luận phản tỉnh cuối năm."
    skills:
      - Đọc văn học vĩ đại
      - Tư duy triết học
      - Viết phản tỉnh
    development: "Faust là 'tấm gương của người 18 tuổi' — khát khao hiểu biết và cái giá của nó; kết tinh cả tuyến A-Level."
  - subject: "Ôn thi & Kỳ thi A-Level"
    weeks: 1
    topic: Mock A2, ôn tập chiến thuật & kỳ thi chính thức
    examStatus: a2
    goals:
      - "Mock full-paper từng môn; lập kế hoạch ôn cá nhân từ lỗi."
      - "Thi chính thức A-Level và hoàn tất hồ sơ nhập học đại học."
    activities:
      - "Bảng theo dõi tiến độ; nhịp ngủ–dinh dưỡng–vận động ổn định."
      - "Quản lý cảm xúc mùa thi bằng kỹ thuật đã rèn từ Lớp 10."
    skills:
      - Quản lý ôn tập
      - Kỹ thuật thi
      - Chuẩn bị hồ sơ
    development: "Kỳ thi cuối là 'chặng đường đã chạy' chứ không phải 'ngày sinh tử' — năng lực đã được xây suốt 12 năm."
weeklyContinuous:
  - subject: Toán
    periodsPerWeek: 5
    focus: "Luyện đề A2 9709 (P3 + hướng chọn), sổ sửa sai liên tục"
  - subject: Ngôn ngữ Anh
    periodsPerWeek: 4
    focus: "Luận A2 9093 + nghiên cứu ngôn ngữ; phản hồi sửa lỗi"
  - subject: Khoa học (triple sciences)
    periodsPerWeek: 3
    focus: "Practical A2 + câu hỏi phân tích nhiều điểm"
  - subject: Kinh tế
    periodsPerWeek: 3
    focus: "Essay & data response A2 9708; theo dõi chính sách thời sự"
  - subject: Tiếng Việt & Thể thao
    periodsPerWeek: 2
    focus: "Ngữ văn, văn hóa, vận động — giữ gốc và nhịp thở cuối cấp"
research:
  - claim: "Ôn tập tích cực bằng cách nhớ lại (kiểm tra chính mình) và ngủ đủ — thay vì học nhồi khuya — là con đường bền vững cho kỳ thi tổng hợp như A-Level; ngủ đủ giúp củng cố trí nhớ dài hạn."
    source: "Roediger HL III, Karpicke JD. Perspectives on Psychological Science, 1(3):181–210, 2006."
  - claim: "Niềm tin vào khả năng phát triển của trí thông minh vẫn tiếp tục dự đoán kết quả ở những năm cuối trung học — lý do tuyến A-Level kết thúc bằng 'tác phẩm' và phản tỉnh, không chỉ bằng điểm thi."
    source: "Blackwell LS, Trzesniewski KH, Dweck CS. Child Development, 78(1):246–263, 2007."
```


## Chi tiết chương trình

**Lớp 12 là năm 'hội tụ' — không phải năm nước rút.** Sáu môn A2 kết thúc bằng kỳ thi chính thức và
Chứng chỉ A-Level Cambridge; nhưng điều làm tuyến này khác biệt là tác phẩm cuối cấp và cuộc nói chuyện
của người trưởng thành. Học sinh không chỉ 'thi xong' — họ đứng trước toàn trường, trình bày nghiên cứu
hoặc sáng tác của mình, trả lời chất vấn, và viết 'tuyên ngôn của người 18 tuổi' về thế giới.

**Faust là 'chữ ký' của năm cuối.** Bản giao hưởng của Goethe về người hiện đại — khao khát tri thức,
cái giá của nó, ranh giới của tự do — là tấm gương mà tuyến Waldorf đặt trước mỗi học sinh vừa hoàn tất
một hành trình trí tuệ 12 năm. Đây là cách Waldorf 'trả lời' kỳ thi: sau tất cả các công thức và lý
thuyết, câu hỏi quan trọng nhất vẫn là *con người dùng tri thức để làm gì*.

**Hồ sơ đại học được xây từ chính hành trình.** Không phải 'hồ sơ cuối năm' — mỗi dự án, mỗi báo cáo
nghiên cứu, mỗi tác phẩm từ lớp 9 đến lớp 12 đều là một mảnh ghép. Người 18 tuổi bước ra từ tuyến này
vừa có Chứng chỉ A-Level, vừa có 'bản lý lịch của người tìm tòi' — đúng tinh thần Waldorf: một con người
tự do, biết mình, sẵn sàng học suốt đời.

