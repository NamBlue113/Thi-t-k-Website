require("dotenv").config();

const {
    GoogleGenerativeAI
} = require("@google/generative-ai");

const genAI =
new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);



const aiChat =
async(req,res)=>{

    try{

        const { message } =
        req.body;



        const model =
        genAI.getGenerativeModel({
            model:"gemini-1.5-flash"
        });



        const result =
        await model.generateContent(
        `
        You are an English tutor AI.

        Help students learn English.

        User:
        ${message}
        `
        );



        const reply =
        result.response.text();



        res.json({
            reply
        });

    }
    catch(error){

        console.log(error);

        res.status(500).json({
            message:"AI Error"
        });

    }

};

module.exports = {
    aiChat
};