"use client";

import dynamic from "next/dynamic";

const QuizCards = dynamic(() => import("./QuizCards"), {
  ssr: false,
});

export default function QuizCardsClientWrapper() {
  return <QuizCards />;
}
