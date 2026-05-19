const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// Hàm chuyển đổi format dữ liệu trả về cho Client
const toAuthUser = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    plan: user.plan || "free",
    role: user.role,
});

// REGISTER
const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body; // Đổi nickname -> username

    if (!username || !email || !password) {
        return errorResponse(res, "Username, email and password are required", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        return errorResponse(res, "Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo bản ghi lưu xuống MongoDB
    const user = await User.create({
        username: username.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        // role và accountType tự động lấy giá trị default ('user' và 'free')
    });

    const token = generateToken(user._id);

    return successResponse( res,{ token,user: toAuthUser(user),},"Registered successfully",201);
});

// LOGIN
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return errorResponse(res, "Email and password are required", 400);
    }

    const user = await User.findOne({email: email.trim().toLowerCase(),});

    if (!user) {
        return errorResponse(res, "Email or password is incorrect", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return errorResponse(res, "Email or password is incorrect", 401);
    }

    const token = generateToken(user._id);

    return successResponse(res,{token,user: toAuthUser(user),}, "Logged in successfully");
});

// GET ME
const getMe = asyncHandler(async (req, res) => {
    return successResponse(res, toAuthUser(req.user), "User fetched successfully");
});

module.exports = {
    register,
    login,
    getMe,
};