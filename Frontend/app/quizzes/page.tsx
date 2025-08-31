import dynamic from "next/dynamic";
const QuizCards = dynamic(() => import("@/components/QuizCards"), { ssr: false });

export default function QuizzesPage() {
  return <QuizCards />;
}
