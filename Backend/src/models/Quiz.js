const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const QuestionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    teacher: { type: String, required: true },
    description: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true },
    hint: { type: String, required: false }, // optional
    score: { type: Number, required: false, default: 1 }, // optional with default
    shareLink: { type: String, required: false }, // optional
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    rank: { type: String, enum: ["beginner", "intermediate", "professional"], required: [true, "Rank is required"] },
    code: { type: String, required: false } // new optional code field
}, { timestamps: true });

QuestionSchema.pre("save", function (next) {
    if (!this.shareLink) {
        this.shareLink = `http://localhost:5000/quiz/${uuidv4()}`;
    }
    next();
});

const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    questions: [QuestionSchema],
}, { timestamps: true });

module.exports = mongoose.model("Quiz", QuizSchema);