const mongoose = require("mongoose");

const QuizResultSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  quizTitle: { type: String, required: true },
  score: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now },
  wasRandomized: { type: Boolean, default: false },
  attemptId: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("QuizResult", QuizResultSchema);
