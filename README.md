# FTC Website - Câu lạc bộ Công nghệ Tài chính

Website chính thức của Câu lạc bộ Công nghệ Tài chính (FTC) - Nơi kết nối những người đam mê fintech tại Trường Đại học Kinh tế – Luật, ĐHQG-HCM.

## 🚀 Tính năng chính

- **Trang chủ**: Giới thiệu về câu lạc bộ với thiết kế hiện đại và responsive
- **Thông tin**: Thông tin chi tiết về câu lạc bộ, cơ cấu tổ chức
- **Thành tích**: Những thành tựu nổi bật của câu lạc bộ
- **Hoạt động**: Các sự kiện và hoạt động thú vị
- **Ứng tuyển**: Form đăng ký tham gia câu lạc bộ
- **Diễn đàn**: Nơi thảo luận và chia sẻ kiến thức với hệ thống đăng nhập/đăng ký
- **Chatbot AI**: Trợ lý thông minh hỗ trợ tư vấn về FTC và FinTech, hoạt động 24/7

## 🛠️ Công nghệ sử dụng

### Frontend
- **Next.js 15** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS 4** — styling responsive
- **shadcn/ui** + **Radix UI** — UI components
- **Zustand** — state management (auth)
- **React Hook Form** + **Zod** — form validation

### Backend & Database
- **Next.js API Routes** — `/api/chat`, `/api/forum`, `/api/knowledge`
- **Supabase** — database chính (đã thay thế Google Sheets)
- **Python** (Flask) — backend phụ trợ, port 5000, JWT auth

### AI & Chatbot
- **Google Gemini API** (`gemini-2.0-flash`) — mô hình ngôn ngữ cho chatbot
- **Genkit** (`@genkit-ai/core`, `@genkit-ai/googleai`) — AI pipeline/orchestration
- **RAG System** — Retrieval-Augmented Generation từ knowledge base nội bộ
- **FAQ Matching** — keyword index + Jaccard similarity cho câu hỏi thường gặp

### Dev & Deploy
- **pnpm 10** — package manager
- **Vercel** — deployment
- **Docker** — containerization
- **Node.js 18–22**

## 📁 Cấu trúc dự án

```
├── app/                        # Next.js App Router
│   ├── api/
│   │   ├── chat/               # Chatbot API (Gemini + FAQ matching)
│   │   ├── forum/              # Forum API proxy
│   │   └── knowledge/          # Knowledge base API
│   ├── chatbot/                # Trang chatbot
│   ├── dien-dan/ & forum/      # Diễn đàn thảo luận
│   ├── thong-tin/              # Thông tin câu lạc bộ
│   ├── thanh-tich/             # Thành tích
│   ├── hoat-dong/              # Hoạt động
│   ├── ung-tuyen/              # Ứng tuyển
│   └── co-cau/                 # Cơ cấu tổ chức
├── backend/                    # Python backend phụ trợ
│   └── config/supabase/        # Supabase config
├── chatbot/                    # Chatbot router & type definitions
├── components/
│   ├── auth/                   # Authentication forms
│   ├── forum/                  # Forum components
│   └── ui/                     # shadcn/ui components
├── context/                    # React Context (AuthContext)
├── knowledge_base/             # Dữ liệu RAG cho chatbot
│   ├── faq/                    # Câu hỏi thường gặp
│   ├── ftc/                    # Thông tin CLB (general, departments, activities)
│   └── fintech/                # Kiến thức FinTech cơ bản
├── lib/                        # Utilities & API clients
├── prompts/                    # System prompts cho Gemini
├── types/                      # TypeScript type definitions
└── public/                     # Static assets
```

## 🚀 Cài đặt và chạy

1. **Clone repository**
   ```bash
   git clone https://github.com/TranThanhPhu39/FTC_WEBSITE_V2.git
   cd FTC_WEBSITE_V2
   ```

2. **Cài đặt dependencies**
   ```bash
   pnpm install
   ```

3. **Cấu hình environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Cập nhật các biến môi trường:
   ```env
   GEMINI_API_KEY=           # API key cho Google Gemini
   GEMINI_MODEL=             # Mặc định: gemini-2.0-flash
   NEXT_PUBLIC_FORUM_API_URL=    # URL API cho forum (Supabase endpoint)
   NEXT_PUBLIC_FORUM_API_TOKEN=  # Token xác thực API forum
   ```

4. **Chạy development server**
   ```bash
   pnpm dev
   ```

5. **Mở trình duyệt**
   Truy cập [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Vercel (Khuyến nghị)

1. Fork repository này
2. Kết nối với Vercel
3. Cấu hình environment variables trong Vercel Dashboard
4. Deploy tự động khi push lên `main`

## 🤖 Kiến trúc Chatbot

Chatbot hoạt động theo 2 mode:

- **Club mode**: Trả lời câu hỏi về FTC (cơ cấu, hoạt động, tuyển dụng...). Ưu tiên FAQ matching nội bộ trước, sau đó mới gọi Gemini với system prompt cụ thể.
- **Industry mode**: Trả lời câu hỏi tổng quát về FinTech (khái niệm, xu hướng, công nghệ...).

Mode được tự động phát hiện qua keyword matching (normalize + từ khóa tiếng Việt không dấu).

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📞 Liên hệ

- **Website**: [https://ftc-website.vercel.app](https://ftc-website.vercel.app)
- **Fanpage**: [https://www.facebook.com/clbfintechuel](https://www.facebook.com/clbfintechuel)
- **Email**: clbcongnghetaichinh@st.uel.edu.vn

## 📄 License

MIT License
