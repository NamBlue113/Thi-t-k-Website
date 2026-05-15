const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
    {
        topicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic",
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        order: {
            type: Number,
            required: true,
        },

        mediaType: {
            type: String,
            enum: ["audio", "video"],
            required: true,
        },

        audioUrl: {
            type: String,
        },

        youtubeVideoId: {
            type: String,
            default: "",
        },

        youtubeUrl: {
            type: String,
        },

        transcript: {
            type: String,
            default: "",
        },

        correctAnswer: {
            type: String,
            default: "",
        },

        instruction: {
            type: String,
            default: "",
        },

        segments: [
            {
                startTime: {
                    type: Number,
                    required: true,
                },

                endTime: {
                    type: Number,
                    required: true,
                },

                content: {
                    type: String,
                    required: true,
                },
            },
        ],
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Section",
    sectionSchema
);