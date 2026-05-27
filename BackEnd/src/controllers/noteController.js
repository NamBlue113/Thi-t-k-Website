const Note = require("../models/noteModel");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// Hàm tính nextReviewDate dựa trên mức độ khó
const calcNextReview = (level) => {
    const now = new Date();
    switch (level) {
        case 3: return new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);  // Khó: 1 ngày
        case 2: return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);  // TB: 3 ngày
        case 1: return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);  // Dễ: 7 ngày
        default: return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    }
};

// CREATE / UPSERT NOTE
const saveNote = asyncHandler(async (req, res) => {
    const { lessonId, segmentId, segmentContent, difficultyLevel } = req.body;

    if (!lessonId || segmentId == null || !difficultyLevel) {
        return errorResponse(res, "lessonId, segmentId and difficultyLevel are required", 400);
    }

    if (![1, 2, 3].includes(difficultyLevel)) {
        return errorResponse(res, "difficultyLevel must be 1 (Dễ), 2 (Trung bình) or 3 (Khó)", 400);
    }

    const nextReviewDate = calcNextReview(difficultyLevel);

    // Upsert: nếu đã note segment này thì cập nhật, chưa có thì tạo mới
    const note = await Note.findOneAndUpdate(
        {
            userId: req.user._id,
            lessonId,
            segmentId,
        },
        {
            userId: req.user._id,
            lessonId,
            segmentId,
            segmentContent: segmentContent || "",
            difficultyLevel,
            nextReviewDate,
            reviewed: false,
        },
        { upsert: true, new: true, runValidators: true }
    );

    return successResponse(res, note, "Note saved", 201);
});

// GET NOTES DUE FOR REVIEW (Spaced Repetition)
const getDueNotes = asyncHandler(async (req, res) => {
    const now = new Date();

    const notes = await Note.find({
        userId: req.user._id,
        nextReviewDate: { $lte: now },
        reviewed: false,
    })
        .populate("lessonId", "title youtubeUrl topicId")
        .sort({ nextReviewDate: 1 });

    return successResponse(res, notes, "Due notes fetched");
});

// MARK NOTE AS REVIEWED
const markReviewed = asyncHandler(async (req, res) => {
    const note = await Note.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { reviewed: true },
        { new: true }
    );

    if (!note) {
        return errorResponse(res, "Note not found", 404);
    }

    return successResponse(res, note, "Note marked as reviewed");
});

// DELETE NOTE
const deleteNote = asyncHandler(async (req, res) => {
    const note = await Note.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id,
    });

    if (!note) {
        return errorResponse(res, "Note not found", 404);
    }

    return successResponse(res, note, "Note deleted");
});

module.exports = { saveNote, getDueNotes, markReviewed, deleteNote };
