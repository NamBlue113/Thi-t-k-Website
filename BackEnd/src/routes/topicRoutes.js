const express = require("express");
const router = express.Router();

const {
    createTopic,
    getTopics,
    getTopicBySlug,
    updateTopic,
    deleteTopic,
} = require("../controllers/topicController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// --- PUBLIC ---
router.get("/", getTopics);
router.get("/:slug", getTopicBySlug);

// --- ADMIN ONLY ---
router.post("/", authMiddleware, adminMiddleware, createTopic);
router.put("/:id", authMiddleware, adminMiddleware, updateTopic);
router.delete("/:id", authMiddleware, adminMiddleware, deleteTopic);

module.exports = router;
