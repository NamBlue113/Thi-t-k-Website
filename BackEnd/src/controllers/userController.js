const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// Hàm tạo activeTime ngẫu nhiên để demo
const randomTime = () => {
    const hours = Math.floor(Math.random() * 40) + 1;
    const mins = Math.floor(Math.random() * 60);
    return `${hours}h ${mins}m`;
};

// GET LEADERBOARD
const getLeaderboard = asyncHandler(async (req, res) => {
    const users = await User.find()
        .select("username email plan createdAt")
        .sort({ createdAt: -1 })
        .limit(30);

    const formatted = users.map((u, i) => ({
        _id: u._id,
        username: u.username,
        email: u.email,
        plan: u.plan,
        activeTime: randomTime(),
        rank: i + 1,
    }));

    const last7Days = [...formatted].sort(() => Math.random() - 0.5);
    const last30Days = [...formatted].sort(() => Math.random() - 0.5);

    return successResponse(res, { last7Days, last30Days }, "Leaderboard fetched");
});

// GET PROFILE
const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return errorResponse(res, "User not found", 404);
    return successResponse(res, user, "Profile fetched");
});

// UPDATE PROFILE (tên)
const updateProfile = asyncHandler(async (req, res) => {
    const { username } = req.body;
    if (!username || !username.trim()) {
        return errorResponse(res, "Username is required", 400);
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { username: username.trim() },
        { new: true, runValidators: true }
    ).select("-password");

    if (!user) return errorResponse(res, "User not found", 404);
    return successResponse(res, user, "Profile updated");
});

// CHANGE PASSWORD
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return errorResponse(res, "Old password and new password are required", 400);
    }
    if (newPassword.length < 6) {
        return errorResponse(res, "New password must be at least 6 characters", 400);
    }

    const user = await User.findById(req.user._id);
    if (!user) return errorResponse(res, "User not found", 404);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return errorResponse(res, "Old password is incorrect", 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return successResponse(res, null, "Password changed successfully");
});

module.exports = { getLeaderboard, getProfile, updateProfile, changePassword };
