const Lesson = require("../models/lessonModel");
const asyncHandler = require("../utils/asyncHandler");
const Topic = require("../models/topicModel");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// CREATE LESSON (Chỉ Admin - đã chặn ở Route)
const createLesson = asyncHandler(async (req, res) => {
    const lesson = await Lesson.create(req.body);

    // Tự động tăng lessonCount của Topic
    if (lesson.topicId) {
        await Topic.findByIdAndUpdate(lesson.topicId, { $inc: { lessonCount: 1 } });
    }

    return successResponse(res, lesson, "Lesson created successfully", 201);
});

// GET ALL LESSONS (Lấy danh sách bài học ngoài trang chủ)
const getLessons = asyncHandler(async (req, res) => {
    const filter = {};

    // Hỗ trợ lọc theo topicSlug
    if (req.query.topicSlug) {
        const topic = await Topic.findOne({ slug: req.query.topicSlug });
        if (topic) filter.topicId = topic._id;
    }

    const lessons = await Lesson.find(filter).sort({ createdAt: -1 });
    return successResponse(res, lessons, "Lessons fetched successfully");
});

// GET LESSON BY ID (Vào chi tiết một bài học để làm bài)
const getLessonById = asyncHandler(async (req, res) => {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
        return errorResponse(res, "Lesson not found", 404);
    }

    // --- KIỂM TRA PHÂN QUYỀN VIP TẠI ĐÂY ---
    if (lesson.isPremium) {
        const vipPlans = ["premium", "premium_plus"];
        if (!req.user || !vipPlans.includes(req.user.plan)) {
            return errorResponse(
                res,
                "Bài học này chỉ dành riêng cho thành viên VIP. Vui lòng nâng cấp tài khoản!",
                403
            );
        }
    }

    return successResponse(res, lesson, "Lesson fetched successfully");
});

// UPDATE LESSON
const updateLesson = asyncHandler(async (req, res) => {
    const updatedLesson = await Lesson.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedLesson) {
        return errorResponse(res, "Lesson not found", 404);
    }
    return successResponse(res, updatedLesson, "Lesson updated successfully");
});

// DELETE LESSON
const deleteLesson = asyncHandler(async (req, res) => {
    const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);

    if (!deletedLesson) {
        return errorResponse(res, "Lesson not found", 404);
    }

    // Tự động giảm lessonCount của Topic
    if (deletedLesson.topicId) {
        await Topic.findByIdAndUpdate(deletedLesson.topicId, { $inc: { lessonCount: -1 } });
    }

    return successResponse(res, deletedLesson, "Lesson deleted successfully");
});

module.exports = {
    createLesson,
    getLessons,
    getLessonById,
    updateLesson,
    deleteLesson,
};