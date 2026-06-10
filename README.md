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
├── .postman/
│   └── resources.yaml
├── BackEnd/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── passport.js
│   │   ├── controllers/
│   │   │   ├── aiController.js
│   │   │   ├── attemptController.js
│   │   │   ├── authController.js
│   │   │   ├── lessonController.js
│   │   │   ├── noteController.js
│   │   │   ├── speechController.js
│   │   │   ├── topicController.js
│   │   │   ├── transactionController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── adminMiddleware.js
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   ├── optionalAuthMiddleware.js
│   │   │   └── premiumMiddleware.js
│   │   ├── models/
│   │   │   ├── attemptModel.js
│   │   │   ├── lessonModel.js
│   │   │   ├── noteModel.js
│   │   │   ├── otpModel.js
│   │   │   ├── topicModel.js
│   │   │   ├── transactionModel.js
│   │   │   └── userModel.js
│   │   ├── routes/
│   │   │   ├── aiRoutes.js
│   │   │   ├── attemptRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── lessonRoutes.js
│   │   │   ├── noteRoutes.js
│   │   │   ├── speechRoutes.js
│   │   │   ├── topicRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── seed/
│   │   │   └── seed.js
│   │   ├── services/
│   │   │   └── speechService.js
│   │   └── utils/
│   │       ├── AI_DATABASE_SCHEMA.md
│   │       ├── apiResponse.js
│   │       ├── asyncHandler.js
│   │       ├── exportSchema.js
│   │       ├── generateToken.js
│   │       ├── levenshtein.js
│   │       └── normalizeText.js
│   ├── .env
│   ├── .env.example
│   ├── app.js
│   ├── backend@1.0.0
│   ├── createAdmin.js
│   ├── node
│   ├── npm
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── vercel.json
├── FrontEnd/
│   ├── dist/
│   │   ├── assets/
│   │   │   ├── ErrorMessage-C3-fPdT4.js
│   │   │   ├── ExercisePage-CUz8TLGx.js
│   │   │   ├── helpers-SO1j90e0.js
│   │   │   ├── HomePage-BKVr0VMF.js
│   │   │   ├── index-BegRUUp2.css
│   │   │   ├── index-ZLylSCyQ.js
│   │   │   ├── NotFoundPage-mgAk7MoW.js
│   │   │   └── TopUsersPage-DipxwHng.js
│   │   ├── favicon.svg
│   │   └── index.html
│   ├── public/
│   │   ├── _redirects
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AddLessonForm.jsx
│   │   │   │   ├── AddTopicForm.jsx
│   │   │   │   └── EditLessonForm.jsx
│   │   │   ├── auth/
│   │   │   │   ├── ForgotPasswordModal.jsx
│   │   │   │   ├── LoginModal.jsx
│   │   │   │   └── RegisterModal.jsx
│   │   │   ├── exercise/
│   │   │   │   ├── AnswerInput.jsx
│   │   │   │   ├── AudioPlayer.jsx
│   │   │   │   ├── ExercisePlayer.jsx
│   │   │   │   ├── ResultDisplay.jsx
│   │   │   │   ├── SegmentPlayer.jsx
│   │   │   │   └── VideoPlayer.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── MobileMenu.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   ├── leaderboard/
│   │   │   │   └── LeaderboardCard.jsx
│   │   │   ├── premium/
│   │   │   │   ├── PremiumBadge.jsx
│   │   │   │   └── PremiumModal.jsx
│   │   │   ├── topic/
│   │   │   │   ├── FilterTabs.jsx
│   │   │   │   ├── PremiumBanner.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── TopicCard.jsx
│   │   │   │   └── TopicGrid.jsx
│   │   │   └── ui/
│   │   │       ├── AIChatbox.jsx
│   │   │       ├── EmptyState.jsx
│   │   │       ├── ErrorMessage.jsx
│   │   │       ├── LoadingSpinner.jsx
│   │   │       └── Toast.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   ├── useExercise.js
│   │   │   ├── usePlayer.js
│   │   │   └── useTopics.js
│   │   ├── pages/
│   │   │   ├── AdminPage.jsx
│   │   │   ├── AdminTransactionsPage.jsx
│   │   │   ├── ExercisePage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── ReviewDashboard.jsx
│   │   │   ├── TopicDetailPage.jsx
│   │   │   └── TopUsersPage.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   ├── attemptService.js
│   │   │   ├── authService.js
│   │   │   ├── lessonService.js
│   │   │   ├── noteService.js
│   │   │   ├── speechService.js
│   │   │   ├── topicService.js
│   │   │   └── transactionService.js
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   └── variables.css
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── netlify.toml
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── vite.config.js
├── Images/
├── .gitignore
├── AGENTS.md
├── mainui.html
├── netlify.toml
├── package.json
├── package-lock.json
└── README.md