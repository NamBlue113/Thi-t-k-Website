const express = require("express");
const router = express.Router();

const { checkAnswer, getUserAttempts } = require("../controllers/attemptController");
const optionalAuthMiddleware = require("../middleware/optionalAuthMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Check answer (có thể không cần login)
router.post("/check", optionalAuthMiddleware, checkAnswer);

// Xem lịch sử làm bài (cần login)
router.get("/me", authMiddleware, getUserAttempts);

module.exports = router;
