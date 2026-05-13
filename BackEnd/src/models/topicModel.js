const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        thumbnail: {
            type: String,
            default: "",
        },

        levels: {
            type: [String],
            default: [],
        },

        tags: {
            type: [String],
            default: [],
        },

        mediaType: {
            type: String,
            enum: ["audio", "video"],
            required: true,
        },

        lessonCount: {
            type: Number,
            default: 0,
        },

        isPremium: {
            type: Boolean,
            default: false,
        },

        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Topic", topicSchema);