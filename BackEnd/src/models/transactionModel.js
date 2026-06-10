const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        packageType: {
            type: String,
            enum: ["premium", "premium_plus"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        transferContent: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

transactionSchema.index({ status: 1, createdAt: -1 });
transactionSchema.index({ userId: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
