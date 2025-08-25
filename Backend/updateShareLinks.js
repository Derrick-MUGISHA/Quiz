const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const uri = "mongodb+srv://derrickmugisha169:yLiuLOe1Y219EqZW@cluster0.hkctzvk.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const QuestionSchema = new mongoose.Schema({
    title: String,
    category: String,
    teacher: String,
    description: String,
    options: [String],
    correctAnswer: Number,
    hint: String,
    score: { type: Number, default: 1 },
    shareLink: String,
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    rank: { type: String, enum: ["beginner", "intermediate", "professional"], required: true },
    code: String
}, { timestamps: true });

const QuizSchema = new mongoose.Schema({
    title: String,
    questions: [QuestionSchema]
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", QuizSchema);

async function updateShareLinks() {
    try {
        const quizzes = await Quiz.find({});

        let totalUpdated = 0;

        for (const quiz of quizzes) {
            let updated = false;

            quiz.questions.forEach(q => {
                if (!q.shareLink || q.shareLink.startsWith("http://localhost:5000/quiz/")) {
                    q.shareLink = q.shareLink
                        ? q.shareLink.replace("http://localhost:5000/quiz/", "https://quiz-five-rho-90.vercel.app/quiz/")
                        : `https://quiz-five-rho-90.vercel.app/quiz/${uuidv4()}`;
                    updated = true;
                    totalUpdated++;
                }
            });

            if (updated) {
                await quiz.save();
            }
        }

        console.log(`Updated ${totalUpdated} question share links`);
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
}

updateShareLinks();
