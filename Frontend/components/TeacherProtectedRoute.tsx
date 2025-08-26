"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function TeacherProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (loading) return;

    // not logged in
    if (!user) {
      router.replace("/login");
      return;
    }

    // not a teacher
    if (user.role !== "teacher") {
      router.replace("/");
      return;
    }

    // (optional) make sure the URL /teachers-dashboard/[id] matches the logged-in teacher
    if (params?.id && params.id !== user._id) {
      router.replace(`/teachers-dashboard/${user._id}`);
    }
  }, [user, loading, router, params]);

  if (loading || !user || user.role !== "teacher") {
    return (
      <div className="min-h-[60vh] grid place-items-center">Checking permissions…</div>
    );
  }

  return <>{children}</>;
}
