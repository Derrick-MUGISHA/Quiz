"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import * as React from "react";

type LoginFormInputs = {
  email: string;
  password: string;
};

function FloatingPaths({ position }: { position: number }) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [windowWidth, setWindowWidth] = React.useState(0);
  // const position = 1;

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  const mouseInfluence =
    windowWidth > 0 ? (mousePosition.x / windowWidth - 0.5) * 100 : 0;

  type Path = {
    id: number;
    d: string;
    width: number;
  };

  const paths: Path[] = Array.from({ length: 20 }, (_, i) => {
    return {
      id: i,
      d: `M-${380 - i * 8 * position + mouseInfluence} -${189 + i * 8}
          C-${380 - i * 8 * position + mouseInfluence} -${189 + i * 8}
           -${312 - i * 8 * position + mouseInfluence * 0.5} ${216 - i * 8}
           ${152 - i * 8 * position + mouseInfluence * 0.3} ${343 - i * 8}
          C${616 - i * 8 * position + mouseInfluence * 0.2} ${470 - i * 8}
           ${684 - i * 8 * position + mouseInfluence * 0.1} ${875 - i * 8}
           ${684 - i * 8 * position + mouseInfluence * 0.1} ${875 - i * 8}`,
      width: 0.8 + i * 0.05,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-green-400/20 dark:text-cyan-400/20"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Interactive Code Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.2 + path.id * 0.04}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0.7],
              opacity: [0.2, 0.8, 0.3],
            }}
            transition={{
              duration: 15 + path.id * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: path.id * 0.5,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/login", data);
      const { user, token } = res.data;

      login(user, token);

      toast.success(`Welcome back, ${user.name}!`);

      if (user.role.toLowerCase() === "teacher") {
        router.push(`/teachers-dashboard/${user._id}`);
      } else {
        router.push("/");
      }
    } catch (error) {
      let message = "Login failed";

      if (error instanceof AxiosError) {
        message = error.response?.data?.error || message;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
        <FloatingPaths position={2} />
      </div>
      <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-xl border border-green-200 z-20">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div className="flex flex-col">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
              className="mt-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              className="mt-2 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-3 rounded-lg text-lg font-semibold cursor-pointer"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin h-5 w-5" />}
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="text-green-500 font-medium hover:underline cursor-pointer"
                onClick={() => router.push("/register")}
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
