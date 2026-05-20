const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Hàm chuyển đổi format dữ liệu trả về cho Client
const toAuthUser = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    plan: user.plan || "free",
    role: user.role,
});

// ─── REGISTER ───
const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return errorResponse(res, "Username, email and password are required", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        return errorResponse(res, "Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username: username.trim(),
        email: normalizedEmail,
        password: hashedPassword,
    });

    const token = generateToken(user._id);

    return successResponse(res, { token, user: toAuthUser(user) }, "Registered successfully", 201);
});

// ─── LOGIN ───
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return errorResponse(res, "Email and password are required", 400);
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
        return errorResponse(res, "Email or password is incorrect", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return errorResponse(res, "Email or password is incorrect", 401);
    }

    const token = generateToken(user._id);

    return successResponse(res, { token, user: toAuthUser(user) }, "Logged in successfully");
});

// ─── GOOGLE AUTH ───
const googleAuth = asyncHandler(async (req, res) => {
    const { access_token } = req.body;

    if (!access_token) {
        return errorResponse(res, "Google access_token is required", 400);
    }

    // Gọi Google userinfo API để lấy thông tin user từ access_token
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!response.ok) {
        return errorResponse(res, "Invalid or expired Google access token", 401);
    }

    const profile = await response.json();
    const { email, name } = profile;

    if (!email) {
        return errorResponse(res, "Unable to get email from Google account", 400);
    }

    const normalizedEmail = email.toLowerCase();

    // Tìm user theo email
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        // Tự động tạo user mới
        user = await User.create({
            username: name || email.split("@")[0],
            email: normalizedEmail,
            password: await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10),
            plan: "free",
            role: "user",
        });
    }

    const token = generateToken(user._id);

    return successResponse(res, { token, user: toAuthUser(user) }, "Google login successful");
});

// ─── GET ME ───
const getMe = asyncHandler(async (req, res) => {
    return successResponse(res, toAuthUser(req.user), "User fetched successfully");
});

// ─── FORGOT PASSWORD ───
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return errorResponse(res, "Email is required", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        return errorResponse(res, "No account found with this email", 404);
    }

    // Tạo mã OTP 6 số
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));

    // Xóa OTP cũ của email này (nếu có)
    await OTP.deleteMany({ email: normalizedEmail });

    // Lưu OTP mới
    await OTP.create({ email: normalizedEmail, otpCode });

    // Gửi email (bắt lỗi SMTP chi tiết)
    try {
        await transporter.sendMail({
        from: `"Listening IELTS" <${process.env.EMAIL_USER}>`,
        to: normalizedEmail,
        subject: "Mã OTP khôi phục mật khẩu - Listening IELTS",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
                <h2 style="color: #1a6fd4; margin: 0 0 16px;">🔐 Đặt lại mật khẩu</h2>
                <p style="color: #374151; font-size: 14px; line-height: 1.6;">Xin chào <strong>${normalizedEmail}</strong>,</p>
                <p style="color: #374151; font-size: 14px; line-height: 1.6;">Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>Listening English</strong>.</p>
                <p style="color: #374151; font-size: 14px; line-height: 1.6;">Để hoàn tất quá trình này, vui lòng nhập mã xác minh bên dưới vào ứng dụng:</p>
                <div style="background: #fff; border: 2px dashed #1a6fd4; border-radius: 10px; padding: 16px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #1a6fd4;">${otpCode}</span>
                </div>
                <div style="background: #fef3c7; border-left: 3px solid #f59e0b; border-radius: 6px; padding: 12px 16px; margin: 16px 0;">
                    <p style="color: #92400e; font-size: 13px; margin: 0; font-weight: 600;">⚠️ Lưu ý quan trọng:</p>
                    <ul style="color: #92400e; font-size: 13px; margin: 8px 0 0; padding-left: 18px;">
                        <li>Mã này chỉ có hiệu lực trong <strong>5 phút</strong>.</li>
                        <li>Để bảo mật tài khoản, vui lòng <strong>không chia sẻ</strong> mã này cho bất kỳ ai, kể cả nhân viên của chúng tôi.</li>
                    </ul>
                </div>
                <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ nếu bạn nghi ngờ tài khoản bị truy cập trái phép.</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">Trân trọng,<br /><strong>Listening IELTS Team</strong></p>
            </div>
        `,
        });
    } catch (smtpError) {
        // Xóa OTP đã lưu vì không gửi được email
        await OTP.deleteMany({ email: normalizedEmail });
        console.error("Email send failed:", smtpError.message);
        return errorResponse(
            res,
            "Không thể gửi email. Vui lòng kiểm tra EMAIL_USER và EMAIL_PASS (App Password) trong .env. Chi tiết: " + smtpError.message,
            500
        );
    }

    return successResponse(res, null, "OTP sent to your email");
});

// ─── VERIFY OTP ───
const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
        return errorResponse(res, "Email and OTP code are required", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const record = await OTP.findOne({ email: normalizedEmail, otpCode });

    if (!record) {
        return errorResponse(res, "Invalid or expired OTP code", 400);
    }

    return successResponse(res, { verified: true }, "OTP verified successfully");
});

// ─── RESET PASSWORD ───
const resetPassword = asyncHandler(async (req, res) => {
    const { email, otpCode, newPassword } = req.body;

    if (!email || !otpCode || !newPassword) {
        return errorResponse(res, "Email, OTP code and new password are required", 400);
    }

    if (newPassword.length < 6) {
        return errorResponse(res, "Password must be at least 6 characters", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Kiểm tra OTP
    const record = await OTP.findOne({ email: normalizedEmail, otpCode });
    if (!record) {
        return errorResponse(res, "Invalid or expired OTP code", 400);
    }

    // Cập nhật mật khẩu
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email: normalizedEmail }, { password: hashedPassword });

    // Xóa OTP
    await OTP.deleteOne({ _id: record._id });

    return successResponse(res, null, "Password reset successfully");
});

module.exports = {
    register,
    login,
    googleAuth,
    getMe,
    forgotPassword,
    verifyOtp,
    resetPassword,
};
