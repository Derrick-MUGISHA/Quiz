"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface Question {
  _id: string;
  title: string; 
  description: string;
  status: "draft" | "published" | "archived";
  category: string;
  rank: "beginner" | "intermediate" | "professional";
  createdAt: string;
  quizId: string;
}

interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
}

type SortKey = "title" | "status" | "rank" | "category" | "createdAt";
type SortOrder = "asc" | "desc";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Filters
  const [filterTitle] = useState("");
  const [filterCategory] = useState("");
  const [filterRank] = useState("");
  const [filterStartDate] = useState("");
  const [filterEndDate] = useState("");

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://quiz-five-rho-90.vercel.app/api/quizzes");
      setQuizzes(res.data);
      const allQuestions = res.data.flatMap((quiz: Quiz) =>
        quiz.questions.map((q) => ({ ...q, quizId: quiz._id }))
      );
      setQuestions(allQuestions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const toggleQuestionStatus = async (
    quizId: string,
    questionId: string,
    currentStatus: "draft" | "published" | "archived"
  ) => {
    setUpdatingIds((prev) => [...prev, questionId]);
    try {
      const newStatus = currentStatus === "published" ? "draft" : "published";
      const res = await axios.patch(
        `https://quiz-five-rho-90.vercel.app/api/quizzes/${quizId}/questions/${questionId}/status`,
        { status: newStatus }
      );
      const updatedQuestion = res.data.question;
      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? updatedQuestion : q))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingIds((prev) => prev.filter((id) => id !== questionId));
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredQuestions = questions
    .filter((q) => {
      const matchesTitle = q.title
        ?.toLowerCase()
        .includes(filterTitle.toLowerCase());
      const matchesCategory = filterCategory
        ? q.category?.toLowerCase() === filterCategory.toLowerCase()
        : true;
      const matchesRank = filterRank
        ? q.rank?.toLowerCase() === filterRank.toLowerCase()
        : true;
      let matchesDate = true;
      if (filterStartDate)
        matchesDate = new Date(q.createdAt) >= new Date(filterStartDate);
      if (filterEndDate)
        matchesDate =
          matchesDate && new Date(q.createdAt) <= new Date(filterEndDate);
      return matchesTitle && matchesCategory && matchesRank && matchesDate;
    })
    .sort((a, b) => {
      let valA: string | number = a[sortKey] ?? "";
      let valB: string | number = b[sortKey] ?? "";
      if (sortKey === "createdAt") {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ">
      <div className="flex justify-between items-center mt-12">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <Button
          onClick={() => router.push("/teachersForm")}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 cursor-pointer"
        >
          <Plus /> New Question
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
            <div className="w-16 h-16 border-4 border-gradient-to-r from-green-500 via-emerald-500 to-teal-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-medium text-gray-700">Fetching data…</p>
            <p className="text-sm text-gray-500">
              Please wait while we prepare your content ✨
            </p>
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("title")}>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead onClick={() => handleSort("status")}>Status</TableHead>
              <TableHead onClick={() => handleSort("category")}>
                Category
              </TableHead>
              <TableHead onClick={() => handleSort("rank")}>Rank</TableHead>
              <TableHead onClick={() => handleSort("createdAt")}>
                Created At
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.map((q) => (
              <TableRow key={q._id}>
                <TableCell>{q.title}</TableCell>
                <TableCell className="max-w-sm truncate">
                  {q.description}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      q.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {q.status}
                  </Badge>
                </TableCell>
                <TableCell>{q.category}</TableCell>
                <TableCell className="capitalize">{q.rank}</TableCell>
                <TableCell>{new Date(q.createdAt).toLocaleString()}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert(`Review: ${q.title}`)}
                    className="cursor-pointer"
                  >
                    <Eye className="h-4 w-4" /> Review
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      toggleQuestionStatus(q.quizId, q._id, q.status)
                    }
                    disabled={updatingIds.includes(q._id)}
                    className={
                      q.status === "published"
                        ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                        : "bg-green-500 hover:bg-green-600 text-white "
                    }
                  >
                    {updatingIds.includes(q._id)
                      ? "Updating..."
                      : q.status === "published"
                      ? "Unpublish"
                      : "Publish"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
