# Listening IELTS

Website luyện nghe tiếng Anh / IELTS — nghe video YouTube theo segment, gõ lại transcript, chấm điểm tự động, ôn tập spaced repetition, hỗ trợ premium.

---

## Cấu trúc thư mục

```
Thi-t-k-Website/
├── BackEnd/              # Node.js / Express / MongoDB
│   ├── src/
│   │   ├── config/       # db.js, passport.js
│   │   ├── controllers/  # Logic từng resource
│   │   ├── middleware/    # Auth, admin, error, premium
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express routers
│   │   ├── seed/         # Dữ liệu mẫu
│   │   ├── services/     # Speech, AI parsing
│   │   └── utils/        # apiResponse, asyncHandler, JWT, levenshtein…
│   ├── app.js            # Express app, mount routes, CORS
│   ├── server.js         # Entry point: connect DB → listen
│   ├── .env.example
│   └── package.json
├── FrontEnd/             # React 19 + Vite
│   ├── src/
│   │   ├── api/          # axiosInstance + interceptors
│   │   ├── components/   # UI (auth, exercise, layout, premium…)
│   │   ├── context/      # AuthContext, ThemeContext
│   │   ├── hooks/        # useExercise, usePlayer, useTopics
│   │   ├── pages/        # Home, Exercise, Admin, Profile, Review…
│   │   ├── routes/       # AppRoutes (react-router lazy)
│   │   ├── services/     # API service layer
│   │   ├── styles/       # CSS variables + global styles
│   │   └── utils/        # helpers (maskAnswer, normalizeText…)
│   ├── public/           # favicon, _redirects
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
├── netlify.toml          # Deploy config
└── README.md
```

---

## Tech Stack

| Lớp | Công nghệ |
|-----|-----------|
| Frontend | React 19, React Router 7, Vite 6, Axios |
| UI / Style | CSS custom properties, Google Fonts, Font Awesome |
| Backend | Node.js, Express 5, CommonJS |
| Auth | JWT, Google OAuth 2.0 (passport), bcryptjs |
| Database | MongoDB Atlas / Mongoose 8 |
| AI | Google Gemini, speech service |
| Email | Nodemailer (OTP quên mật khẩu) |

---

## Tính năng

- **Auth**: Đăng ký, đăng nhập (email + JWT), Google OAuth, quên mật khẩu qua OTP email.
- **Topics & Lessons**: CRUD topic, lesson với segments nhúng, YouTube URL, video/audio.
- **Luyện nghe**: YouTube iframe player đồng bộ segment, auto-pause, gõ transcript.
- **Chấm điểm thông minh**: So sánh từng từ trái sang phải. Từ đúng hiển thị nguyên bản, từ sai đầu tiên trở đi được che bằng `*` giữ nguyên độ dài — không lộ đáp án.
- **Spaced Repetition Notes**: Ghi chú Dễ / Trung bình / Khó, tự động lên lịch ôn 1-3-7 ngày.
- **Premium**: Gói 50.000₫ / 100.000₫, nội dung CK chứa USER_ID, webhook tự động kích hoạt.
- **AI Chatbox**: Gemini tutor — ngữ pháp, từ vựng, IELTS.
- **Admin Panel**: Quản lý topic, lesson, duyệt giao dịch.
- **Light / Dark theme**: localStorage.
- **Session expiry**: Token hết hạn → modal đăng nhập, không redirect mất ngữ cảnh.

---

## API Reference

Base URL: `http://localhost:5000/api`

### Auth — `/api/auth`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/register` | — | Đăng ký |
| POST | `/login` | — | Đăng nhập |
| POST | `/google` | — | Google OAuth |
| GET | `/me` | JWT | Thông tin user |
| POST | `/forgot-password` | — | Gửi OTP |
| POST | `/verify-otp` | — | Xác thực OTP |
| POST | `/reset-password` | — | Đặt lại mật khẩu |

### Topics — `/api/topics`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/` | Admin | Tạo topic |
| GET | `/` | — | Danh sách |
| GET | `/:slug` | — | Chi tiết + lessons |

### Lessons — `/api/lessons`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/` | Admin | Tạo |
| GET | `/` | — | Danh sách (`?topicSlug=`) |
| GET | `/:id` | — | Chi tiết + segments |
| PUT | `/:id` | Admin | Cập nhật |
| DELETE | `/:id` | Admin | Xóa |

### Attempts — `/api/attempts`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/check` | Optional | Chấm đáp án |
| GET | `/me` | JWT | Lịch sử làm bài |

### Notes — `/api/notes`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/` | JWT | Tạo / upsert |
| GET | `/due` | JWT | Đến hạn ôn tập |
| PUT | `/:id/reviewed` | JWT | Đánh dấu đã ôn |
| DELETE | `/:id` | JWT | Xóa |

### Transactions — `/api/transactions`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/request` | JWT | Gửi yêu cầu nâng cấp |
| GET | `/pending` | Admin | Danh sách chờ duyệt |
| POST | `/approve/:id` | Admin | Duyệt |
| POST | `/reject/:id` | Admin | Từ chối |
| POST | `/webhook` | — | Tự động xử lý từ nội dung CK |

### Users — `/api/users`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/` | Admin | Danh sách |
| PUT | `/profile` | JWT | Cập nhật profile |

### AI — `/api/ai`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/chat` | — | Chat Gemini |

### Speech — `/api/speech`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/synthesize` | — | Text-to-speech |

### Health — `/api/health`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/health` | — | Health check |

---

## Cài đặt & Chạy

### Backend

```bash
cd BackEnd
npm install
cp .env.example .env    # Sửa MONGO_URI, JWT_SECRET…
npm run dev              # Port 5000
```

### Frontend

```bash
cd FrontEnd
npm install
cp .env.example .env    # Sửa VITE_API_URL
npm run dev             # Vite dev server (5173)
npm run build           # Production → dist/
```

---

## Database

- MongoDB Atlas (production) hoặc local.
- Mongoose tự tạo collection từ schema, không cần migration.
- Field `transferContent` trên Transaction có `default: ""`, tương thích ngược.

### Environment Variables

**BackEnd** (`BackEnd/.env`):

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
DNS_SERVERS=8.8.8.8,1.1.1.1
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLIENT_URL=http://localhost:3000
```

**FrontEnd** (`FrontEnd/.env`):

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
VITE_APP_TITLE=Listening IELTS
```

---

## Coding Conventions

- **Backend**: CommonJS, async/await, `asyncHandler` wrapper, response format `{ success, data, message }`.
- **Frontend**: ES modules, React functional components, custom hooks, axios service layer, lazy loading routes.
- Tên file: `camelCase` backend, `PascalCase` React components.
- Không commit `.env`.

---

## Thay đổi gần đây (2026-06-10)

- **Chấm đáp án**: `maskAnswer()` — so sánh từng từ trái sang phải, từ sai trở đi được che `*` giữ nguyên độ dài.
- **Premium**: Nội dung CK chứa `{USER_ID} nâng cấp premium/premium+`. Webhook tự động parse + kích hoạt.
- **Note**: Token hết hạn → thông báo rõ ràng + mở login modal, không redirect mất ngữ cảnh.
