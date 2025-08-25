const express = require("express");
const {
  createQuiz,
  getQuizById,
  getQuizzes,
  submitQuiz,
  updateQuestionStatus,
} = require("../controllers/quizController");
const { submitQuizResult, getQuizResultByAttempt } = require("../controllers/submitQuizResult");
const { getQuestionByShareLink } = require("../controllers/quizShare");

const router = express.Router();

// Quiz routes
router.post("/quizzes", createQuiz);
router.get("/quizzes", getQuizzes);
router.get("/quizzes/:id", getQuizById);
router.post("/quizzes/:id/submit", submitQuiz);
router.patch("/quizzes/:quizId/questions/:questionId/status", updateQuestionStatus);

// Quiz Result routes
router.post("/quizzes/:id/results", submitQuizResult);
router.get("/quizzes/:id/results/:attemptId", getQuizResultByAttempt);

// New route for shared question
router.get("/questions/shared/:shareLink", getQuestionByShareLink);

module.exports = router;
