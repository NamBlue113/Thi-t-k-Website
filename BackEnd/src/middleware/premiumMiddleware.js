const asyncHandler = require("../utils/asyncHandler");

const premiumMiddleware = asyncHandler(async (req, res, next) => {

    if (!req.user) {
        const error = new Error("Unauthorized");
        error.statusCode = 401;
        throw error;
    }

    const allowedPlans = [
        "premium",
        "premium_plus",
    ];

    if (!allowedPlans.includes(req.user.plan)) {
        const error = new Error(
            "Gói premium required"
        );

        error.statusCode = 403;

        throw error;
    }

    next();
});

module.exports = premiumMiddleware;