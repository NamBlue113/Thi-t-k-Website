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

    // Tạo nội dung chuyển khoản có chứa USER_ID để đối soát
    const transferContent = `${req.user._id} nâng cấp ${packageType.replace("_", "+")}`;

    const transaction = await Transaction.create({
        userId: req.user._id,
        username: req.user.username,
        email: req.user.email,
        packageType,
        amount,
        transferContent,
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

// WEBHOOK: Tự động xử lý thanh toán từ nội dung chuyển khoản
// Dùng cho integration với cổng thanh toán / bank notification
const processWebhook = asyncHandler(async (req, res) => {
    const { transferContent, amount } = req.body;

    if (!transferContent) {
        return errorResponse(res, "transferContent is required", 400);
    }

    // Parse: "{USER_ID} nâng cấp premium" hoặc "{USER_ID} nâng cấp premium+"
    const match = transferContent.match(/^(\S+)\s+nâng cấp\s+(.+)$/i);
    if (!match) {
        console.error(`[Webhook] Cannot parse transfer content: "${transferContent}"`);
        return errorResponse(res, "Invalid transfer content format. Cannot extract USER_ID.", 400);
    }

    const userId = match[1];
    const planRaw = match[2].toLowerCase().replace(/\s+/g, "_");

    let packageType;
    if (planRaw === "premium") {
        packageType = "premium";
    } else if (planRaw === "premium+") {
        packageType = "premium_plus";
    } else {
        console.error(`[Webhook] Unknown plan in transfer: "${transferContent}"`);
        return errorResponse(res, `Unknown plan type: "${match[2]}"`, 400);
    }

    // Kiểm tra userId hợp lệ
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error(`[Webhook] Invalid USER_ID: "${userId}"`);
        return errorResponse(res, "Invalid USER_ID in transfer content", 400);
    }

    const user = await User.findById(userId);
    if (!user) {
        console.error(`[Webhook] User not found: "${userId}"`);
        return errorResponse(res, "User not found", 404);
    }

    // Tạo transaction record
    const transaction = await Transaction.create({
        userId: user._id,
        username: user.username,
        email: user.email,
        packageType,
        amount: amount || (packageType === "premium" ? 50000 : 100000),
        transferContent,
        status: "approved",
    });

    // Kích hoạt tài khoản
    user.plan = packageType;
    await user.save();

    console.log(`[Webhook] Activated ${packageType} for user ${user._id} (${user.username})`);

    return successResponse(res, transaction, "Webhook processed. User plan updated.");
});

module.exports = { requestUpgrade, getPending, approveTransaction, rejectTransaction, processWebhook };
