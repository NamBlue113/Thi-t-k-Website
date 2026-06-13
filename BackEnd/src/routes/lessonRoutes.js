const express = require("express");
const router = express.Router();

const {createLesson, getLessons, getLessonById, updateLesson, deleteLesson,} = require("../controllers/lessonController");

// Import các middleware bảo mật của bạn
const authMiddleware = require("../middleware/authMiddleware");
const premiumMiddleware = require("../middleware/premiumMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const optionalAuthMiddleware = require("../middleware/optionalAuthMiddleware");

// --- NHÓM API ĐỌC (Ai cũng xem được danh sách, nhưng vào chi tiết bài VIP thì check plan) ---
router.get("/", getLessons);
router.get("/:id", optionalAuthMiddleware, getLessonById); // optionalAuthMiddleware giúp lấy req.user nếu có token, để controller check premium

// --- NHÓM API QUẢN TRỊ (Chỉ Admin mới có quyền Thêm, Sửa, Xóa) ---
// Bạn chèn authMiddleware để lấy thông tin user, sau đó chèn middleware check admin (ví dụ:isAdmin)
// Ở đây mình tạm thời ví dụ nếu bạn dùng authMiddleware để xác thực trước:
router.post("/", authMiddleware, adminMiddleware, createLesson);
router.put("/:id", authMiddleware, adminMiddleware, updateLesson);
router.delete("/:id", authMiddleware, adminMiddleware, deleteLesson);

module.exports = router;