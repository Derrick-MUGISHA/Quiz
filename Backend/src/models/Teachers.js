const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Answered question schema (same as user)
const AnsweredQuestionSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz.questions", required: true },
  questionTitle: { type: String, required: true },
  selectedAnswer: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  score: { type: Number, required: true, default: 0 },
  timeTaken: { type: Number, default: 0 },
}, { _id: false });

// Completed quiz schema
const QuizHistorySchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  quizTitle: { type: String, required: true },
  score: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  timeTaken: { type: Number, default: 0 },
  completedAt: { type: Date, default: Date.now },
  answeredQuestions: [AnsweredQuestionSchema]
}, { _id: false });

// Teacher schema
const TeacherSchema = new mongoose.Schema({
  teacherId: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },

  // roles
  role: { type: String, enum: ["teacher", "admin"], default: "teacher" },

  // optional permissions for admin
  permissions: {
    type: [String],
    default: ["create_quiz", "view_reports", "manage_students"]
  },

  // global stats
  totalQuestionsAnswered: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  totalTimeTaken: { type: Number, default: 0 },

  // quiz history
  quizHistory: [QuizHistorySchema]
}, { timestamps: true });

// Cleanup response JSON
TeacherSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model("Teacher", TeacherSchema);
