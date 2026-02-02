# Kế hoạch Triển khai: Web Tổng hợp Công cụ AI

> **Mục tiêu**: Xây dựng nền tảng web tổng hợp, giới thiệu và đánh giá các công cụ AI, tương tự như các danh bạ AI phổ biến hiện nay.

## 1. Công nghệ (Tech Stack)

Để đảm bảo SEO tốt (quan trọng cho web tổng hợp) và hiệu năng cao:

-   **Framework**: Next.js 15 (App Router)
    -   *Lý do*: Tối ưu SEO tự động, server-side rendering cho tốc độ tải trang nhanh.
-   **Ngôn ngữ**: TypeScript & JavaScript (React).
-   **Styling**: Vanilla CSS (CSS Modules).
    -   *Phong cách*: Premium, Glassmorphism (hiệu ứng kính), chuyển động mượt mà (micro-animations).
    -   *Theme*: Dark Mode mặc định (giao diện công nghệ/AI).
-   **Dữ liệu**: File JSON (ban đầu) -> Database (SQLite/Supabase sau này).

## 2. Tính năng Cốt lõi (MVP)

### A. Giao diện Người dùng (Frontend)
1.  **Trang chủ (Home)**:
    -   **Hero Section**: Slogan ấn tượng, thanh tìm kiếm lớn.
    -   **Categories**: Phân loại theo thẻ (Chatbot, Image, Code, Audio, Video...).
    -   **Featured/Trending**: Lưới các công cụ AI nổi bật (Card design).
2.  **Chi tiết Công cụ (Tool Detail)**:
    -   Thông tin chi tiết, ảnh screenshot, giá cả (Free/Paid).
    -   Nút "Truy cập Website".
    -   Gợi ý công cụ tương tự.
3.  **Gửi công cụ (Submit)**: Form đơn giản để người dùng đóng góp công cụ mới.

### B. Quản trị (Admin - Giai đoạn 2)
-   Duyệt công cụ người dùng gửi.
-   Chỉnh sửa thông tin.

## 3. Lộ trình Thực hiện (Roadmap)

### Phase 1: Khởi tạo & Giao diện (Ngày 1)
-   [ ] Khởi tạo dự án Next.js (`/create`).
-   [ ] Thiết lập Design System (CSS Variables, màu sắc, font chữ).
-   [ ] Xây dựng Layout chung (Header, Footer).

### Phase 2: Chức năng hiển thị (Ngày 1-2)
-   [ ] Tạo dữ liệu mẫu (Mock Data) các tool AI.
-   [ ] Xây dựng Component: `ToolCard`, `CategoryPill`, `SearchBar`.
-   [ ] Dựng trang chủ và trang danh sách.

### Phase 3: Chi tiết & Hoàn thiện (Ngày 2-3)
-   [ ] Dựng trang chi tiết (Dynamic Routing).
-   [ ] Tối ưu SEO (Meta tags, OpenGraph).
-   [ ] Hiệu ứng & Polish (Animations).

## 4. Yêu cầu xác nhận từ User

1.  Bạn có đồng ý sử dụng **Next.js** không? (Tốt nhất cho loại web này).
2.  Bạn có yêu cầu màu sắc chủ đạo nào không? (Mặc định tôi sẽ dùng tông Tím/Xanh Neon đậm chất AI).
