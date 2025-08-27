const express = require("express");
const {
  createQuiz,
  getQuizById,
  getQuizzes,
  submitQuiz,
  updateQuestionStatus,
} = require("../controllers/quizController");
const { getQuizResultByAttempt, getUserQuizHistory } = require("../controllers/submitQuizResult");
const { getQuestionByShareLink } = require("../controllers/quizShare");

const router = express.Router();

// Quiz routes
router.post("/quizzes", createQuiz);
router.get("/quizzes", getQuizzes);
router.get("/quizzes/:id", getQuizById);
router.post("/quizzes/:id/submit", submitQuiz);
router.patch("/quizzes/:quizId/questions/:questionId/status", updateQuestionStatus);

// Quiz Result routes - only GET operations
router.get("/quizzes/:id/results/:attemptId", getQuizResultByAttempt);
router.get("/users/quiz-history", getUserQuizHistory);

// route for shared question
router.get("/questions/shared/:shareLink", getQuestionByShareLink);

module.exports = router;