"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function TeacherProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams(); 

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role.toLowerCase() !== "teacher") {
      router.replace("/");
      return;
    }

    if (params?.id && params.id !== user._id) {
      router.replace(`/teachers-dashboard/${user._id}`);
    }
  }, [user, loading, router, params]);

  if (loading || !user || user.role.toLowerCase() !== "teacher") {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        Checking permissions…
      </div>
    );
  }

  return <>{children}</>;
}
