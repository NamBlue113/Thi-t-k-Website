const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const User = require("./src/models/userModel");

dotenv.config();

const createAdminAccount = async () => {
    try {
        console.log("Đang kết nối tới Database...");
        await connectDB();
        console.log("Kết nối Database thành công!");

        const adminEmail = "admim@gmail.com"; // Thay đổi theo ý bạn
        const adminUsername = "admin";            // Thay đổi theo ý bạn
        const adminPassword = "12345@";     // Mật khẩu đăng nhập của bạn

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log(`❌ Lỗi: Tài khoản với email ${adminEmail} đã tồn tại!`);
            process.exit(0);
        }

        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(adminPassword, saltRound);

        const newAdmin = await User.create({
            username: adminUsername,
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
            plan: "premium",
        });

        console.log("\n=========================================");
        console.log("🎉 TẠO TÀI KHOẢN ADMIN THÀNH CÔNG!");
        console.log(`- Username: ${newAdmin.username}`);
        console.log(`- Email:    ${newAdmin.email}`);
        console.log(`- Mật khẩu: ${adminPassword} (Đã mã hóa trong DB)`);
        console.log("=========================================\n");

    } catch (error) {
        console.error("❌ Có lỗi xảy ra trong quá trình tạo tài khoản Admin:", error.message);
    } finally {
        await require("mongoose").disconnect();
        process.exit(0);
    }
};

createAdminAccount();