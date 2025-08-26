"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  Clock, 
  Target, 
  BookOpen,
  CheckCircle,
  Shield,
  Hash,
  Award,
  TrendingUp,
  Eye
} from "lucide-react";

interface QuizHistory {
  _id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  completedAt: string;
  answeredQuestions: unknown[];
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  role: string;
  totalQuestionsAnswered: number;
  totalScore: number;
  totalTimeTaken: number;
  userId: string;
  quizHistory: QuizHistory[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function StudentStatusPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);

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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const getAverageScore = () => {
    if (!user?.quizHistory.length) return 0;
    const total = user.quizHistory.reduce((sum, quiz) => sum + quiz.score, 0);
    return Math.round(total / user.quizHistory.length);
  };

  const getRoleColor = (role: string) => {
    return role === "Teacher" 
      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-gradient-to-r from-green-500 via-emerald-500 to-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium animate-pulse text-gray-700">
            Loading student profile...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 space-y-4">
        <div className="text-center">
          <p className="text-red-500 font-semibold text-lg mb-4">{error}</p>
          <Button 
            onClick={fetchProfile} 
            className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:scale-105 transition-transform"
          >
            Retry Loading
          </Button>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <p className="text-lg font-medium text-gray-600">No user data found.</p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Button
            variant="ghost"
            className="group rounded-full border bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:scale-105 transition-transform flex items-center shadow-lg"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          
          <div className="text-center md:text-right">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Student Dashboard
            </h1>
            <p className="text-lg text-gray-600 mt-1">Welcome back, {user.name}!</p>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Quizzes Taken</p>
                  <p className="text-3xl font-bold text-green-800">{user.quizHistory.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Questions</p>
                  <p className="text-3xl font-bold text-blue-800">{user.totalQuestionsAnswered}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Average Score</p>
                  <p className="text-3xl font-bold text-purple-800">{getAverageScore()}%</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Time Spent</p>
                  <p className="text-3xl font-bold text-orange-800">{formatDuration(user.totalTimeTaken)}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <Card className="shadow-xl rounded-xl hover:shadow-2xl transition-all bg-white border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <User className="h-6 w-6" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-gray-800">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <Badge className={`${getRoleColor(user.role)} font-semibold`}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email Verified</p>
                      <Badge className={user.isEmailVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {user.isEmailVerified ? "Verified" : "Not Verified"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-500">Joined</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-teal-500" />
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Information */}
          <Card className="shadow-xl rounded-xl hover:shadow-2xl transition-all bg-white border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Hash className="h-6 w-6" />
                Technical Details
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                  className="ml-auto text-white hover:bg-white/20"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {showSensitiveInfo ? "Hide" : "Show"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-purple-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Database ID</p>
                    <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded break-all">
                      {showSensitiveInfo ? user._id : "••••••••••••••••"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded break-all">
                      {showSensitiveInfo ? user.userId : "••••••••••••••••"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Password Hash</p>
                    <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded break-all">
                      {showSensitiveInfo ? user.password : "••••••••••••••••••••••••••••••••"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Version</p>
                    <Badge variant="outline">v{user.__v}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Performance */}
        <Card className="shadow-xl rounded-xl hover:shadow-2xl transition-all bg-white border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Quiz Performance History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {user.quizHistory.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {user.quizHistory.map((quiz, index) => (
                    <Card key={quiz._id || index} className="hover:shadow-md transition-all duration-200 border border-gray-200">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-gray-800 leading-tight">{quiz.quizTitle}</h4>
                            <Badge 
                              className={`ml-2 ${
                                quiz.score >= 80 
                                  ? 'bg-green-100 text-green-800' 
                                  : quiz.score >= 60 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {quiz.score}%
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Correct Answers</p>
                              <p className="font-semibold text-green-600">
                                {quiz.correctAnswers}/{quiz.totalQuestions}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Time Taken</p>
                              <p className="font-semibold text-blue-600">
                                {formatDuration(quiz.timeTaken)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              Completed: {new Date(quiz.completedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No quizzes taken yet</p>
                <p className="text-gray-400">Start taking quizzes to see your performance here!</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </main>
  );
}