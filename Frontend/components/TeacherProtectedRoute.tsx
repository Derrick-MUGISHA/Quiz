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

    // if (params?.id && params.id !== user._id) {
    //   router.replace(`/teachers-dashboard/${user._id}`);
    // }
    if (!params?.id || params.id !== user._id) {
      router.replace(`/teachers-dashboard/${user._id}`);
    }
  }, [user, loading, router, params]);

  if (loading || !user || user.role.toLowerCase() !== "teacher") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
          <div className="w-16 h-16 border-4 border-gradient-to-r from-green-500 via-emerald-500 to-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium text-gray-700">
            Access Checking...
          </p>
          <p className="text-sm text-gray-500">
            Please wait while we prepare your content ✨
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
