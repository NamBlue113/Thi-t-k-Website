const speechService = require("../services/speechService");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const analyzeSpeech = asyncHandler(async (req, res) => {
    const { transcript } = req.body;

    if (!transcript || !transcript.trim()) {
        return errorResponse(res, "Transcript is required", 400);
    }

    const result = speechService.analyzeSpeech(transcript);

    return successResponse(res, result, "Speech analyzed successfully");
});

module.exports = { analyzeSpeech };
