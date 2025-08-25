"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Share2,
  CheckCircle,
  Play,
  RefreshCw,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Quiz } from "@/types/quiz";
import { getQuizzes } from "@/api/getQuiz";
import { toast } from "sonner";

export default function QuizCards() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingQuizId, setLoadingQuizId] = useState<string | null>(null);

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await getQuizzes();

      if (error || !data) {
        throw new Error(error?.message || "Failed to fetch quizzes");
      }

      setQuizzes(data);
    } catch (err: unknown) {
      console.error("Error fetching quizzes:", err);
      setError(
        (err as Error).message || "Something went wrong while fetching quizzes."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const categories = [
    "All",
    ...Array.from(
      new Set(
        quizzes.flatMap((quiz) => quiz.questions?.map((q) => q.category) || [])
      )
    ),
  ];

  const filteredQuizzes =
    selectedCategory === "All"
      ? quizzes
      : quizzes.filter((quiz) =>
          quiz.questions?.some((q) => q.category === selectedCategory)
        );

  const getCategoryLogo = (category: string) => {
    const logos: { [key: string]: string } = {
      JavaScript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      C: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
      Cpp: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
      ["C#"]:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
      Python:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      PHP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
      Ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
      Swift:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
      TypeScript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      HTML5:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      CSS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      Go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
      Kotlin:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
      Rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
      Dart: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
      Lua: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lua/lua-original.svg",
      R: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg",
      Scala:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg",
      Haskell:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/haskell/haskell-original.svg",
      ObjectiveC:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/objectivec/objectivec-original.svg",
      Elixir:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elixir/elixir-original.svg",
      Perl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/perl/perl-original.svg",
      Shell:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
      PowerShell:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/powershell/powershell-original.svg",
      Groovy:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/groovy/groovy-original.svg",
      Solidity:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg",
      Julia:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/julia/julia-original.svg",
      VHDL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vhdl/vhdl-original.svg",
      Verilog:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/verilog/verilog-original.svg",
      Assembly:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/assembly/assembly-original.svg",
      Elm: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elm/elm-original.svg",
      Crystal:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/crystal/crystal-original.svg",
      Vala: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vala/vala-original.svg",
      Tcl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tcl/tcl-original.svg",
      Scheme:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scheme/scheme-original.svg",
      Fsharp:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fsharp/fsharp-original.svg",
      OCaml:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ocaml/ocaml-original.svg",
      D: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/d/d-original.svg",
      Apex: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apex/apex-original.svg",
      ActionScript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/actionscript/actionscript-original.svg",
      ABAP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/abap/abap-original.svg",
      Ada: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ada/ada-original.svg",
      ALGOL:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/algol/algol-original.svg",
      AWK: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/awk/awk-original.svg",
      BCPL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bcpl/bcpl-original.svg",
      BASH: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
      BC: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bc/bc-original.svg",
      Clojure:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/clojure/clojure-original.svg",
      CoffeeScript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/coffeescript/coffeescript-original.svg",

      SQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sql/sql-original.svg",
      VisualBasic:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualbasic/visualbasic-original.svg",
      VisualStudio:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-original.svg",
      WebAssembly:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webassembly/webassembly-original.svg",
      Windows:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows/windows-original.svg",
      WordPress:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg",
      Yarn: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/yarn/yarn-original.svg",
      Zsh: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/zsh/zsh-original.svg",
      React:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      TailwindCSS:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
      Bootstrap:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-plain.svg",
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

  const handleStartQuiz = async (quiz: Quiz) => {
    setLoadingQuizId(quiz._id);

    toast(`Starting quiz: ${quiz.title}`);
    
    try {
      const publishedQuestions = quiz.questions.filter(
        (q) => q.status === "published"
      );
      const selectedQuestions = shuffleArray(publishedQuestions).slice(0, 20);

      const attemptId = `${quiz._id}-${Date.now()}`;
      localStorage.setItem(
        `quiz-attempt-${attemptId}`,
        JSON.stringify({ ...quiz, questions: selectedQuestions })
      );

      
      await router.push(`/quiz/${quiz._id}?attempt=${attemptId}`);
    } finally {
      setLoadingQuizId(null);
    }
  };

  const handleShareQuiz = async (quiz: Quiz, event: React.MouseEvent) => {
    event.stopPropagation();
    const firstQuestion = quiz.questions[0];
    if (!firstQuestion?.shareLink) return;

    const shareText = `Check out this quiz: "${quiz.title}" - ${firstQuestion.description}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: quiz.title,
          text: shareText,
          url: firstQuestion.shareLink,
        });
      } else {
        await navigator.clipboard.writeText(
          `${shareText}\n${firstQuestion.shareLink}`
        );
        toast("Quiz link has been copied to clipboard.");
      }
    } catch {
      await navigator.clipboard.writeText(
        `${shareText}\n${firstQuestion.shareLink}`
      );
      toast("Quiz link has been copied to clipboard.");
    }
  };

  return (
    <main className="container max-w-8xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col justify-center mb-8">
      {/* Error Section */}
      {error && !loading && (
        <div className="flex flex-col justify-center items-center text-center py-16">
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Failed to load quizzes 😢
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex justify-center">
            <Button
              onClick={fetchQuizzes}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              <RefreshCw className="h-5 w-5" /> Retry
            </Button>
          </div>
        </div>
      )}

      {/* Categories */}
      {!error && (
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {loading
            ? Array(6)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="w-24 h-10 bg-gray-200 rounded-md animate-pulse"
                  />
                ))
            : categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm md:text-base font-medium ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white shadow-md cursor-pointer"
                      : "hover:bg-blue-50 hover:border-blue-300 cursor-pointer"
                  }`}
                >
                  {category !== "All" && (
                    <Image
                      src={getCategoryLogo(category)}
                      alt={`${category} logo`}
                      width={16}
                      height={16}
                      className="w-4 h-4 mr-1"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                  {category}
                </Button>
              ))}
        </div>
      )}

      {/* Quiz Cards */}
      {!error && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {loading
              ? Array(8)
                  .fill(0)
                  .map((_, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="h-52 sm:h-56 md:h-60 lg:h-64 bg-gray-200 rounded-lg animate-pulse"
                    />
                  ))
              : filteredQuizzes.map((quiz, idx) => {
                  const firstQuestion = quiz.questions[0];
                  return (
                    <motion.div
                      key={quiz._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      <Card className="h-full rounded-xl border shadow-md hover:shadow-xl transition-all flex flex-col">
                        <div className="relative w-full h-40 sm:h-44 md:h-48 lg:h-56 xl:h-64 overflow-hidden rounded-t-xl">
                          <Image
                            src={getCategoryLogo(firstQuestion?.category)}
                            alt={`${firstQuestion?.category} logo`}
                            fill
                            className="object-cover w-full h-full brightness-75"
                          />
                        </div>

                        {/* Card Content */}
                        <div className="flex flex-col flex-1">
                          <CardHeader className="flex justify-between items-start px-4 pt-3">
                            <CardTitle className="text-lg md:text-xl font-semibold line-clamp-2">
                              {quiz.title}
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleShareQuiz(quiz, e)}
                              className="h-10 w-10 p-0 opacity-60 hover:opacity-100 cursor-pointer"
                            >
                              <Share2 className="h-10 w-20" />
                            </Button>
                          </CardHeader>

                          <div className="flex items-center gap-2 justify-between px-4 mt-1 text-xs md:text-sm">
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                              {firstQuestion?.status === "published"
                                ? "Published"
                                : "Draft"}
                              <CheckCircle className="h-4 w-4" />
                            </div>
                            <span className="text-muted-foreground font-medium">
                              Date:{" "}
                              {new Date(quiz.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <CardContent className="flex items-center justify-between px-6 mt-3 mb-3 gap-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <BookOpen className="h-5 w-5 text-blue-600" />
                              {quiz.questions.length} Questions
                            </div>
                            <Button
                              size="lg"
                              disabled={loadingQuizId === quiz._id}
                              onClick={() => handleStartQuiz(quiz)}
                              className="rounded-full p-4 md:p-5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white shadow-lg hover:scale-105 transition-transform cursor-pointer"
                            >
                              {loadingQuizId === quiz._id ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                              ) : (
                                <Play className="h-6 w-6 md:h-7 md:w-7" />
                              )}
                            </Button>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
          </motion.div>
        </AnimatePresence>
      )}
    </main>
  );
}
