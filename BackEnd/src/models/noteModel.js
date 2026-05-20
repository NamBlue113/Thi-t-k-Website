const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
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
        segmentContent: {
            type: String,
            default: "",
        },
        difficultyLevel: {
            type: Number,
            enum: [1, 2, 3],
            required: true,
        },
        nextReviewDate: {
            type: Date,
            required: true,
        },
        reviewed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index để query nhanh các note đến hạn ôn tập
noteSchema.index({ userId: 1, nextReviewDate: 1 });
noteSchema.index({ userId: 1, lessonId: 1, segmentId: 1 }, { unique: true });

module.exports = mongoose.model("Note", noteSchema);
