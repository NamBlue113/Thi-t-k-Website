// ======================================================
// FILE: BackEnd/src/controllers/speechController.js
// ======================================================

const speechService =
require("../services/speechService");



const analyzeSpeech =
async(req,res)=>{

    try{

        const { transcript } = req.body;

        const result =
        await speechService.analyzeSpeech(
            transcript
        );

        res.json(result);

    }
    catch(error){

        console.log(error);

        res.status(500).json({
            message:"Speech analysis failed"
        });

    }

};

module.exports = {
    analyzeSpeech
};