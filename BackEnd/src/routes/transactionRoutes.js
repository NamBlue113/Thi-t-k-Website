const express = require("express");
const router = express.Router();

const {
    requestUpgrade,
    getPending,
    approveTransaction,
    rejectTransaction,
    processWebhook,
} = require("../controllers/transactionController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// USER: gửi yêu cầu nâng cấp (cần đăng nhập)
router.post("/request", authMiddleware, requestUpgrade);

// ADMIN: xem danh sách chờ duyệt
router.get("/pending", authMiddleware, adminMiddleware, getPending);

// ADMIN: duyệt
router.post("/approve/:id", authMiddleware, adminMiddleware, approveTransaction);

// ADMIN: từ chối
router.post("/reject/:id", authMiddleware, adminMiddleware, rejectTransaction);

// WEBHOOK: auto-process transfer from bank notification (public endpoint)
router.post("/webhook", processWebhook);

module.exports = router;
