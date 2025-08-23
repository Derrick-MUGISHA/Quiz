"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Share2, Users, Award, Play } from "lucide-react";

interface Question {
  _id: string;
  title: string;
  category: string;
  teacher: string;
  description: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  score: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  shareLink: string;
}

interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function QuizListPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        // Load from localStorage cache first
        const cached = localStorage.getItem("quizzes");
        if (cached) setQuizzes(JSON.parse(cached));

        // Fetch from backend
        const { data } = await axios.get<Quiz[]>(
          "http://localhost:5000/api/quizzes"
        );

        setQuizzes(data);
        localStorage.setItem("quizzes", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const categories = [
    "All",
    ...Array.from(
      new Set(
        quizzes.flatMap((quiz) =>
          Array.isArray(quiz.questions)
            ? quiz.questions.map((q) => q.category)
            : []
        )
      )
    ),
  ];

  const filteredQuizzes =
    selectedCategory === "All"
      ? quizzes
      : quizzes.filter((quiz) =>
          Array.isArray(quiz.questions)
            ? quiz.questions.some((q) => q.category === selectedCategory)
            : false
        );

  const getCategoryLogo = (category: string) => {
    const logos: { [key: string]: string } = {
      Programming:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      JavaScript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      C: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
      Cpp: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
      Csharp:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
      Python:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      PHP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
      Ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
      Swift:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
      TypeScript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      React:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      Design:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      HTML: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      CSS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    };
    return (
      logos[category] ||
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg"
    );
  };

  const shuffleArray = <T,>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleStartQuiz = (quiz: Quiz) => {
    const publishedQuestions = quiz.questions.filter(
      (q) => q.status === "published"
    );
    const selectedQuestions = shuffleArray(publishedQuestions).slice(0, 20);
    const attemptId = `${quiz._id}-${Date.now()}`;
    localStorage.setItem(
      `quiz-attempt-${attemptId}`,
      JSON.stringify({ ...quiz, questions: selectedQuestions })
    );
    router.push(`/quiz/${quiz._id}?attempt=${attemptId}`);
  };

  const handleShareQuiz = async (quiz: Quiz, event: React.MouseEvent) => {
    event.stopPropagation();
    const firstQuestion = quiz.questions[0];
    const shareText = `Check out this quiz: "${quiz.title}" - ${firstQuestion?.description}`;

    if (navigator.share && firstQuestion?.shareLink) {
      try {
        await navigator.share({
          title: quiz.title,
          text: shareText,
          url: firstQuestion.shareLink,
        });
      } catch {
        await navigator.clipboard.writeText(
          `${shareText}\n${firstQuestion?.shareLink}`
        );
        alert("Quiz link copied to clipboard!");
      }
    } else if (firstQuestion?.shareLink) {
      await navigator.clipboard.writeText(
        `${shareText}\n${firstQuestion.shareLink}`
      );
      alert("Quiz link copied to clipboard!");
    }
  };

  const skeletonArray = Array(6).fill(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
            >
              Quiz Hub
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed"
            >
              Master new skills, test your knowledge, and track your learning
              journey with our comprehensive quiz platform
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <div className="flex items-center gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">10K+ Learners</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span className="font-medium">500+ Quizzes</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent" />
      </motion.section>
      <main className="container mx-auto px-4 py-12">
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {loading
            ? Array(6)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="w-32 h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
                  />
                ))
            : categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="lg"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 text-base font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {category !== "All" && (
                    <img
                      src={getCategoryLogo(category)}
                      alt={`${category} logo`}
                      className="w-5 h-5 mr-2"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                  {category}
                </Button>
              ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {loading
              ? skeletonArray.map((_, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                  />
                ))
              : filteredQuizzes.map((quiz, index) => {
                  const firstQuestion = quiz.questions[0];
                  return (
                    <motion.div
                      key={quiz._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="h-full bg-white dark:bg-slate-900 border-0 shadow-lg overflow-hidden">
                        <div className="relative h-48 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 flex items-center justify-center overflow-hidden">
                          <div className="relative z-10 w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center border border-slate-200 dark:border-slate-600">
                            <img
                              src={getCategoryLogo(firstQuestion?.category)}
                              alt={`${firstQuestion?.category} logo`}
                              className="w-16 h-16 object-contain"
                            />
                          </div>
                        </div>

                        <CardHeader className="pb-3 flex justify-between items-start">
                          <CardTitle className="text-xl font-bold line-clamp-2">
                            {quiz.title}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleShareQuiz(quiz, e)}
                            className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </CardHeader>

                        <CardContent className="pt-0 flex flex-col flex-1 justify-between">
                          <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-6">
                            {firstQuestion?.status}
                          </CardDescription>

                          <div className="space-y-4">
                            <div className="flex items-center justify-center gap-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                  <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="font-medium">
                                  {quiz.questions.length} questions
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <span className="text-xs text-muted-foreground font-medium">
                                Created{" "}
                                {new Date(quiz.createdAt).toLocaleDateString()}
                              </span>
                              <Button
                                size="lg"
                                onClick={() => handleStartQuiz(quiz)}
                                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-2.5 text-base font-bold"
                              >
                                <Play className="h-5 w-5 mr-2" />
                                Start Quiz
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
          </motion.div>
        </AnimatePresence>

        {filteredQuizzes.length === 0 && !loading && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-3">No quizzes found</h3>
            <p className="text-muted-foreground text-lg mb-8">
              {selectedCategory === "All"
                ? "No quizzes available yet. Be the first to create one!"
                : `No quizzes found in the ${selectedCategory} category.`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
