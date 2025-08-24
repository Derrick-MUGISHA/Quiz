import { Quiz } from "@/types/quiz";
import axios from "axios";

export async function getQuizzes(): Promise<{ data: Quiz[] | null; error: Error | null }> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  console.log("Fetching quizzes from:", `${API_URL}/quizzes`);

  try {
    const { data } = await axios.get<Quiz[]>(`${API_URL}/quizzes`);
    return { data, error: null };
  } catch (err: unknown) {
    console.error("Error fetching quizzes:", err);
    return { data: null, error: err instanceof Error ? err : new Error("Unknown error") };
  }
}
