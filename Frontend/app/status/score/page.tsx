"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

      const res = await axios.get("https://quiz-2-sb0l.onrender.com/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-medium animate-pulse">
          Loading student data...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
        <p className="text-red-500 font-semibold">{error}</p>
        <Button onClick={fetchProfile}>Retry</Button>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-medium">No user data found.</p>
      </div>
    );

  return (
    <main className="container max-w-4xl mx-auto px-6 py-10 space-y-6">
      {/* Student Profile */}
      <Card className="shadow-lg hover:shadow-xl transition">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Student Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Total Questions Answered:</strong>{" "}
            {user.totalQuestionsAnswered}
          </p>
          <p>
            <strong>Total Score:</strong> {user.totalScore}
          </p>
          <p>
            <strong>Total Time Taken:</strong> {user.totalTimeTaken} sec
          </p>
        </CardContent>
      </Card>

      {/* Quiz History */}
      <Card className="shadow-lg hover:shadow-xl transition">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quiz History</CardTitle>
        </CardHeader>
        <CardContent>
          {user.quizHistory.length > 0 ? (
            <ul className="space-y-4">
              {user.quizHistory.map((quiz) => (
                <li
                  key={quiz.quizId}
                  className="border p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                >
                  <p className="font-semibold text-lg">{quiz.quizTitle}</p>
                  <p>
                    Score: {quiz.score} / {quiz.totalQuestions}
                  </p>
                  <p>Correct Answers: {quiz.correctAnswers}</p>
                  <p>
                    Completed At: {new Date(quiz.completedAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No quizzes taken yet.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
