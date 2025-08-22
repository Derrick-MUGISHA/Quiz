import type { FC } from "react";
import { Link } from "react-router-dom";
import type { Quiz } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";

interface Props {
  quiz: Quiz;
}

const QuizCard: FC<Props> = ({ quiz }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Questions: {quiz.questions.length}</p>
        <Link to={`/quiz/${quiz._id}`}>
          <Button>Take Quiz</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
