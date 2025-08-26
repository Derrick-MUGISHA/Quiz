"use client";

import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast, Toaster } from "sonner";

type Question = {
  teacher: string;
  title: string;
  description: string;
  category: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  score: number;
  status: "draft" | "published" | "archived";
  rank: "beginner" | "intermediate" | "professional";
  code: string;
};

export default function NewQuizForm() {
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      teacher: "",
      title: "",
      description: "",
      category: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      hint: "",
      score: 1,
      status: "draft",
      rank: "beginner",
      code: "",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = <K extends keyof Question>(
    index: number,
    field: K,
    value: Question[K]
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addOption = (qIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(updatedQuestions);
  };

  const addQuestion = () =>
    setQuestions([
      ...questions,
      {
        teacher: "",
        title: "",
        description: "",
        category: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        hint: "",
        score: 1,
        status: "draft",
        rank: "beginner",
        code: "",
      },
    ]);

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const submitQuiz = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!quizTitle.trim()) {
    toast.error("Quiz title is required.");
    return;
  }

  try {
    setLoading(true);
    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL_Auth}/api/quizzes`, {
      title: quizTitle,
      questions,
    });
    toast.success("Quiz created successfully!");
    setQuizTitle("");
    setQuestions([
      {
        teacher: "",
        title: "",
        description: "",
        category: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        hint: "",
        score: 1,
        status: "draft",
        rank: "beginner",
        code: "",
      },
    ]);
  } catch (err) {
    console.error(err);
    toast.error("Error creating quiz. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 min-h-screen p-6">
      <Toaster position="top-right" />
      <form
        onSubmit={submitQuiz}
        className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-indigo-600">
          Create New Quiz
        </h2>

        <div className="mb-6">
          <Label className="mb-2 text-lg font-medium">Quiz Title *</Label>
          <Input
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter quiz title"
            required
            className="border-indigo-300 focus:ring-indigo-400 focus:border-indigo-400"
          />
        </div>

        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="bg-gradient-to-r from-white to-indigo-50 border border-indigo-100 shadow-lg rounded-xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-indigo-700">
                Question {qIndex + 1}
              </h3>
              {questions.length > 1 && (
                <Trash2
                  className="text-red-500 cursor-pointer hover:text-red-700"
                  onClick={() => removeQuestion(qIndex)}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={q.teacher}
                placeholder="Teacher Name"
                onChange={(e) =>
                  handleQuestionChange(qIndex, "teacher", e.target.value)
                }
                required
              />
              <Input
                value={q.title}
                placeholder="Question Title"
                onChange={(e) =>
                  handleQuestionChange(qIndex, "title", e.target.value)
                }
                required
              />
              <Input
                value={q.category}
                placeholder="Category"
                onChange={(e) =>
                  handleQuestionChange(qIndex, "category", e.target.value)
                }
                required
              />
              <Textarea
                value={q.description}
                placeholder="Question Description"
                onChange={(e) =>
                  handleQuestionChange(qIndex, "description", e.target.value)
                }
                required
                rows={3}
              />
            </div>

            <div>
              <Label>Options</Label>
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2 mb-2">
                  <Input
                    value={opt}
                    placeholder={`Option ${oIndex + 1}`}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                    required
                  />
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={`correctAnswer-${qIndex}`}
                      checked={q.correctAnswer === oIndex}
                      onChange={() =>
                        handleQuestionChange(qIndex, "correctAnswer", oIndex)
                      }
                    />
                    Correct
                  </label>
                  {q.options.length > 2 && (
                    <Trash2
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      onClick={() => removeOption(qIndex, oIndex)}
                    />
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={() => addOption(qIndex)}
                className="mt-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white flex items-center gap-2 cursor-pointer"
              >
                <Plus /> Add Option
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Input
                value={q.hint}
                placeholder="Hint"
                onChange={(e) =>
                  handleQuestionChange(qIndex, "hint", e.target.value)
                }
              />
              <Input
                type="number"
                value={q.score}
                placeholder="Score"
                min={1}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "score", Number(e.target.value))
                }
              />
              <select
                title="Select status"
                value={q.status}
                onChange={(e) =>
                  handleQuestionChange(
                    qIndex,
                    "status",
                    e.target.value as Question["status"]
                  )
                }
                className="border rounded-md p-2"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <select
                title="Select Rank"
                id={`rank-${qIndex}`}
                value={q.rank}
                onChange={(e) =>
                  handleQuestionChange(
                    qIndex,
                    "rank",
                    e.target.value as Question["rank"]
                  )
                }
                className="border rounded-md p-2"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="professional">Professional</option>
              </select>
            </div>

            <Textarea
              value={q.code}
              placeholder="Code snippet (optional)"
              onChange={(e) =>
                handleQuestionChange(qIndex, "code", e.target.value)
              }
              rows={4}
            />
          </div>
        ))}

        <div className="flex flex-wrap gap-4 justify-between mt-6">
          <Button
            type="button"
            onClick={addQuestion}
            className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white flex items-center gap-2  cursor-pointer"
          >
            <Plus /> Add Another Question
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className={`bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white flex items-center justify-center transition-all duration-300 ease-in-out transform ${
              loading
                ? "opacity-70 scale-95 cursor-not-allowed"
                : "hover:scale-105"
            }`}
          >
            {loading ? "Submitting..." : "Submit Quiz"}
          </Button>
        </div>
      </form>
    </div>
  );
}
