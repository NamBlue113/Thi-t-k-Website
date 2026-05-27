const express = require("express");
const router = express.Router();

const {
    getLeaderboard,
    getProfile,
    updateProfile,
    changePassword,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

// PUBLIC
router.get("/leaderboard", getLeaderboard);

// AUTH REQUIRED
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;
