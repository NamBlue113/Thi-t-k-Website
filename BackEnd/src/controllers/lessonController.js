const Lesson = require("../models/lessonModel");

console.log("NEW LESSON CONTROLLER RUNNING");

// CREATE LESSON
const createLesson = async (req, res) => {
    try {
        const lesson = await Lesson.create(req.body);

        res.status(201).json({
            message: "Tạo bài học thành công",
            data: lesson,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


// GET ALL LESSONS
const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find();

        res.status(200).json(lessons);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


// GET LESSON BY ID
const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({
                message: "Không tìm thấy bài học",
            });
        }

        res.status(200).json(lesson);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


// UPDATE LESSON
const updateLesson = async (req, res) => {
    try {
        const updatedLesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        if (!updatedLesson) {
            return res.status(404).json({
                message: "Không tìm thấy bài học",
            });
        }

        res.status(200).json({
            message: "Cập nhật thành công",
            data: updatedLesson,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


// DELETE LESSON
const deleteLesson = async (req, res) => {
    try {
        const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);

        if (!deletedLesson) {
            return res.status(404).json({
                message: "Không tìm thấy bài học",
            });
        }

        res.status(200).json({
            message: "Xóa thành công",
            data: deletedLesson,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


module.exports = {
    createLesson,
    getLessons,
    getLessonById,
    updateLesson,
    deleteLesson,
};