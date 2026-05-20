const express = require("express");

const router = express.Router();

const {
    register,
    login,
    googleAuth,
    getMe,
    forgotPassword,
    verifyOtp,
    resetPassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", authMiddleware, getMe);

// Quên mật khẩu
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
