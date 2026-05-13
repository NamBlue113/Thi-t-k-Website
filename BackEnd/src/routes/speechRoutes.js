// ======================================================
// FILE: BackEnd/src/routes/speechRoutes.js
// ======================================================

const express = require("express");

const router = express.Router();

const {
    analyzeSpeech
} = require("../controllers/speechController");

router.post(
    "/analyze",
    analyzeSpeech
);

module.exports = router;