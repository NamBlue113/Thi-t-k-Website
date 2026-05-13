# Thiết Kế Website

## Cấu trúc thư mục

- `FrontEnd/`: giao diện và các file HTML/JS phía client.
- `BackEnd/`: API/server Node.js (Express).
- `Images/`: tài nguyên ảnh.
- `.postman/`: cấu hình workspace Postman (nếu sử dụng).



==================================================
PROJECT STRUCTURE
==================================================

Thi-t-k-Website/
├── BackEnd/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── topicController.js
│       │   ├── lessonController.js
│       │   ├── questionController.js
│       │   └── ...
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   ├── optionalAuthMiddleware.js
│       │   ├── premiumMiddleware.js
│       │   └── errorMiddleware.js
│       ├── models/
│       │   ├── userModel.js
│       │   ├── topicModel.js
│       │   ├── sectionModel.js
│       │   ├── lessonModel.js
│       │   ├── questionModel.js
│       │   └── ...
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── topicRoutes.js
│       │   ├── lessonRoutes.js
│       │   ├── questionRoutes.js
│       │   └── ...
│       ├── seed/
│       │   └── seed.js
│       └── utils/
│           ├── apiResponse.js
│           ├── asyncHandler.js
│           ├── generateToken.js
│           ├── normalizeText.js
│           └── levenshtein.js
│
├── FrontEnd/
│   ├── webupdate3.html
│   └── assets/
│       └── js/
│
└── AGENTS.md

