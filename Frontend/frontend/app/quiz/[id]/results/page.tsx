"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, RotateCcw, Home, Share2, Copy } from "lucide-react";

interface QuizResult {
  quizId: string;
  quizTitle: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
  wasRandomized?: boolean;
}

export default function QuizResultsPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const savedResult = localStorage.getItem(`quiz-result-${quizId}`);
    if (savedResult) setResult(JSON.parse(savedResult));
  }, [quizId]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90)
      return { text: "Excellent!", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" };
    if (score >= 80)
      return { text: "Great Job!", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" };
    if (score >= 70)
      return { text: "Good Work!", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" };
    if (score >= 60)
      return { text: "Not Bad!", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" };
    return { text: "Keep Trying!", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" };
  };

  const handleRetakeQuiz = () => {
    localStorage.removeItem(`quiz-result-${quizId}`);
    router.push(`/quiz/${quizId}`);
  };

  const handleShareResults = async () => {
    if (!result) return;
    const shareText = `I scored ${result.score}% on "${result.quizTitle}"! ${result.correctAnswers}/${result.totalQuestions} correct.${result.wasRandomized ? " (Randomized questions)" : ""}`;
    const quizUrl = `${window.location.origin}/quiz/${result.quizId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quiz Results: ${result.quizTitle}`,
          text: shareText,
          url: quizUrl,
        });
      } catch {
        await navigator.clipboard.writeText(`${shareText}\n\nTry the quiz yourself: ${quizUrl}`);
        alert("Results copied to clipboard!");
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\n\nTry the quiz yourself: ${quizUrl}`);
      alert("Results copied to clipboard!");
    }
  };

  const handleCopyQuizLink = async () => {
    if (!result) return;
    const quizUrl = `${window.location.origin}/quiz/${result.quizId}`;
    await navigator.clipboard.writeText(quizUrl);
    alert("Quiz link copied to clipboard!");
  };

  if (!result)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No results found</h2>
          <p className="text-muted-foreground mb-4">Complete a quiz to see your results here.</p>
          <Button onClick={() => router.push("/")}>Back to Quiz List</Button>
        </div>
      </div>
    );

  const scoreBadge = getScoreBadge(result.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
      <main className="max-w-3xl mx-auto">
        <Card className="text-center shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-tr from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                <Trophy className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl mb-2 font-bold">Quiz Complete!</CardTitle>
            <p className="text-lg text-muted-foreground">{result.quizTitle}</p>
            {result.wasRandomized && (
              <Badge variant="outline" className="mt-2">
                Questions were randomized
              </Badge>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score */}
            <div className="space-y-4">
              <div>
                <div className={`text-6xl font-extrabold ${getScoreColor(result.score)}`}>{result.score}%</div>
                <Badge className={`mt-2 px-4 py-1 rounded-full font-medium ${scoreBadge.color}`}>
                  {scoreBadge.text}
                </Badge>
              </div>

              {/* Correct / Incorrect */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{result.correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="bg-red-100 dark:bg-red-900 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {result.totalQuestions - result.correctAnswers}
                  </div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
              </div>

              {/* Completion Info */}
              <div className="text-sm text-muted-foreground">
                Completed on {new Date(result.completedAt).toLocaleDateString()} at{" "}
                {new Date(result.completedAt).toLocaleTimeString()}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                <Button onClick={handleRetakeQuiz} variant="outline" className="gap-2">
                  <RotateCcw className="h-4 w-4" /> Retake Quiz
                </Button>
                <Button onClick={handleShareResults} variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" /> Share Results
                </Button>
                <Button onClick={handleCopyQuizLink} variant="outline" className="gap-2">
                  <Copy className="h-4 w-4" /> Copy Quiz Link
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  className="gap-2 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 text-white"
                >
                  <Home className="h-4 w-4" /> Back to Quizzes
                </Button>
              </div>
            </div>
            </CardContent>
          </Card>
      </main>
      </div>
    
  );
}
