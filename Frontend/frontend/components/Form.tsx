"use client";

import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast, Toaster } from "sonner";

export default function NewQuestionForm() {
  const [newQuestion, setNewQuestion] = useState({
    teacher: "",
    title: "",
    description: "",
    category: "",
    options: ["", ""],
    correctAnswer: 0,
    hint: "",
    score: 1,
    status: "draft",
    rank: "beginner",
    code: "",
  });

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const addOption = () =>
    setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ""] });
  const removeOption = (index: number) => {
    const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
    setNewQuestion({ ...newQuestion, options: updatedOptions });
    if (newQuestion.correctAnswer === index)
      setNewQuestion({ ...newQuestion, correctAnswer: 0 });
  };

  const submitNewQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newQuestion.teacher.trim()) {
      toast.error("Teacher name is required.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/quizzes", newQuestion);
      toast.success("Question created successfully!"); 

      setNewQuestion({
        teacher: "",
        title: "",
        description: "",
        category: "",
        options: ["", ""],
        correctAnswer: 0,
        hint: "",
        score: 1,
        status: "draft",
        rank: "beginner",
        code: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error creating question. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Toaster position="top-right" />
      <form
        onSubmit={submitNewQuestion}
        className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold">Create New Question</h2>

        {/* Required Fields */}
        <div>
          <Label className="mb-2">Teacher Name *</Label>
          <Input
            value={newQuestion.teacher}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, teacher: e.target.value })
            }
            placeholder="e.g., Ms. Jane Doe"
            required
          />
        </div>

        <div>
          <Label className="mb-2">Title *</Label>
          <Input
            value={newQuestion.title}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, title: e.target.value })
            }
            placeholder="Question title"
            required
          />
        </div>

        <div>
          <Label className="mb-2">Category *</Label>
          <Input
            value={newQuestion.category}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, category: e.target.value })
            }
            placeholder="Category"
            required
          />
        </div>

        <div>
          <Label className="mb-2">Description *</Label>
          <Textarea
            value={newQuestion.description}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, description: e.target.value })
            }
            placeholder="Enter question text"
            required
            rows={4}
          />
        </div>

        {/* Options */}
        <div>
          <Label className="mb-2">Options *</Label>
          {newQuestion.options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <Input
                value={opt}
                placeholder={`Option ${idx + 1}`}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                required
              />
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={newQuestion.correctAnswer === idx}
                  onChange={() =>
                    setNewQuestion({ ...newQuestion, correctAnswer: idx })
                  }
                />
                Correct
              </label>
              {newQuestion.options.length > 2 && (
                <Trash2
                  className="text-red-500 cursor-pointer"
                  onClick={() => removeOption(idx)}
                />
              )}
            </div>
          ))}
          <Button type="button" onClick={addOption} className="mt-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 cursor-pointer">
            <Plus /> Add Option
          </Button>
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2">Hint</Label>
            <Input
              value={newQuestion.hint}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, hint: e.target.value })
              }
              placeholder="Optional hint"
            />
          </div>

          <div>
            <Label className="mb-2">Score</Label>
            <Input
              type="number"
              min={1}
              value={newQuestion.score}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, score: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <Label className="mb-2">Status</Label>
            <select
              title="Select status"
              value={newQuestion.status}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, status: e.target.value })
              }
              className="w-full border rounded-md p-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <Label className="mb-2">Rank</Label>
            <select
              title="Select rank"
              value={newQuestion.rank}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, rank: e.target.value })
              }
              className="w-full border rounded-md p-2"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Label className="mb-2">Code Snippet</Label>
            <Textarea
              value={newQuestion.code}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, code: e.target.value })
              }
              rows={5}
              placeholder="Optional code snippet"
            />
          </div>
        </div>

        <div className="text-center">
          <Button type="submit" className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 cursor-pointer">Create Question</Button>
        </div>
      </form>
    </div>
  );
}
