const bcrypt = require("bcryptjs");

const User = require("../models/userModel");

const generateToken = require("../utils/generateToken");

const asyncHandler = require("../utils/asyncHandler");

const {
    successResponse,
    errorResponse,
} = require("../utils/apiResponse");


// REGISTER
const register = asyncHandler(async (req, res) => {

    const {
        nickname,
        email,
        password,
    } = req.body;

    if (
        !nickname ||
        !email ||
        !password
    ) {
        return errorResponse(
            res,
            "Vui lòng nhập đầy đủ thông tin",
            400
        );
    }

    const existingUser = await User.findOne({
        email,
    });

    if (existingUser) {
        return errorResponse(
            res,
            "Email đã tồn tại",
            400
        );
    }

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    const user = await User.create({
        nickname,
        email,
        password: hashedPassword,
    });

    const token = generateToken(user._id);

    return successResponse(
        res,
        {
            token,
            user: {
                id: user._id,
                nickname: user.nickname,
                email: user.email,
                plan: user.plan,
                role: user.role,
            },
        },
        "Đăng ký thành công",
        201
    );
});


// LOGIN
const login = asyncHandler(async (req, res) => {

    const {
        email,
        password,
    } = req.body;

    const user = await User.findOne({
        email,
    });

    if (!user) {
        return errorResponse(
            res,
            "Email hoặc mật khẩu không đúng",
            401
        );
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        return errorResponse(
            res,
            "Email hoặc mật khẩu không đúng",
            401
        );
    }

    const token = generateToken(user._id);

    return successResponse(
        res,
        {
            token,
            user: {
                id: user._id,
                nickname: user.nickname,
                email: user.email,
                plan: user.plan,
                role: user.role,
            },
        },
        "Đăng nhập thành công"
    );
});


// GET ME
const getMe = asyncHandler(async (req, res) => {

    return successResponse(
        res,
        req.user,
        "Lấy thông tin user thành công"
    );
});

module.exports = {
    register,
    login,
    getMe,
};