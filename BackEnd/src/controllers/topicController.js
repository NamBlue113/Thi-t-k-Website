const Topic = require("../models/topicModel");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// CREATE
const createTopic = asyncHandler(async (req, res) => {
    const { title, slug, description, mediaType } = req.body;

    if (!title || !slug || !mediaType) {
        return errorResponse(res, "Title, slug and mediaType are required", 400);
    }

    const existingSlug = await Topic.findOne({ slug: slug.toLowerCase() });
    if (existingSlug) {
        return errorResponse(res, "Slug already exists", 400);
    }

    const topic = await Topic.create(req.body);
    return successResponse(res, topic, "Topic created successfully", 201);
});

// GET ALL (với lessonCount thực tế từ bảng lessons)
const getTopics = asyncHandler(async (req, res) => {
    const topics = await Topic.aggregate([
        {
            $lookup: {
                from: "lessons",           // Tên collection Lesson trong MongoDB
                localField: "_id",
                foreignField: "topicId",
                as: "lessons",
            },
        },
        {
            $addFields: {
                lessonCount: { $size: "$lessons" }, // Đếm thực tế số bài học
            },
        },
        {
            $project: {
                lessons: 0,                // Ẩn mảng lessons để response gọn
            },
        },
        {
            $sort: { createdAt: -1 },
        },
    ]);

    return successResponse(res, topics, "Topics fetched successfully");
});

// GET BY SLUG (với lessonCount thực tế)
const getTopicBySlug = asyncHandler(async (req, res) => {
    const [topic] = await Topic.aggregate([
        { $match: { slug: req.params.slug } },
        {
            $lookup: {
                from: "lessons",
                localField: "_id",
                foreignField: "topicId",
                as: "lessons",
            },
        },
        {
            $addFields: {
                lessonCount: { $size: "$lessons" },
            },
        },
        {
            $project: {
                lessons: 0,
            },
        },
    ]);

    if (!topic) {
        return errorResponse(res, "Topic not found", 404);
    }
    return successResponse(res, topic, "Topic fetched successfully");
});

// UPDATE
const updateTopic = asyncHandler(async (req, res) => {
    const updatedTopic = await Topic.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    if (!updatedTopic) {
        return errorResponse(res, "Topic not found", 404);
    }
    return successResponse(res, updatedTopic, "Topic updated successfully");
});

// DELETE
const deleteTopic = asyncHandler(async (req, res) => {
    const deletedTopic = await Topic.findByIdAndDelete(req.params.id);
    if (!deletedTopic) {
        return errorResponse(res, "Topic not found", 404);
    }
    return successResponse(res, deletedTopic, "Topic deleted successfully");
});

module.exports = {
    createTopic,
    getTopics,
    getTopicBySlug,
    updateTopic,
    deleteTopic,
};
