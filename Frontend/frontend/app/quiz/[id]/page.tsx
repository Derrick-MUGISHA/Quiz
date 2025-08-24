"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Question, Quiz } from "@/types/quiz";

const API_BASE_URL = "http://localhost:5000/api";
export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params?.id as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [timeRemaining, setTimeRemaining] = useState(10 * 60);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return router.push("/");
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_BASE_URL}/quizzes/${quizId}`);
        const questions = shuffleArray<Question>(data.questions).slice(0, 20);
        setQuiz({ ...data, questions });
        setOriginalQuestions(questions);
        setTimeRemaining(Math.min(data.duration || 10, 10) * 60);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, router]);

  const handleSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_timeUp = false) => {
      if (!quiz) return;

      let correct = 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let answeredCount = 0;

      originalQuestions.forEach((q) => {
        if (selectedAnswers[q._id] !== undefined) answeredCount++;
        if (selectedAnswers[q._id] === q.correctAnswer) correct++;
      });

      const score = Math.round((correct / originalQuestions.length) * 100);

      try {
        // Save result to backend
        const { data: savedResult } = await axios.post(
          `${API_BASE_URL}/quizzes/${quiz._id}/results`,
          {
            quizId: quiz._id,
            quizTitle: quiz.title,
            score,
            correctAnswers: correct,
            totalQuestions: originalQuestions.length,
            completedAt: new Date().toISOString(),
            wasRandomized: quiz.questions.length !== originalQuestions.length,
          }
        );

        // Navigate to results page using backend attemptId
        router.push(
          `/quiz/${quiz._id}/results?attempt=${savedResult.attemptId}`
        );
      } catch (err) {
        console.error("Error saving results:", err);
      }
    },
    [quiz, originalQuestions, selectedAnswers, router]
  );

  useEffect(() => {
    if (!quiz) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quiz, handleSubmit]);

  const handleAnswer = (idx: number) => {
    if (!quiz) return;
    const currentQ = quiz.questions[currentIndex];
    setSelectedAnswers({ ...selectedAnswers, [currentQ._id]: idx });
  };

  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, quiz!.questions.length - 1));
  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (loading || !quiz)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
          <div className="w-16 h-16 border-4 border-gradient-to-r from-green-500 via-emerald-500 to-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium text-gray-700">Fetching quiz…</p>
          <p className="text-sm text-gray-500">
            Please wait while we prepare your questions ✨
          </p>
        </div>
      </div>
    );

  const currentQ = quiz.questions[currentIndex];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <header className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            className="group rounded-full border bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 cursor-pointer text-white"
            onClick={() => router.push("/")}
          >
            <ChevronLeft className="w-6 h-6 mr-2" /> Back
          </Button>
          <h1 className="text-4xl font-bold">{quiz.title}</h1>
          <div
            className={`flex items-center gap-2 text-3xl font-semibold ${
              timeRemaining < 60 ? "text-red-600" : ""
            }`}
          >
            <Clock className="w-6 h-6" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        </header>

        <div className="flex flex-1 gap-6 border border-amber-200 rounded-lg shadow-lg bg-white p-12 mt-24">
          <div className="flex-1">
            <div className="mb-4 flex flex-col">
              <div className="text-sm text-gray-500 self-end">
                Question {currentIndex + 1} of {quiz.questions.length}
              </div>
              <div className="text-black text-xl md:text-2xl font-bold whitespace-pre-wrap mb-4">
                <span className="text-gray-500">{currentIndex + 1}.</span>{" "}
                {currentQ.title}
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {currentQ.options.map((opt, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 p-2 cursor-pointer transition-all duration-200"
                >
                  <input
                    type="radio"
                    name={`question-${currentQ._id}`}
                    checked={selectedAnswers[currentQ._id] === idx}
                    onChange={() => handleAnswer(idx)}
                    className="w-5 h-5 accent-blue-500"
                  />
                  <span className="text-lg">{opt}</span>
                </label>
              ))}
            </div>

            {currentQ.hint && (
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="show-hint"
                  checked={showHint}
                  onChange={() => setShowHint(!showHint)}
                  className="w-5 h-5 accent-yellow-400"
                />
                <label
                  htmlFor="show-hint"
                  className="text-sm font-medium cursor-pointer"
                >
                  Show Hint
                </label>
              </div>
            )}

            {showHint && currentQ.hint && (
              <p className="mt-2 p-3 bg-yellow-100 rounded text-gray-800">
                {currentQ.hint}
              </p>
            )}

            <div className="flex justify-between mt-6">
              <Button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              {currentIndex === quiz.questions.length - 1 ? (
                <Button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await handleSubmit(false);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={
                    selectedAnswers[currentQ._id] === undefined || loading
                  }
                  className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white cursor-pointer shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></span>
                      Submitting...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQ._id] === undefined}
                  className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 cursor-pointer"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
