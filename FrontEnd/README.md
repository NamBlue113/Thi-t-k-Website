# Frontend React — Listening IELTS

## 🚀 Quick Start

```bash
# 1. Cài đặt dependencies
cd FrontEnd
npm install

# 2. Tạo file .env từ mẫu
cp .env.example .env
# Sửa VITE_API_URL thành URL backend của bạn

# 3. Chạy dev server
npm run dev

# 4. Build production
npm run build
npm run preview
```

## 📁 Cấu trúc thư mục

```
FrontEnd/
├── index.html              # Vite entry point
├── package.json
├── vite.config.js
├── netlify.toml            # Netlify deploy config
├── .env                    # Biến môi trường (KHÔNG commit)
├── .env.example            # Mẫu biến môi trường
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Root component + providers
    ├── api/
    │   └── axiosInstance.js    # Axios config + interceptors
    ├── services/               # API service layer
    │   ├── authService.js
    │   ├── topicService.js
    │   ├── attemptService.js
    │   ├── aiService.js
    │   └── speechService.js
    ├── context/                # Global state
    │   ├── AuthContext.jsx      # Auth state (login, register, JWT)
    │   └── ThemeContext.jsx     # Light/Dark theme
    ├── hooks/                  # Custom hooks
    │   ├── useTopics.js         # Fetch + filter topics
    │   ├── useExercise.js       # Section loading + answer checking
    │   └── usePlayer.js         # YouTube/Audio player logic
    ├── components/
    │   ├── layout/              # Navbar, MobileMenu, Footer
    │   ├── topic/               # TopicCard, TopicGrid, FilterTabs, SearchBar
    │   ├── exercise/            # ExercisePlayer, VideoPlayer, AudioPlayer, AnswerInput
    │   ├── auth/                # LoginModal, RegisterModal
    │   ├── premium/             # PremiumModal, PremiumBadge
    │   ├── leaderboard/         # LeaderboardCard
    │   └── ui/                  # LoadingSpinner, ErrorMessage, EmptyState, Toast
    ├── pages/
    │   ├── HomePage.jsx         # Trang chủ — topics từ API
    │   ├── ExercisePage.jsx     # Trang làm bài tập
    │   ├── TopUsersPage.jsx     # Bảng xếp hạng
    │   └── NotFoundPage.jsx     # 404
    ├── routes/
    │   └── AppRoutes.jsx        # React Router config + lazy loading
    ├── styles/
    │   ├── variables.css        # CSS custom properties (theme)
    │   └── index.css            # Toàn bộ styles (giữ UI cũ)
    └── utils/
        ├── constants.js         # API_URL, STORAGE_KEYS, FILTERS
        └── helpers.js           # extractYoutubeId, normalizeText, etc.
```

## 🔌 API Integration

Frontend gọi các API sau từ backend:

| Method | Endpoint | Dùng ở đâu |
|--------|----------|------------|
| GET | `/api/topics` | HomePage — danh sách topics |
| GET | `/api/topics/:id/sections` | ExercisePage — sections cho topic |
| POST | `/api/attempts/check` | submitAnswer — chấm bài |
| POST | `/api/auth/register` | RegisterModal |
| POST | `/api/auth/login` | LoginModal |
| GET | `/api/auth/me` | AuthContext — kiểm tra session |

## 🎨 Theme System

- CSS Variables trong `variables.css` — 1 file duy nhất
- `ThemeContext` quản lý light/dark
- Class `body.is-premium` để đổi style premium (gold)
- Tất cả responsive breakpoints giữ nguyên từ bản cũ

## 🧩 Component Pattern

Mỗi component:
- Nhận props rõ ràng
- Không hardcode data
- Render từ API/service
- Có loading/error/empty states
- Reusable tối đa

Ví dụ `TopicCard`:
```jsx
<TopicCard topic={topic} index={0} onClick={handleClick} />
```
— Nhận topic object từ API, render động tất cả fields.

## 🚢 Deploy lên Netlify

### Cách 1: Netlify CLI

```bash
npm install -g netlify-cli
cd FrontEnd
npm run build
netlify deploy --prod --dir=dist
```

### Cách 2: Netlify Git

1. Push code lên GitHub
2. Vào [app.netlify.com](https://app.netlify.com) → Add new site → Import an existing project
3. Chọn repository
4. Build settings:
   - **Base directory:** `FrontEnd`
   - **Build command:** `npm run build`
   - **Publish directory:** `FrontEnd/dist`
5. Environment variables:
   - `VITE_API_URL` = `https://thi-t-k-website.onrender.com/api`
6. Deploy!

## 👥 Team Workflow

### Git Branch Strategy

```
main ← production, luôn deploy-ready
├── develop ← integration branch
│   ├── feature/topic-page
│   ├── feature/exercise-player
│   ├── feature/leaderboard
│   └── fix/...
└── hotfix/...
```

### File Ownership (tránh conflict)

| Folder | Owner | Mô tả |
|--------|-------|-------|
| `src/services/` | Backend Dev | API contracts |
| `src/components/topic/` | Frontend Dev A | Topic UI |
| `src/components/exercise/` | Frontend Dev B | Player system |
| `src/components/auth/` | Frontend Dev C | Auth UI |
| `src/styles/` | UI Lead | CSS/Theme |
| `src/pages/` | Team Lead | Page assembly |

### Onboarding thành viên mới

1. Clone repo → `cd FrontEnd` → `npm install`
2. Copy `.env.example` → `.env`
3. `npm run dev` — chạy local
4. Đọc file này + `src/utils/constants.js`
5. Xem component mẫu: `TopicCard` là pattern chuẩn
6. Bắt đầu từ component nhỏ trong `components/ui/`

### Code Review Checklist

- [ ] Component nhận props, không hardcode
- [ ] Có loading/error/empty state
- [ ] Dùng CSS variables (không hardcode màu)
- [ ] Responsive trên mobile
- [ ] Không gọi API trực tiếp — dùng service layer
- [ ] Auth state từ `useAuth()`, không từ localStorage trực tiếp
- [ ] File < 300 dòng (nếu dài hơn → tách component)

## 🔐 Auth Flow

```
1. User click Login → LoginModal mở
2. Nhập email/password → authService.login()
3. Backend trả JWT token + user data
4. AuthContext lưu token vào localStorage
5. Axios interceptor tự động gắn Bearer token
6. GET /api/auth/me để verify session
7. Logout → xóa localStorage → redirect home
```

## ⚡ Performance

- `React.lazy()` + `Suspense` cho code splitting từng page
- Vite native ESM dev server
- Production build minify + tree shaking
- Không dùng thư viện CSS framework nặng
- CSS variables native, không runtime CSS-in-JS

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_APP_TITLE` | App title | `Listening IELTS` |
