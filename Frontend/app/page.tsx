"use client";

import { motion } from "framer-motion";
import DemoBackgroundPaths from "@/components/Background";
import QuizCards from "@/components/QuizCards";

export default function QuizListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden text-white mb-12"
      >
        <DemoBackgroundPaths />
      </motion.section>
      <main className="container max-w-12xl mx-auto px-12 flex flex-col justify-center mt-6">
        <QuizCards />
      </main>
    </div>
  );
}
