const Topic = require("../models/topicModel");

const Section = require("../models/sectionModel");

const asyncHandler = require("../utils/asyncHandler");

const {
    successResponse,
} = require("../utils/apiResponse");


// GET TOPICS
const getTopics = asyncHandler(async (req, res) => {

    const {
        search,
        level,
        type,
        premium,
    } = req.query;

    const query = {};

    if (search) {
        query.title = {
            $regex: search,
            $options: "i",
        };
    }

    if (level) {
        query.levels = level;
    }

    if (type) {
        query.mediaType = type;
    }

    if (premium !== undefined) {
        query.isPremium = premium === "true";
    }

    const topics = await Topic.find(query)
        .sort({ createdAt: -1 });

    return successResponse(
        res,
        topics,
        "Lấy danh sách topic thành công"
    );
});


// GET TOPIC BY ID
const getTopicById = asyncHandler(async (req, res) => {

    const topic = await Topic.findById(req.params.id);

    if (!topic) {
        const error = new Error("Không tìm thấy topic");
        error.statusCode = 404;
        throw error;
    }

    return successResponse(
        res,
        topic,
        "Lấy topic thành công"
    );
});


// GET TOPIC SECTIONS
const getTopicSections = asyncHandler(async (req, res) => {

    const topic = await Topic.findById(req.params.id);

    if (!topic) {
        const error = new Error("Không tìm thấy topic");
        error.statusCode = 404;
        throw error;
    }

    // PREMIUM CHECK
    if (topic.isPremium) {

        if (!req.user) {
            const error = new Error(
                "Premium required"
            );

            error.statusCode = 403;

            throw error;
        }

        const allowedPlans = [
            "premium",
            "premium_plus",
        ];

        if (
            !allowedPlans.includes(req.user.plan)
        ) {
            const error = new Error(
                "Premium required"
            );

            error.statusCode = 403;

            throw error;
        }
    }

    const sections = await Section.find({
        topicId: topic._id,
    }).sort({
        order: 1,
    });

    return successResponse(
        res,
        sections,
        "Lấy sections thành công"
    );
});

module.exports = {
    getTopics,
    getTopicById,
    getTopicSections,
};