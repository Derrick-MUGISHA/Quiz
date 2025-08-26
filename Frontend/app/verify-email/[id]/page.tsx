"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";

const VerifyEmail = () => {
  const { id } = useParams(); // <-- matches [id]
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const verifyEmail = useCallback(async () => {
  if (!id) return;

  setStatus("loading");
  try {
    const res = await axios.get(
      `http://localhost:5000/auth/api/verify-email/${id}`,
      { withCredentials: true }
    );

    setStatus("success");
    setMessage(res.data.message);
    toast.success(res.data.message);
  } catch (err: unknown) {
    let errorMsg = "Verification failed. Please try again.";

    if (err instanceof AxiosError) {
      errorMsg = err.response?.data?.error || errorMsg;
    } else if (err instanceof Error) {
      errorMsg = err.message;
    }

    setStatus("error");
    setMessage(errorMsg);
    toast.error(errorMsg);
  }
}, [id]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  return (
    <>
      <Toaster position="top-right" richColors />
      <main className="flex items-center justify-center h-screen bg-gray-100 px-4">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md w-full">
          {status === "loading" && (
            <div className="flex flex-col items-center">
              <svg
                className="animate-spin h-12 w-12 text-green-600 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <p className="text-gray-700 text-lg">Verifying your email...</p>
            </div>
          )}

          {status === "success" && (
            <>
              <h1 className="text-2xl font-bold mb-4 text-green-600">Email Verified ✅</h1>
              <p className="text-gray-700 mb-6">{message}</p>
              <Button
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 transition"
                onClick={() => router.push("/login")}
              >
                Go to Login
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="text-2xl font-bold mb-4 text-red-600">Verification Failed ❌</h1>
              <p className="text-gray-700 mb-6">{message}</p>
              <div className="flex justify-center gap-4">
                <Button
                  className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
                  onClick={() => router.push("/register")}
                >
                  Register Again
                </Button>
                <Button
                  className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
                  onClick={verifyEmail}
                >
                  Retry
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default VerifyEmail;
