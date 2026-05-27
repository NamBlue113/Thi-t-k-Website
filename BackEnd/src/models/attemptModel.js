const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        lessonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
            required: true,
        },

        segmentId: {
            type: Number,
            required: true,
        },

        answer: {
            type: String,
            default: "",
        },

        normalizedAnswer: {
            type: String,
            default: "",
        },

        correctAnswer: {
            type: String,
            default: "",
        },

        score: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: [
                "correct",
                "almost",
                "wrong",
                "skipped",
            ],
            default: "wrong",
        },
    },
    {
        timestamps: true,
    }
);

attemptSchema.index({ lessonId: 1, segmentId: 1 });
attemptSchema.index({ userId: 1 });

module.exports = mongoose.model(
    "Attempt",
    attemptSchema
);
