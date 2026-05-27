const { errorResponse } = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err.name === "ValidationError") {
        const firstError = Object.values(err.errors)[0];

        return errorResponse(
            res,
            firstError.message,
            400
        );
    }

    if (err.name === "CastError") {
        return errorResponse(
            res,
            "Invalid ID",
            400
        );
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";

        return errorResponse(
            res,
            `${field} already exists`,
            400
        );
    }

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return errorResponse(
            res,
            "Invalid or expired token",
            401
        );
    }

    return errorResponse(
        res,
        err.message || "Server Error",
        err.statusCode || 500
    );
};

module.exports = errorHandler;
