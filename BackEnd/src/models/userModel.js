const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Nickname is required"],
            trim: true,
            minlength: 2,
            maxlength: 30,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },

        plan: {
            type: String,
            enum: ["free", "premium", "premium_plus"],
            default: "free",
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);