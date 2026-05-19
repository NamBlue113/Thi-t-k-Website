const Attempt = require("../models/attemptModel");
const Lesson = require("../models/lessonModel");

const asyncHandler = require("../utils/asyncHandler");
const normalizeText = require("../utils/normalizeText");
const levenshtein = require("../utils/levenshtein");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// CHECK ANSWER
const checkAnswer = asyncHandler(async (req, res) => {
    const { lessonId, segmentId, answer } = req.body;

    if (!lessonId || segmentId === undefined) {
        return errorResponse(res, "lessonId and segmentId are required", 400);
    }

    if (answer === undefined || answer === null) {
        return errorResponse(res, "answer is required", 400);
    }

    // Tìm lesson chứa segment
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
        return errorResponse(res, "Lesson not found", 404);
    }

    // Tìm segment trong mảng nhúng
    const segment = lesson.segments.find(
        (seg) => seg.segmentId === Number(segmentId)
    );
    if (!segment) {
        return errorResponse(res, "Segment not found in this lesson", 404);
    }

    const correctAnswer = segment.content;

    const normalizedAnswer = normalizeText(answer);
    const normalizedCorrect = normalizeText(correctAnswer);

    const distance = levenshtein(normalizedAnswer, normalizedCorrect);
    const maxLength = Math.max(normalizedAnswer.length, normalizedCorrect.length);

    const similarity =
        maxLength === 0
            ? 100
            : ((maxLength - distance) / maxLength) * 100;

    let status = "wrong";
    if (similarity >= 95) {
        status = "correct";
    } else if (similarity >= 75) {
        status = "almost";
    }

    const attempt = await Attempt.create({
        userId: req.user ? req.user._id : null,
        lessonId,
        segmentId,
        answer,
        normalizedAnswer,
        correctAnswer,
        score: Math.max(0, Math.round(similarity)),
        status,
    });

    return successResponse(res, attempt, "Chấm điểm thành công");
});

// GET ATTEMPTS BY USER
const getUserAttempts = asyncHandler(async (req, res) => {
    const attempts = await Attempt.find({ userId: req.user._id })
        .populate("lessonId", "title")
        .sort({ createdAt: -1 });
    return successResponse(res, attempts, "Attempts fetched successfully");
});

module.exports = {
    checkAnswer,
    getUserAttempts,
};
