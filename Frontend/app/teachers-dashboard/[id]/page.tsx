"use client";

import TeacherDashboardPage from "@/components/TeacherDashboardPage";
import TeacherProtectedRoute from "@/components/TeacherProtectedRoute";


export default function Page() {
  return (
    <TeacherProtectedRoute>
      <TeacherDashboardPage />
    </TeacherProtectedRoute>
  );
}
