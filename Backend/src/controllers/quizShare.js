const Quiz = require("../models/Quiz");

exports.getQuestionByShareLink = async (req, res, next) => {
  try {
    const { shareLink } = req.params;

    
    const quiz = await Quiz.findOne({ "questions.shareLink": shareLink }).lean();
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    
    const questionIndex = quiz.questions.findIndex(q => q.shareLink === shareLink);
    if (questionIndex === -1)
      return res.status(404).json({ message: "Question not found" });

    
    res.json({
      ...quiz,
      currentIndex: questionIndex,
    });
  } catch (err) {
    console.error("Error fetching shared question:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
