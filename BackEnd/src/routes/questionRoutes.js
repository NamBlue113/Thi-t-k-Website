const express = require("express");

const router = express.Router();

const {
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    getQuestionsByLesson,
} = require("../controllers/questionController");

router.post("/", createQuestion);

router.get("/", getQuestions);

router.get("/lesson/:lessonId", getQuestionsByLesson);  

router.get("/:id", getQuestionById);

router.put("/:id", updateQuestion);

router.delete("/:id", deleteQuestion);

router.get("/lesson/:lessonId", getQuestionsByLesson);

module.exports = router;