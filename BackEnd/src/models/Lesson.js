const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    videoUrl: {
        type: String,
        required: true,
    },

    level: {
        type: String,
        default: "easy",
    },
});

module.exports = mongoose.model("Lesson", lessonSchema);