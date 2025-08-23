"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Shuffle, Clock } from "lucide-react";
import { useCallback } from "react";
interface Question {
  _id: string;
  title: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
  duration?: number;
}


export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attempt") || "";
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(15 * 60);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRandomized, setIsRandomized] = useState(true);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const savedAttempt = localStorage.getItem(`quiz-attempt-${attemptId}`);
    if (savedAttempt) {
      const parsed: Quiz = JSON.parse(savedAttempt);

      const publishedQuestions = parsed.questions;
      const randomQuestions = shuffleArray(publishedQuestions).slice(0, 20);

      setQuiz({ ...parsed, questions: randomQuestions });
      setOriginalQuestions(randomQuestions);
      setTimeRemaining((parsed.duration || 15) * 60);
    } else {
      router.push("/");
    }
  }, [attemptId, router]);

  
const handleSubmit = useCallback(() => {
  if (!quiz) return;

  let correct = 0;
  originalQuestions.forEach((q) => {
    if (selectedAnswers[q._id] === q.correctAnswer) correct++;
  });

  const score = Math.round((correct / originalQuestions.length) * 100);

  const resultData = {
    quizId: quiz._id,
    quizTitle: quiz.title,
    score,
    correctAnswers: correct,
    totalQuestions: originalQuestions.length,
    completedAt: new Date().toISOString(),
    wasRandomized: isRandomized,
  };

  localStorage.setItem(`quiz-result-${quiz._id}`, JSON.stringify(resultData));
  router.push(`/quiz/${quiz._id}/results`);
}, [quiz, originalQuestions, selectedAnswers, isRandomized, router]);


  // Timer
  useEffect(() => {
    if (timeRemaining > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isCompleted) handleSubmit();
  }, [timeRemaining, isCompleted, handleSubmit]);

  const handleAnswer = (idx: number) => {
    if (!quiz) return;
    const currentQ = quiz.questions[currentIndex];
    setSelectedAnswers({ ...selectedAnswers, [currentQ._id]: idx });
  };

  const handleNext = () => setCurrentIndex((prev) => Math.min(prev + 1, quiz!.questions.length - 1));
  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const handleRandomizeQuestions = () => {
    if (!quiz) return;
    if (isRandomized) {
      setQuiz({ ...quiz, questions: originalQuestions });
      setIsRandomized(false);
    } else {
      setQuiz({ ...quiz, questions: shuffleArray(originalQuestions) });
      setIsRandomized(true);
    }
    setCurrentIndex(0);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (!quiz)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const currentQ = quiz.questions[currentIndex];
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;
  const isLast = currentIndex === quiz.questions.length - 1;
  const answered = selectedAnswers[currentQ._id] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <header className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => router.push("/")}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h1 className="text-xl font-bold">{quiz.title}</h1>
        <div className={`flex items-center gap-2 text-sm font-semibold ${timeRemaining < 300 ? "text-red-600" : ""}`}>
          <Clock className="w-4 h-4" /> {formatTime(timeRemaining)}
        </div>
      </header>

      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={handleRandomizeQuestions} disabled={Object.keys(selectedAnswers).length > 0}>
          <Shuffle className="w-4 h-4 mr-1" /> {isRandomized ? "Reset" : "Randomize"}
        </Button>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{currentQ.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                className={`p-4 border rounded-lg text-left transition-colors duration-200 ${
                  selectedAnswers[currentQ._id] === idx
                    ? "bg-blue-200 border-blue-500"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => handleAnswer(idx)}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button onClick={handlePrev} disabled={currentIndex === 0}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            {isLast ? (
              <Button onClick={handleSubmit} disabled={!answered}>
                Submit
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!answered}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>

          <div className="mt-4 text-sm text-muted-foreground flex justify-between">
            <span>
              Question {currentIndex + 1} of {quiz.questions.length}
            </span>
            <span>{Math.round(progress)}% completed</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
