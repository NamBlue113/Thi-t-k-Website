const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const asyncHandler = require("../utils/asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
    ) {
        const error = new Error("Không có token");
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
        const error = new Error("User không tồn tại");
        error.statusCode = 401;
        throw error;
    }

    req.user = user;

    next();
});

module.exports = authMiddleware;