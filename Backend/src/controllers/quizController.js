const Quiz = require("../models/Quiz");

exports.createQuiz = async ( req, res, next) => {
    try {
        const quiz = new Quiz(req.body);
        const savedQuiz = await quiz.save();
        res.status(201).json(savedQuiz);
    } catch (err) {
        next(err);
    }
}

exports.getQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (err) {
        next(err);
    }
};

exports.getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
        if (!quiz) return res.status(404).json({ message: "Quiz not found"});
        res.json(quiz);
    } catch (err) {
        next(err);
    }
}

exports.submitQuiz = async (req, res, next) => {
    try {
        const { answers } = req.body;
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({message: "Quiz not found"});

        let score = 0;
        let total = 0;
        quiz.questions.forEach((q, i) => {
            total += q.score;
            if (answers[i] === q.correctAnswer)  score += q.score;
        });

        res.json({ score, total: quiz.questions.length })
    } catch (err) {
        next(err);
    }
}

exports.updateQuestionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { quizId, questionId } = req.params;

    if (!["draft", "published", "archived"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const question = quiz.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.status = status;

    await quiz.save();

    res.json({
      message: "Question status updated successfully",
      question,
    });
  } catch (err) {
    console.error("Error updating question status:", err);
    res.status(500).json({
      message: "Server error while updating question status",
      error: err.message,
    });
  }
};