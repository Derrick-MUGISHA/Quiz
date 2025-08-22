import { Button } from "@/components/components/ui/button";
import QuizCard from "@/components/QuizCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "src/api/api";
import type { Quiz } from "src/types";

export default function QuizList() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    
    useEffect(() => {
        api.get("/quizzes").then(res => setQuizzes(res.data))
    }, []);

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">AVAILABLE Quizzes</h1>
            <Link to="/create">
                <Button variant="outline"> + Create Quiz</Button>
            </Link>
            {quizzes.map( q => <QuizCard key={q._id} quiz={q} /> )}
        </div>
    )
}