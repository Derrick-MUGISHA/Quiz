const { v4: uuidv4 } = require("uuid");
const QuizResult = require("../models/QuizResult");
const User = require("../models/userMode");
exports.submitQuizResult = async (req, res) => {
  try {
    const {
      userId,         
      quizId,
      quizTitle,
      score,
      correctAnswers,
      totalQuestions,
      wasRandomized,
    } = req.body;

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const attemptId = uuidv4();

    const result = new QuizResult({
      userId,          
      quizId,
      quizTitle,
      score,
      correctAnswers,
      totalQuestions,
      wasRandomized,
      attemptId,
    });

    await result.save();
    res.status(201).json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



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


exports.getUserQuizHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email quizHistory");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      name: user.name,
      email: user.email,
      quizHistory: user.quizHistory,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

