const Quiz = require("../models/Quiz");

exports.getQuestionByShareLink = async (req, res, next) => {
  try {
    const { shareLink } = req.params;

    const quiz = await Quiz.findOne({ "questions.shareLink": shareLink });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const question = quiz.questions.find(q => q.shareLink === shareLink);
    if (!question) return res.status(404).json({ message: "Question not found" });

    res.json({
      quizId: quiz._id,
      quizTitle: quiz.title,
      question,
    });
  } catch (err) {
    console.error("Error fetching shared question:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
