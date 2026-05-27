const express = require("express");
const router = express.Router();

const {
    saveNote,
    getDueNotes,
    markReviewed,
    deleteNote,
} = require("../controllers/noteController");

const authMiddleware = require("../middleware/authMiddleware");

// Tất cả route cần đăng nhập
router.use(authMiddleware);

router.post("/", saveNote);
router.get("/due", getDueNotes);
router.put("/:id/reviewed", markReviewed);
router.delete("/:id", deleteNote);

module.exports = router;
