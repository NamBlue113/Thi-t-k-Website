const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";

const aiChat = asyncHandler(async (req, res) => {
    const { message } = req.body;

    if (!message || !message.trim()) {
        return errorResponse(res, "Message is required", 400);
    }

    if (!DEEPSEEK_API_KEY) {
        // Fallback: thử dùng Gemini nếu có
        if (process.env.GEMINI_API_KEY) {
            const { GoogleGenerativeAI } = require("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });
            const result = await model.generateContent(`You are an English tutor AI. Help students learn English clearly and concisely.\nUser: ${message}`);
            return successResponse(res, { reply: result.response.text() }, "AI replied (Gemini fallback)");
        }
        return errorResponse(res, "AI service is not configured (DEEPSEEK_API_KEY missing)", 503);
    }

    // Gọi DeepSeek API (tương thích OpenAI format)
    const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
            model: DEEPSEEK_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an English tutor AI. Help students learn English clearly and concisely. Reply in Vietnamese if the user writes in Vietnamese, otherwise reply in English. Keep answers short and helpful.",
                },
                {
                    role: "user",
                    content: message,
                },
            ],
            max_tokens: 800,
            temperature: 0.7,
        }),
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error("DeepSeek API error:", response.status, errText);
        return errorResponse(res, "AI service error: " + response.status, 502);
    }

    const json = await response.json();
    const reply = json.choices?.[0]?.message?.content || "Xin lỗi, tôi không thể trả lời lúc này.";

    return successResponse(res, { reply }, "AI replied successfully");
});

module.exports = { aiChat };
