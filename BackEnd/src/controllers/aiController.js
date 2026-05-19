const { GoogleGenerativeAI } = require("@google/generative-ai");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const aiChat = asyncHandler(async (req, res) => {
    const { message } = req.body;

    if (!message || !message.trim()) {
        return errorResponse(res, "Message is required", 400);
    }

    if (!process.env.GEMINI_API_KEY) {
        return errorResponse(res, "GEMINI_API_KEY is not configured", 503);
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    });

    const result = await model.generateContent(`
You are an English tutor AI.
Help students learn English clearly and concisely.
User: ${message}
`);

    const reply = result.response.text();

    return successResponse(res, { reply }, "AI replied successfully");
});

module.exports = { aiChat };
