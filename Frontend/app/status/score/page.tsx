"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

interface QuizHistory {
  quizId: string;
  quizTitle: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
  totalQuestionsAnswered: number;
  totalScore: number;
  totalTimeTaken: number;
  quizHistory: QuizHistory[];
}

export default function StudentStatusPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_Auth}/api/users/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data);
    } catch (err: unknown) {
      let message = "Failed to load profile";

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.error || err.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-medium animate-pulse text-gray-600">
          Loading student data...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <p className="text-red-500 font-semibold">{error}</p>
        <Button onClick={fetchProfile} className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white">
          Retry
        </Button>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-medium text-gray-600">No user data found.</p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <Button
            variant="ghost"
            className="group rounded-full border bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:scale-105 transition-transform flex items-center"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Student Profile
            <span className="text-lg text-gray-500 block md:inline ml-0 md:ml-2">– {user.name}</span>
          </h1>
        </div>

        {/* Profile Card */}
        <Card className="shadow-xl rounded-xl hover:shadow-2xl transition-all bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
            <div>
              <p><strong>Total Questions Answered:</strong> {user.totalQuestionsAnswered}</p>
              <p><strong>Total Score:</strong> {user.totalScore}</p>
              <p><strong>Total Time Taken:</strong> {user.totalTimeTaken} sec</p>
            </div>
          </CardContent>
        </Card>

        {/* Quiz History */}
        <Card className="shadow-xl rounded-xl hover:shadow-2xl transition-all bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">Quiz History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.quizHistory.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.quizHistory.map((quiz) => (
                  <li
                    key={quiz.quizId}
                    className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200 bg-white"
                  >
                    <p className="font-semibold text-lg text-gray-800">{quiz.quizTitle}</p>
                    <p className="text-gray-600">Score: {quiz.score} / {quiz.totalQuestions}</p>
                    <p className="text-gray-600">Correct Answers: {quiz.correctAnswers}</p>
                    <p className="text-gray-500 text-sm">
                      Completed At: {new Date(quiz.completedAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-6">No quizzes taken yet.</p>
            )}
          </CardContent>
        </Card>

      </div>
    </main>
  );
}
