const express = require("express");

const router = express.Router();

const {
    getTopics,
    getTopicById,
    getTopicSections,
} = require("../controllers/topicController");

const optionalAuthMiddleware = require(
    "../middleware/optionalAuthMiddleware"
);

router.get("/", getTopics);

router.get("/:id", getTopicById);

router.get(
    "/:id/sections",
    optionalAuthMiddleware,
    getTopicSections
);

module.exports = router;