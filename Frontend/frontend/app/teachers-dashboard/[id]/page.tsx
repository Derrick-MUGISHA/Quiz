"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface Question {
  _id: string;
  title: string;
  description: string;
  status: "draft" | "published" | "archived";
  shareLink: string;
  dueDate?: string;
  dueTime?: string;
}

interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
}

export default function TeacherDashboardPage() {
  const params = useParams();
  const teacherId = params?.id as string;

  const [token, setToken] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [publishingIds, setPublishingIds] = useState<string[]>([]);

  // Check teacher token from cookie
  useEffect(() => {
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("teacherToken="))
      ?.split("=")[1];

    if (cookieToken && cookieToken === teacherId) {
      setToken(cookieToken);
    } else {
      setToken(null);
    }
  }, [teacherId]);

  // Fetch all quizzes
  const fetchQuizzes = React.useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/quizzes");
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchQuizzes();
  }, [token, fetchQuizzes]);

  // Publish a single question
  const publishQuestion = async (quizId: string, questionId: string) => {
    if (!token) return;
    setPublishingIds((prev) => [...prev, questionId]);
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/${quizId}/questions/${questionId}/status`,
        { status: "published" }
      );

      const updatedQuestion = res.data.question;

      setQuizzes((prev) =>
        prev.map((quiz) =>
          quiz._id === quizId
            ? {
                ...quiz,
                questions: quiz.questions.map((q) =>
                  q._id === questionId ? updatedQuestion : q
                ),
              }
            : quiz
        )
      );
    } catch (err) {
      console.error("Failed to publish question:", err);
    } finally {
      setPublishingIds((prev) => prev.filter((id) => id !== questionId));
    }
  };

  // Publish all questions for a quiz
  const publishAllQuestions = async (quizId: string) => {
    const quiz = quizzes.find((q) => q._id === quizId);
    if (!quiz) return;

    const unpublished = quiz.questions.filter((q) => q.status !== "published");

    // Batch publish sequentially (can be changed to Promise.all if needed)
    for (const q of unpublished) {
      await publishQuestion(quizId, q._id);
    }
  };

  if (!token) {
    return <h1 className="text-red-600 text-xl">Unauthorized Access 🚫</h1>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Teacher Dashboard</h1>
      <p className="text-gray-700 text-center">Your token: {token}</p>

      {loading && <p className="text-gray-500 mt-4 text-center">Loading quizzes...</p>}

      <div className="grid gap-8">
        {quizzes.map((quiz) => {
          const publishedQuestions = quiz.questions.filter(
            (q) => q.status === "published"
          );
          const unpublishedQuestions = quiz.questions.filter(
            (q) => q.status !== "published"
          );

          return (
            <div key={quiz._id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>

              {/* Unpublished Questions */}
              {unpublishedQuestions.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-yellow-600 mb-2">
                    Unpublished Questions
                  </h3>

                  <div className="grid gap-4">
                    {unpublishedQuestions.map((q) => (
                      <div
                        key={q._id}
                        className="p-4 border border-yellow-300 rounded-lg flex justify-between items-start bg-yellow-50"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{q.title}</h4>
                          <p className="text-gray-700 mt-1">{q.description}</p>
                          {q.dueDate && (
                            <p className="text-sm mt-1 text-gray-500">
                              Due: {q.dueDate} {q.dueTime}
                            </p>
                          )}
                          <a
                            href={q.shareLink}
                            target="_blank"
                            className="text-blue-600 text-sm mt-1 block"
                          >
                            Share Link
                          </a>
                        </div>
                        <Button
                          onClick={() => publishQuestion(quiz._id, q._id)}
                          disabled={publishingIds.includes(q._id)}
                        >
                          {publishingIds.includes(q._id) ? "Publishing..." : "Publish"}
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Publish All button */}
                  {unpublishedQuestions.length > 1 && (
                    <Button
                      className="mt-4"
                      onClick={() => publishAllQuestions(quiz._id)}
                    >
                      Publish All
                    </Button>
                  )}
                </div>
              )}

              {/* Published Questions */}
              {publishedQuestions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-green-600 mb-2">
                    Published Questions
                  </h3>
                  <div className="grid gap-4">
                    {publishedQuestions.map((q) => (
                      <div
                        key={q._id}
                        className="p-4 border border-green-300 rounded-lg bg-green-50"
                      >
                        <h4 className="font-medium text-lg">{q.title}</h4>
                        <p className="text-gray-700 mt-1">{q.description}</p>
                        {q.dueDate && (
                          <p className="text-sm mt-1 text-gray-500">
                            Due: {q.dueDate} {q.dueTime}
                          </p>
                        )}
                        <a
                          href={q.shareLink}
                          target="_blank"
                          className="text-blue-600 text-sm mt-1 block"
                        >
                          Share Link
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {quiz.questions.length === 0 && (
                <p className="text-gray-500 mt-2">No questions yet.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
