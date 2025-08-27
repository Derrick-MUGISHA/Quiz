const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");


const AnsweredQuestionSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz.questions", required: true },
  questionTitle: { type: String, required: true },
  selectedAnswer: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  score: { type: Number, required: true, default: 0 },
  timeTaken: { type: Number, default: 0 },
}, { _id: false });


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


const UserSchema = new mongoose.Schema({
  userId: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },


  verificationToken: { type: String },
  verificationTokenExpiry: { type: Date },


  role: { type: String, enum: ["student", "teacher"], default: "student" },


  totalQuestionsAnswered: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  totalTimeTaken: { type: Number, default: 0 },


  quizHistory: [QuizHistorySchema]
}, { timestamps: true });


UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model("User", UserSchema);
