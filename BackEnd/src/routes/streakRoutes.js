const express = require("express");
const router = express.Router();

const { getStreak } = require("../controllers/streakController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/streak — lay streak cua user (can dang nhap)
router.get("/", authMiddleware, getStreak);

module.exports = router;
