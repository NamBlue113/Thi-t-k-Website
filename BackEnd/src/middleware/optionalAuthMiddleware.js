const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const asyncHandler = require("../utils/asyncHandler");

const optionalAuthMiddleware = asyncHandler(
    async (req, res, next) => {

        const authHeader =
            req.headers.authorization;

        if (
            authHeader &&
            authHeader.startsWith("Bearer ")
        ) {
            const token =
                authHeader.split(" ")[1];

            try {

                const decoded = jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );

                const user = await User.findById(
                    decoded.id
                ).select("-password");

                req.user = user;

            } catch (error) {
                req.user = null;
            }
        }

        next();
    }
);

module.exports = optionalAuthMiddleware;