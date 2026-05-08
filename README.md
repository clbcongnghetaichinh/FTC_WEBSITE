# FTC Website - Câu lạc bộ Công nghệ Tài chính

Website chính thức của Câu lạc bộ Công nghệ Tài chính (FTC) — nơi kết nối những người đam mê FinTech tại Trường Đại học Kinh tế và Luật, ĐHQG-HCM.

## 🚀 Tính năng chính

- **Trang chủ**: Giới thiệu về câu lạc bộ với thiết kế hiện đại, responsive
- **Thông tin**: Thông tin chi tiết về câu lạc bộ, cơ cấu tổ chức
- **Thành tích**: Những thành tựu nổi bật của câu lạc bộ
- **Hoạt động**: Các sự kiện và hoạt động thú vị
- **Ứng tuyển**: Form đăng ký tham gia câu lạc bộ
- **Diễn đàn**: Nơi thảo luận và chia sẻ kiến thức, có hệ thống đăng nhập/đăng ký
- **Chatbot AI**: Trợ lý thông minh hỗ trợ tư vấn về FTC và FinTech

## 🛠️ Công nghệ sử dụng

### Frontend
| Công nghệ | Vai trò |
|-----------|----------|
| **Next.js 15** (App Router) | Framework chính |
| **React 18** + **TypeScript** | UI & type safety |
| **Tailwind CSS 4** | Styling, responsive |
| **shadcn/ui** + Radix UI | UI components |
| **Zustand** | State management (auth) |
| **React Hook Form** + Zod | Form validation |

### AI & Chatbot
| Công nghệ | Vai trò |
|-----------|----------|
| **Google Gemini API** (`gemini-2.0-flash`) | Sinh câu trả lời AI |
| **Genkit** (`@genkit-ai/core`, `@genkit-ai/googleai`) | AI pipeline/orchestration |
| **Notion API** | Knowledge base bổ trợ |

### Backend & Database
| Công nghệ | Vai trò |
|-----------|----------|
| **Next.js API Routes** | `/api/chat`, `/api/forum`, `/api/knowledge` |
| **Supabase** | Database chính (PostgreSQL) |
| **Python** (FastAPI/Flask) | Backend phụ trợ — port 5000, JWT auth |

### Dev & Deploy
| Công nghệ | Vai trò |
|-----------|----------|
| **pnpm 10** | Package manager |
| **Vercel** | Deployment (recommended) |
| **Docker** | Containerization |
| **Node.js 18–22** | Runtime |

## 📁 Cấu trúc dự án

```
├── app/                        # Next.js App Router
│   ├── api/
│   │   ├── chat/               # Chatbot AI endpoint (Gemini + FAQ)
│   │   ├── forum/              # Forum API proxy
│   │   └── knowledge/          # Knowledge base API
│   ├── chatbot/                # Trang chatbot
│   ├── co-cau/                 # Cơ cấu tổ chức
│   ├── dien-dan/               # Diễn đàn thảo luận
│   ├── forum/[id]/             # Chi tiết bài đăng
│   ├── hoat-dong/              # Hoạt động
│   ├── thanh-tich/             # Thành tích
│   ├── thong-tin/              # Thông tin CLB
│   └── ung-tuyen/              # Ứng tuyển
├── backend/                    # Python backend phụ trợ
│   └── config/supabase/        # Supabase config
├── chatbot/                    # Chatbot logic riêng
├── components/
│   ├── auth/                   # Authentication forms
│   ├── forum/                  # Forum components
│   └── ui/                     # shadcn/ui components
├── context/                    # React Context (AuthContext)
├── knowledge_base/             # Dữ liệu tri thức cho chatbot
│   ├── faq/                    # Câu hỏi thường gặp
│   ├── ftc/                    # Thông tin về FTC
│   └── fintech/                # Kiến thức FinTech
├── lib/                        # Utilities & API clients
│   ├── forumApi.ts             # Forum API client
│   ├── forumClient.ts          # HTTP client cho forum
│   └── ...
├── types/                      # TypeScript type definitions
└── public/                     # Static assets
```

## 🚀 Cài đặt và chạy

### 1. Clone repository
```bash
git clone https://github.com/TranThanhPhu39/FTC_WEBSITE_V2.git
cd FTC_WEBSITE_V2
```

### 2. Cài đặt dependencies
```bash
pnpm install
```

### 3. Cấu hình environment variables
```bash
cp .env.example .env.local
```

Cập nhật các biến môi trường:

| Biến | Mô tả |
|------|-------|
| `GEMINI_API_KEY` | API key cho Google Gemini AI |
| `GEMINI_MODEL` | Model Gemini (mặc định: `gemini-2.0-flash`) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key Supabase |
| `NEXT_PUBLIC_FORUM_API_URL` | URL API cho forum |
| `NEXT_PUBLIC_FORUM_API_TOKEN` | Token xác thực forum API |
| `NOTION_API_KEY` | API key Notion (tùy chọn) |
| `GOOGLE_API_KEY` | Google API key (tùy chọn) |

### 4. Chạy development server
```bash
pnpm dev
```

### 5. Mở trình duyệt
Truy cập [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Vercel (Khuyến nghị)
1. Fork repository này
2. Kết nối với Vercel
3. Cấu hình environment variables trong Vercel Dashboard
4. Deploy tự động khi push lên `main`

### Docker
```bash
docker compose -f docker/docker-compose.yml up
```

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

MIT License
