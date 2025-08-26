"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Question {
  _id: string;
  title: string;
  description?: string;
  code?: string;
  options: string[];
  correctAnswer: number; // index of correct option
  hint?: string;
  status: "draft" | "published" | "archived";
  category: string;
  rank: "beginner" | "intermediate" | "professional";
  createdAt: string;
}

interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
}

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (!params.quizId || !params.questionId) return;

    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quizzes/${params.quizId}`
        );
        const quizData: Quiz = res.data;
        const idx = quizData.questions.findIndex(
          (q) => q._id === params.questionId
        );
        setCurrentIndex(idx >= 0 ? idx : 0);
        setQuiz(quizData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params.quizId, params.questionId]);

  if (loading) return <p className="p-6">Loading question...</p>;
  if (!quiz) return <p className="p-6">Quiz not found!</p>;

  const currentQ = quiz.questions[currentIndex];

  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, quiz.questions.length - 1));

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <Button
            variant="ghost"
            className="group rounded-full border bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-6 h-6 mr-2" /> Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold">{quiz.title}</h1>
        </header>

        <div className="flex flex-col md:flex-row gap-6 border border-amber-200 rounded-lg shadow-lg bg-white p-6 md:p-12 mt-6">
          <div className="flex-1">
            <div className="mb-4 flex flex-col">
              <div className="text-sm text-gray-500 self-end">
                Question {currentIndex + 1} of {quiz.questions.length}
              </div>
              <div className="text-black text-xl md:text-2xl font-bold whitespace-pre-wrap mb-2">
                <span className="text-gray-500">{currentIndex + 1}.</span>{" "}
                {currentQ.title}
              </div>
              {currentQ.description && (
                <p className="text-gray-700 text-base md:text-lg mb-4 whitespace-pre-wrap">
                  {currentQ.description}
                </p>
              )}
              {currentQ.code && (
                <pre className="bg-gray-100 text-gray-800 p-4 rounded overflow-x-auto mb-4 text-sm md:text-base">
                  <code>{currentQ.code}</code>
                </pre>
              )}
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {currentQ.options.map((opt, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-2 p-2 rounded ${
                    idx === currentQ.correctAnswer
                      ? "bg-green-100 text-green-800 font-semibold"
                      : "hover:bg-gray-100 cursor-default"
                  } transition-all duration-200`}
                >
                  <input
                    type="radio"
                    checked={idx === currentQ.correctAnswer}
                    readOnly
                    className="w-5 h-5 accent-blue-500"
                  />
                  <span className="text-lg">{opt}</span>
                </label>
              ))}
            </div>

            {currentQ.hint && showHint && (
              <p className="mt-2 p-3 bg-yellow-100 rounded text-gray-800">
                <strong>Hint:</strong> {currentQ.hint}
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
              <Button
                onClick={handleNext}
                disabled={currentIndex === quiz.questions.length - 1}
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 cursor-pointer"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="mt-6 p-4 border rounded bg-gray-50 text-gray-700">
              <p>
                <strong>Status:</strong> {currentQ.status}
              </p>
              <p>
                <strong>Category:</strong> {currentQ.category}
              </p>
              <p>
                <strong>Rank:</strong> {currentQ.rank}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(currentQ.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
