const express = require("express");
const router = express.Router();

const {createLesson, getLessons, getLessonById, updateLesson, deleteLesson,} = require("../controllers/lessonController");

// Import các middleware bảo mật của bạn
const authMiddleware = require("../middleware/authMiddleware");
const premiumMiddleware = require("../middleware/premiumMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
// Lưu ý: Giả sử bạn có middleware check admin trong authMiddleware hoặc viết riêng

// --- NHÓM API ĐỌC (Ai cũng xem được danh sách, nhưng vào chi tiết bài VIP thì tính sau) ---
router.get("/", getLessons);
router.get("/:id", getLessonById); // Trong Controller của hàm này bạn sẽ check nếu bài là premium thì bắt tài khoản VIP mới cho xem dữ liệu chi tiết.

// --- NHÓM API QUẢN TRỊ (Chỉ Admin mới có quyền Thêm, Sửa, Xóa) ---
// Bạn chèn authMiddleware để lấy thông tin user, sau đó chèn middleware check admin (ví dụ:isAdmin)
// Ở đây mình tạm thời ví dụ nếu bạn dùng authMiddleware để xác thực trước:
router.post("/", authMiddleware, adminMiddleware, createLesson);
router.put("/:id", authMiddleware, adminMiddleware, updateLesson);
router.delete("/:id", authMiddleware, adminMiddleware, deleteLesson);

module.exports = router;