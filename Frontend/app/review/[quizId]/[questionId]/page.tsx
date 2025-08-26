"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface Question {
  _id: string;
  title: string;
  description?: string;
  code?: string;
  options: string[];
  correctAnswer: number; 
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.quizId) return;

    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL_Auth}/api/quizzes/${params.quizId}`
        );
        setQuiz(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params.quizId]);

  if (loading)
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
  if (!quiz)
    return (
      <div className="flex flex-col justify-center items-center text-center py-16">
        <h3 className="text-xl md:text-2xl font-bold mb-2">
          Failed to load quizzes 😢
        </h3>
        {/* <p className="text-muted-foreground mb-4">{err}</p> */}
        <div className="flex justify-center">
          {/* <Button
            onClick={fetchQuizzes}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
          >
            <RefreshCw className="h-5 w-5" /> Retry
          </Button> */}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center p-6">
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

        <div className="flex flex-col gap-8">
          {quiz.questions.map((q, idx) => (
            <div
              key={q._id}
              className="border border-amber-200 rounded-lg shadow-lg bg-white p-6 md:p-12"
            >
              <div className="mb-4 flex flex-col">
                <div className="text-sm text-gray-500 self-end">
                  Question {idx + 1} of {quiz.questions.length}
                </div>
                <div className="text-black text-xl md:text-2xl font-bold whitespace-pre-wrap mb-2">
                  <span className="text-gray-500">{idx + 1}.</span> {q.title}
                </div>
                {q.description && (
                  <p className="text-gray-700 text-base md:text-lg mb-4 whitespace-pre-wrap">
                    {q.description}
                  </p>
                )}
                {q.code && (
                  <pre className="bg-gray-100 text-gray-800 p-4 rounded overflow-x-auto mb-4 text-sm md:text-base">
                    <code>{q.code}</code>
                  </pre>
                )}
              </div>

              <div className="flex flex-col gap-2 mb-4">
                {q.options.map((opt, idxOpt) => (
                  <div
                    key={idxOpt}
                    className={`flex items-center gap-2 p-2 rounded transition-all duration-200 ${
                      idxOpt === q.correctAnswer
                        ? "bg-green-100 text-green-800 font-semibold"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    <input
                      aria-label={`Option ${idxOpt + 1} for question ${
                        idx + 1
                      }`}
                      type="radio"
                      checked={idxOpt === q.correctAnswer}
                      readOnly
                      className="w-5 h-5 accent-blue-500"
                    />
                    <span className="text-lg">{opt}</span>
                  </div>
                ))}
              </div>

              {q.hint && (
                <p className="mt-2 p-3 bg-yellow-100 rounded text-gray-800">
                  <strong>Hint:</strong> {q.hint}
                </p>
              )}

              <div className="mt-6 p-4 border rounded bg-gray-50 text-gray-700">
                <p>
                  <strong>Status:</strong> {q.status}
                </p>
                <p>
                  <strong>Category:</strong> {q.category}
                </p>
                <p>
                  <strong>Rank:</strong> {q.rank}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(q.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
