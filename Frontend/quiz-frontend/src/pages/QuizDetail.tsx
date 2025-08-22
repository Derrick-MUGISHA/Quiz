import { Button } from "@/components/components/ui/button";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import api from "src/api/api";
import type { Quiz } from "src/types";

export default function QuizDetail() {
    const { id } = useParams<{ id: string}>();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [answers, setAnswers] = useState<number[]>([]);
    useEffect(() => {
        api.get(`/quizzes/${id}`).then(res => setQuiz(res.data))
    }, [id]);

    const handleSubmit = () => {
        api.post(`/quizzes/${id}/submit`, { answers })
        .then(res => Navigate("/result", { state: res.data}))
    };

    if (!quiz) return <p>loading</p>

     return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      {quiz.questions.map((q, i) => (
        <div key={i} className="mb-4 p-4 border rounded">
          <h2 className="font-semibold">{q.title} - {q.category}</h2>
          <p className="mb-2">{q.text}</p>
          {q.options.map((opt, j) => (
            <label key={j} className="block mb-1">
              <input
                type="radio"
                name={`q${i}`}
                onChange={() => {
                  const a = [...answers];
                  a[i] = j;
                  setAnswers(a);
                }}
              />
              <span className="ml-2">{opt}</span>
            </label>
          ))}
        </div>
      ))}
      <Button onClick={handleSubmit}>Submit Quiz</Button>
    </div>
  );
}