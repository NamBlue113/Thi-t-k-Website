const { errorResponse } = require("../utils/apiResponse");

const adminMiddleware = (req, res, next) => {
    // req.user đã được điền bởi authMiddleware trước đó
    if (req.user && req.user.role === "admin") {
        next(); // Nếu là admin thì cho phép đi tiếp
    } else {
        // Nếu không phải admin thì chặn lại và báo lỗi
        return errorResponse(res, "Quyền truy cập bị từ chối. Bạn không phải là Admin!", 403);
    }
};

module.exports = adminMiddleware;