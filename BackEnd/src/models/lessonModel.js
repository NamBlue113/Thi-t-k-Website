const mongoose = require("mongoose");

// 1. Cấu trúc phân đoạn câu hỏi chép chính tả (Thay thế cho sections và questions)
const segmentSchema = new mongoose.Schema({
    segmentId: {
        type: Number,
        required: true
    },
    startTime: {
        type: Number, // Giây bắt đầu cắt video (Ví dụ: 10.5)
        required: true
    },
    endTime: {
        type: Number, // Giây kết thúc câu (Ví dụ: 15.2)
        required: true
    },
    content: {
        type: String, // Đáp án chuẩn để học sinh gõ đối chiếu
        required: true
    }
});

// 2. Cấu trúc bài học lớn
const lessonSchema = new mongoose.Schema(
    {
        topicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic", // Liên kết với bảng Topic
            required: true
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        youtubeUrl: {
            type: String, // Link video bài học
            required: true
        },
        fullTranscript: {
            type: String, // Nội dung toàn bài dịch
            required: true
        },
        isPremium: {
            type: Boolean, // Phân quyền bài VIP công khai
            default: false
        },
        segments: [segmentSchema] // NHÚNG THẲNG MẢNG CÂU HỎI VÀO ĐÂY!
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Lesson", lessonSchema);