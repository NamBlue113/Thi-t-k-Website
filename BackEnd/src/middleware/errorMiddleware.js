const { errorResponse } = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {

    // Validation Error
    if (err.name === "ValidationError") {

        const firstError = Object.values(err.errors)[0];

        return errorResponse(
            res,
            firstError.message,
            400
        );
    }

    // Invalid Mongo ObjectId
    if (err.name === "CastError") {
        return errorResponse(
            res,
            "ID không hợp lệ",
            400
        );
    }

    return errorResponse(
        res,
        err.message || "Server Error",
        err.statusCode || 500
    );
};

module.exports = errorHandler;