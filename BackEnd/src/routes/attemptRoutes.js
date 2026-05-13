const express = require("express");

const router = express.Router();

const {
    checkAnswer,
} = require("../controllers/attemptController");

const optionalAuthMiddleware = require(
    "../middleware/optionalAuthMiddleware"
);

router.post(
    "/check",
    optionalAuthMiddleware,
    checkAnswer
);

module.exports = router;