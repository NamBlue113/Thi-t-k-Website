const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

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

    // Giả lập 2 khung thời gian từ cùng 1 dataset
    const last7Days = [...formatted].sort(() => Math.random() - 0.5);
    const last30Days = [...formatted].sort(() => Math.random() - 0.5);

    return successResponse(res, { last7Days, last30Days }, "Leaderboard fetched");
});

module.exports = { getLeaderboard };
