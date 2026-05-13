const Attempt = require("../models/attemptModel");

const Section = require("../models/sectionModel");

const asyncHandler = require("../utils/asyncHandler");

const normalizeText = require(
    "../utils/normalizeText"
);

const levenshtein = require(
    "../utils/levenshtein"
);

const {
    successResponse,
} = require("../utils/apiResponse");


// CHECK ANSWER
const checkAnswer = asyncHandler(
    async (req, res) => {

        const {
            sectionId,
            answer,
        } = req.body;

        if (!sectionId) {

            const error = new Error(
                "Thiếu sectionId"
            );

            error.statusCode = 400;

            throw error;
        }

        if (
            answer === undefined ||
            answer === null
        ) {

            const error = new Error(
                "Thiếu answer"
            );

            error.statusCode = 400;

            throw error;
        }

        const section = await Section.findById(
            sectionId
        );

        if (!section) {

            const error = new Error(
                "Section không tồn tại"
            );

            error.statusCode = 404;

            throw error;
        }

        const normalizedAnswer =
            normalizeText(answer);

        const normalizedCorrect =
            normalizeText(
                section.correctAnswer
            );

        const distance = levenshtein(
            normalizedAnswer,
            normalizedCorrect
        );

        const maxLength = Math.max(
            normalizedAnswer.length,
            normalizedCorrect.length
        );

        const similarity =
            maxLength === 0
                ? 100
                : (
                    (
                        maxLength - distance
                    ) / maxLength
                ) * 100;

        let status = "wrong";

        if (similarity >= 95) {

            status = "correct";

        } else if (similarity >= 75) {

            status = "almost";
        }

        const attempt = await Attempt.create({

            userId: req.user
                ? req.user._id
                : null,

            sectionId,

            answer,

            normalizedAnswer,

            correctAnswer:
                section.correctAnswer,

            score: Math.max(
                0,
                Math.round(similarity)
            ),

            status,
        });

        return successResponse(
            res,
            attempt,
            "Chấm điểm thành công"
        );
    }
);

module.exports = {
    checkAnswer,
};