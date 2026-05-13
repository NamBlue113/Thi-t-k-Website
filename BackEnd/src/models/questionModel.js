const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },

    options: {
      type: [String],

      required: [true, "Options are required"],

      validate: {
        validator: function (arr) {
          return arr.length >= 2;
        },

        message: "Phải có ít nhất 2 đáp án",
      },
    },

    correctAnswer: {
      type: String,

      required: [true, "Correct answer is required"],

      validate: {
        validator: function (value) {

          if (!this.options || this.options.length === 0) {
            return true;
          }

          return this.options.includes(value);
        },

        message: "Đáp án đúng phải nằm trong options",
      },
    },

    lessonId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Lesson",

      required: [true, "Lesson ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);