const express = require("express");
const router = express.Router();

const {
    createLesson,
    getLessons,
    getLessonById,
    updateLesson,
    deleteLesson,
} = require("../controllers/lessonController");

router.post("/", createLesson);
router.get("/", getLessons);
router.get("/:id", getLessonById);
router.put("/:id", updateLesson);
router.delete("/:id", deleteLesson);

module.exports = router;