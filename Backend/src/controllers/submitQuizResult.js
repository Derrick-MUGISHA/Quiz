const { v4: uuidv4 } = require("uuid");
const QuizResult = require("../models/QuizResult");

// Submit a quiz result
exports.submitQuizResult = async (req, res) => {
  try {
    const { quizId, quizTitle, score, correctAnswers, totalQuestions, wasRandomized } = req.body;
    const attemptId = uuidv4();

    const result = new QuizResult({
      quizId,
      quizTitle,
      score,
      correctAnswers,
      totalQuestions,
      wasRandomized,
      attemptId,
    });

    await result.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a quiz result by attemptId
exports.getQuizResultByAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    if (!attemptId) return res.status(400).json({ message: "Attempt ID is required" });

    const result = await QuizResult.findOne({ attemptId });
    if (!result) return res.status(404).json({ message: "Result not found" });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
