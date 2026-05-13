const Question = require("../models/questionModel");


// HANDLE ERROR
const handleError = (res, error) => {

    // Validation Error
    if (error.name === "ValidationError") {

        const firstError = Object.values(error.errors)[0];

        return res.status(400).json({
            message: firstError.message,
        });
    }

    // ObjectId Error
    if (error.name === "CastError") {
        return res.status(400).json({
            message: "ID không hợp lệ",
        });
    }

    // Default Server Error
    return res.status(400).json({   
        message: error.message,
    });
};



// CREATE QUESTION
const createQuestion = async (req, res, next) => {
    try {

        const question = await Question.create(req.body);

        res.status(201).json({
            message: "Tạo câu hỏi thành công",
            data: question,
        });

    } catch (error) {
        next(error);
    }
};



// GET ALL QUESTIONS
const getQuestions = async (req, res) => {
    try {

        const questions = await Question
            .find()
            .populate("lessonId");

        res.status(200).json(questions);

    } catch (error) {
        handleError(res, error);
    }
};



// GET QUESTION BY ID
const getQuestionById = async (req, res) => {
    try {

        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                message: "Không tìm thấy câu hỏi",
            });
        }

        res.status(200).json(question);

    } catch (error) {
        handleError(res, error);
    }
};



// UPDATE QUESTION
const updateQuestion = async (req, res) => {
    try {

        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedQuestion) {
            return res.status(404).json({
                message: "Không tìm thấy câu hỏi",
            });
        }

        res.status(200).json({
            message: "Cập nhật thành công",
            data: updatedQuestion,
        });

    } catch (error) {
        handleError(res, error);
    }
};



// DELETE QUESTION
const deleteQuestion = async (req, res) => {
    try {

        const deletedQuestion = await Question.findByIdAndDelete(
            req.params.id
        );

        if (!deletedQuestion) {
            return res.status(404).json({
                message: "Không tìm thấy câu hỏi",
            });
        }

        res.status(200).json({
            message: "Xóa câu hỏi thành công",
        });

    } catch (error) {
        handleError(res, error);
    }
};



// GET QUESTIONS BY LESSON
const getQuestionsByLesson = async (req, res) => {
    try {

        const questions = await Question.find({
            lessonId: req.params.lessonId,
        });

        res.status(200).json(questions);

    } catch (error) {
        handleError(res, error);
    }
};



module.exports = {
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    getQuestionsByLesson,
};