# 🤖 AI Hub - Thư viện Công cụ AI Đẳng cấp

![AI Hub Demo](./public/demo.png)

AI Hub là một nền tảng hiện đại giúp người dùng khám phá, đánh giá và quản lý các công cụ Trí tuệ nhân tạo (AI) hàng đầu hiện nay. Dự án được xây dựng với hiệu suất cao, giao diện premium và hệ thống quản trị mạnh mẽ.

## ✨ Tính năng nổi bật

### 🎨 Giao diện người dùng (Frontend)
- **Thiết kế Hiện đại**: Giao diện Dark Mode sang trọng với hiệu ứng Glassmorphism và mượt mà bằng Framer Motion.
- **Tìm kiếm thông minh**: Tìm kiếm công cụ AI tức thì với tính năng Debounce tối ưu hiệu suất.
- **Lọc theo Chuyên mục**: Phân loại AI theo nhiều lĩnh vực (Chatbot, Hình ảnh, Lập trình, Video...).
- **Hệ thống Đánh giá**: Người dùng có thể gửi nhận xét và chấm điểm sao cho từng công cụ.
- **Phân trang Server-side**: Đảm bảo tốc độ tải trang cực nhanh dù dữ liệu lớn.

### �️ Quản trị viên (Admin Panel)
- **Thống kê tổng quan**: Theo dõi số lượng AI, nhận xét và các mục chờ duyệt thông qua Dashboard.
- **Quản lý linh hoạt**: Thêm, sửa, xóa công cụ AI với giao diện trực quan.
- **Kiểm duyệt thông minh**: Duyệt các đề xuất AI từ cộng đồng chỉ với một click.
- **Nhập hàng loạt (Bulk Import)**: Hỗ trợ nạp hàng trăm dữ liệu thông qua định dạng JSON với bộ lọc trùng lặp thông minh.
- **Xóa hàng loạt**: Tính năng chọn nhiều (Checkbox) và xóa nhanh giúp quản lý cơ sở dữ liệu dễ dàng.
- **Chuyên mục linh hoạt**: Hỗ trợ Combobox thông minh giúp chọn mẫu có sẵn hoặc tự tạo chuyên mục mới ngay lập tức.

## 🛠️ Công nghệ sử dụng

- **Framework**: [Next.js 14/15](https://nextjs.org/) (App Router)
- **Ngôn ngữ**: TypeScript
- **Cơ sở dữ liệu**: MongoDB & Mongoose
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🚀 Cài đặt và Chạy thử

### 1. Clone dự án
```bash
git clone <your-repo-url>
cd demo
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env.local` tại thư mục gốc và thêm:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
```

### 4. Chạy chế độ Development
```bash
npm run dev
```
Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 📦 Deployment

### Vercel
Dự án được tối ưu hóa hoàn hảo để chạy trên Vercel. Bạn chỉ cần kết nối repo GitHub và thêm biến `MONGODB_URI` vào Environment Variables.

---
*Phát triển bởi TerisC (Antigravity Assistant)*
