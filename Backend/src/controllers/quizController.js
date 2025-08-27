const Quiz = require("../models/Quiz");
const User = require("../models/userMode");
const QuizResult = require("../models/QuizResult");
const { v4: uuidv4 } = require("uuid");

exports.createQuiz = async (req, res, next) => {
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
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    next(err);
  }
}

exports.submitQuiz = async (req, res, next) => {
  try {
    const { answers, userId, timeTaken } = req.body;
    
    // Validate required fields
    if (!answers || !userId) {
      return res.status(400).json({ message: "Missing required fields: answers and userId" });
    }
    
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let score = 0;
    let correctAnswers = 0;

    const answeredQuestions = quiz.questions.map((q) => {
      const selectedAnswer = answers[q._id];
      const isCorrect = selectedAnswer === q.correctAnswer;
      if (isCorrect) {
        score += q.score || 1;
        correctAnswers++;
      }

      return {
        questionId: q._id,
        questionTitle: q.title,
        selectedAnswer,
        isCorrect,
        score: isCorrect ? (q.score || 1) : 0,
        timeTaken: 0,
      };
    });

    // Calculate percentage score
    const percentageScore = Math.round((correctAnswers / quiz.questions.length) * 100);

    // Create a unique attempt ID
    const attemptId = uuidv4();

    // Quiz attempt object
    const attempt = {
      _id: attemptId,
      quizId: quiz._id,
      quizTitle: quiz.title,
      score: percentageScore,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      timeTaken: timeTaken || 0,
      answeredQuestions,
      completedAt: new Date(),
    };

    // Save in user document
    user.quizHistory.push(attempt);
    user.totalQuestionsAnswered += quiz.questions.length;
    user.totalScore += score;
    user.totalTimeTaken += timeTaken || 0;
    await user.save();

    // Save in QuizResult collection
    const quizResult = new QuizResult({
      userId,
      quizId: quiz._id,
      quizTitle: quiz.title,
      score: percentageScore,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      attemptId,
      wasRandomized: true,
    });
    await quizResult.save();

    res.status(200).json({ message: "Quiz submitted", result: attempt });
  } catch (err) {
    console.error("Error submitting quiz:", err);
    next(err);
  }
};

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