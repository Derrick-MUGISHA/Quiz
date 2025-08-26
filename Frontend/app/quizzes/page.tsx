// app/quizzes/page.tsx
import { getQuizzes } from "@/api/getQuiz";
import QuizCards from "@/components/QuizCards";

export default async function QuizzesPage() {
  const { data, error } = await getQuizzes();

  return (
    <QuizCards
      initialQuizzes={data || []}
      initialError={error?.message || null}
    />
  );
}
