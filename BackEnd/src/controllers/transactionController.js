const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// USER: Gửi yêu cầu nâng cấp
const requestUpgrade = asyncHandler(async (req, res) => {
    const { packageType, amount } = req.body;

    if (!packageType || !["premium", "premium_plus"].includes(packageType)) {
        return errorResponse(res, "packageType must be 'premium' or 'premium_plus'", 400);
    }
    if (!amount || (amount !== 50000 && amount !== 100000)) {
        return errorResponse(res, "Invalid amount", 400);
    }

    // Kiểm tra user đã có yêu cầu pending chưa
    const existing = await Transaction.findOne({
        userId: req.user._id,
        status: "pending",
    });
    if (existing) {
        return errorResponse(res, "Bạn đã có một yêu cầu đang chờ duyệt. Vui lòng chờ Admin xử lý.", 400);
    }

    const transaction = await Transaction.create({
        userId: req.user._id,
        username: req.user.username,
        email: req.user.email,
        packageType,
        amount,
        status: "pending",
    });

    return successResponse(res, transaction, "Yêu cầu nâng cấp đã được gửi. Vui lòng chờ Admin duyệt.", 201);
});

// ADMIN: Lấy danh sách pending
const getPending = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({ status: "pending" })
        .sort({ createdAt: -1 });

    return successResponse(res, transactions, "Pending transactions fetched");
});

// ADMIN: Duyệt
const approveTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        return errorResponse(res, "Transaction not found", 404);
    }
    if (transaction.status !== "pending") {
        return errorResponse(res, "Transaction is not pending", 400);
    }

    // Cập nhật trạng thái
    transaction.status = "approved";
    await transaction.save();

    // Cập nhật plan của User
    await User.findByIdAndUpdate(transaction.userId, {
        plan: transaction.packageType,
    });

    return successResponse(res, transaction, "Transaction approved. User plan updated.");
});

// ADMIN: Từ chối
const rejectTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        return errorResponse(res, "Transaction not found", 404);
    }
    if (transaction.status !== "pending") {
        return errorResponse(res, "Transaction is not pending", 400);
    }

    transaction.status = "rejected";
    await transaction.save();

    return successResponse(res, transaction, "Transaction rejected");
});

module.exports = { requestUpgrade, getPending, approveTransaction, rejectTransaction };
