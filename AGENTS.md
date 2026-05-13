# AGENTS.md

Context ngắn gọn để AI/dev khác tiếp tục project `Thi-t-k-Website`.

## Tổng quan

Project là website luyện nghe tiếng Anh/IELTS gồm frontend static HTML/CSS/JS và backend Node.js/Express kết nối MongoDB. Frontend hiện chủ yếu là prototype UI, chưa gọi API backend. Backend hiện có CRUD cho `Lesson` và `Question`.

## Project Structure

```text
.
├── FrontEnd/
│   ├── index.html                         # Trang chính hiện đại nhất
│   ├── pages/
│   │   ├── Listening IELTS.html            # Bản prototype gần giống index, có view switcher
│   │   ├── selection.html                  # Prototype bài nghe accordion/audio
│   │   ├── topuser.html                    # Prototype bảng xếp hạng dùng Tailwind CDN
│   │   └── HTML.html                       # Demo YouTube player + chấm điểm
│   └── assets/
│       ├── js/IP frame, chấm điểm...js     # YouTube iframe + scoring Levenshtein
│       ├── css/                            # Đang trống
│       └── images/                         # Đang trống
├── BackEnd/
│   ├── app.js                              # Express app, mount routes
│   ├── server.js                           # Load env, connect MongoDB, listen PORT
│   ├── .env.example                        # Mẫu env
│   └── src/
│       ├── config/db.js                    # Mongoose connect + DNS_SERVERS optional
│       ├── controllers/
│       │   ├── lessonController.js
│       │   └── questionController.js
│       ├── models/
│       │   ├── lessonModel.js
│       │   └── questionModel.js
│       ├── routes/
│       │   ├── lessonRoutes.js
│       │   └── questionRoutes.js
│       ├── middleware/                     # Đang trống
│       ├── services/                       # Đang trống
│       └── utils/                          # Đang trống
├── Images/                                 # Đang trống
├── .postman/resources.yaml                 # Workspace Postman local view
├── README.md
├── package.json                            # Root chỉ có dotenv
└── BackEnd/package.json                    # Backend dependencies/scripts chính
```

## Tech Stack

- Frontend: static HTML, CSS inline, vanilla JavaScript.
- UI/CDN: Google Fonts, Tailwind CDN trong `topuser.html`, Font Awesome CDN trong `topuser.html`, YouTube iframe API trong demo JS.
- Backend: Node.js CommonJS, Express `5.2.1`, CORS, dotenv, Mongoose `9.6.1`, mongodb driver `7.2.0`.
- Database: MongoDB Atlas hoặc MongoDB URI tương thích Mongoose.
- Không có bundler, framework frontend, test runner, lint/format config, auth middleware, upload/storage.

## Coding Conventions

- Backend dùng CommonJS: `require`, `module.exports`.
- Route/controller/model tách theo resource trong `BackEnd/src`.
- Controller async/await, trả JSON trực tiếp, lỗi hiện trả `500` với `{ message: error.message }`.
- Schema Mongoose dùng `timestamps: true`.
- Tên file backend mới dùng camelCase dạng `lessonModel.js`, `questionController.js`.
- Frontend hiện dùng nhiều inline CSS/JS trong HTML; logic gắn qua `onclick` và DOM API vanilla.
- API base hiện mặc định backend local là `http://localhost:5000` nếu không set `PORT`.

## Completed Features

- Trang chính `FrontEnd/index.html`:
  - Home/list topic cards cho IELTS, Short Stories, Conversations, TOEIC, TOEFL, OET, IPA, Numbers...
  - Light/dark theme lưu bằng `localStorage`.
  - Mobile menu responsive.
  - Login/Register modal mock UI, chưa submit thật.
  - Exercise page động tạo 5 section accordion.
  - Với topic video: cho dán link YouTube và embed iframe.
  - Top users mock data.
- Demo scoring:
  - `FrontEnd/assets/js/IP frame, chấm điểm và hiển thị kết quả đúng sai.js` có YouTube player controls, normalize text, Levenshtein score, correct/almost/wrong UI effects.
- Backend:
  - Connect MongoDB qua Mongoose.
  - CRUD Lessons.
  - CRUD Questions.
  - `GET /api/questions` populate `lessonId`.

## Current APIs

Backend mount trong `BackEnd/app.js`:

| Method | Path | Mô tả |
| --- | --- | --- |
| POST | `/api/lessons` | Tạo lesson |
| GET | `/api/lessons` | Lấy danh sách lesson |
| GET | `/api/lessons/:id` | Lấy lesson theo Mongo ObjectId |
| PUT | `/api/lessons/:id` | Cập nhật lesson |
| DELETE | `/api/lessons/:id` | Xóa lesson |
| POST | `/api/questions` | Tạo question |
| GET | `/api/questions` | Lấy danh sách question, có populate `lessonId` |
| GET | `/api/questions/:id` | Lấy question theo Mongo ObjectId |
| PUT | `/api/questions/:id` | Cập nhật question |
| DELETE | `/api/questions/:id` | Xóa question |

### Request Body

`Lesson`:

```json
{
  "title": "IELTS Listening",
  "description": "Practice lesson"
}
```

`Question`:

```json
{
  "questionText": "What did you hear?",
  "options": ["A", "B", "C"],
  "correctAnswer": "A",
  "lessonId": "MongoObjectId"
}
```

## Important Backend Routes

- `BackEnd/src/routes/lessonRoutes.js` maps CRUD to `lessonController`.
- `BackEnd/src/routes/questionRoutes.js` maps CRUD to `questionController`.
- `BackEnd/app.js` enables `cors()` and `express.json()`.
- `BackEnd/server.js` calls `connectDB()` before `app.listen()`.

## MongoDB Setup

1. Vào `BackEnd`.
2. Chạy `npm install`.
3. Tạo `BackEnd/.env` từ `BackEnd/.env.example`.
4. Set `MONGO_URI` dạng MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
```

5. Nếu DNS Atlas bị lỗi trên máy local, set thêm:

```env
DNS_SERVERS=8.8.8.8,1.1.1.1
```

`db.js` sẽ gọi `dns.setServers(...)` nếu `DNS_SERVERS` tồn tại, rồi `mongoose.connect(process.env.MONGO_URI)`.

## Environment Variables

Trong `BackEnd/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
DNS_SERVERS=8.8.8.8,1.1.1.1
```

Không commit `BackEnd/.env`. `.gitignore` đã ignore mọi `.env`, nhưng cho phép `.env.example`.

## Run Workflow

Backend:

```bash
cd BackEnd
npm install
npm run dev
```

Hoặc:

```bash
cd BackEnd
npm start
```

Frontend:

- Có thể mở trực tiếp `FrontEnd/index.html` trong browser.
- Nếu cần test CORS/API từ browser, nên chạy static server đơn giản cho `FrontEnd/` và backend riêng ở port `5000`.

Team workflow đề xuất:

- Backend feature: tạo/sửa model -> controller -> route -> mount trong `app.js` -> test bằng Postman/curl.
- Frontend feature: ưu tiên tích hợp vào `FrontEnd/index.html`; các file trong `FrontEnd/pages/` hiện giống prototype/thử nghiệm.
- Khi thêm API mới, cập nhật ngay phần `Current APIs` trong file này.
- Không đưa secret `.env` vào commit hoặc tài liệu.
- Trước khi bàn giao: chạy backend, gọi thử các route CRUD, kiểm tra frontend mở không lỗi console.

## Current Progress

- Backend vừa được mở rộng từ lesson-only sang thêm questions.
- Worktree hiện có thay đổi chưa stage ở backend và file mới:
  - Modified: `BackEnd/app.js`, `BackEnd/package.json`, `BackEnd/server.js`, `BackEnd/src/controllers/lessonController.js`.
  - Deleted tracked: `BackEnd/src/models/Lesson.js`.
  - Untracked: `BackEnd/src/models/lessonModel.js`, `BackEnd/src/models/questionModel.js`, `BackEnd/src/controllers/questionController.js`, `BackEnd/src/routes/questionRoutes.js`, `AGENTS.md`.
- `BackEnd/package.json` là package chính để chạy server. Root `package.json` gần như không dùng cho app.

## Known Issues / Risks

- Frontend chưa gọi backend API; data topic, top users, login/register đều là mock/static.
- Chưa có auth, user model, session/JWT, Google login thật.
- Chưa có validation chi tiết; ObjectId sai format hoặc body thiếu field chủ yếu rơi vào lỗi Mongoose/500.
- `findByIdAndUpdate` chưa bật `runValidators: true`, nên update có thể bỏ qua required/schema validation.
- `lessonController.js` còn `console.log("NEW LESSON CONTROLLER RUNNING")`.
- Response format chưa đồng nhất: lesson create/update wrap `{ message, data }`, question create/update trả object trực tiếp.
- Tên model cũ `BackEnd/src/models/Lesson.js` đang bị xóa nhưng còn tracked trong git; cần đảm bảo rename/commit đúng để không vỡ import cũ.
- Chưa có test tự động, lint, formatter, CI.
- Một số file/README có dấu tiếng Việt hiển thị lỗi encoding trong terminal hiện tại; nên chuẩn hóa UTF-8 khi chỉnh nội dung.
- `Images/`, `FrontEnd/assets/css`, `FrontEnd/assets/images`, `BackEnd/src/middleware/services/utils` đang trống.
- Frontend có nhiều bản prototype trùng chức năng; cần quyết định source of truth, hiện nên coi `FrontEnd/index.html` là chính.
- `rg` bị Windows chặn quyền trong môi trường hiện tại; dùng PowerShell `Get-ChildItem`/`Select-String` nếu cần quét file.
