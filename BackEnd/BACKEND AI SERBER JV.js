const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



// =====================================
// 1. AI CHATBOT TUTOR
// =====================================

app.post("/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        const result = await model.generateContent(`
            Bạn là gia sư tiếng Anh.

            Hãy giải thích dễ hiểu cho học sinh:
            ${userMessage}
        `);

        const response = result.response.text();

        res.json({
            reply: response
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "AI Error"
        });
    }

});




// =====================================
// 2. AUTO QUIZ GENERATOR
// =====================================

app.post("/generate-quiz", async (req, res) => {

    try {

        const transcript = req.body.transcript;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        const prompt = `
        Tạo 5 câu hỏi trắc nghiệm tiếng Anh từ transcript sau.

        Mỗi câu gồm:
        - question
        - A
        - B
        - C
        - D
        - answer

        Trả về dạng JSON.

        Transcript:
        ${transcript}
        `;

        const result = await model.generateContent(prompt);

        const response = result.response.text();

        res.json({
            quiz: response
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Quiz Error"
        });

    }

});



app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});