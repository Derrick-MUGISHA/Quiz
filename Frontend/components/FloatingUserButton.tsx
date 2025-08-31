"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  LayoutDashboard,
  LogInIcon,
  LogOut,
  GraduationCap,
  UserCog,
  Home,
} from "lucide-react";
import { Button } from "./ui/button";

export default function FloatingUserButton() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (action: string) => {
    setOpen(false);
    if (action === "logout") {
      logout();
      router.push("/login");
    } else if (action === "score") {
      router.push("/status/score");
    } else if (action === "dashboard") {
      router.push(`/teachers-dashboard/${user?._id}`);
    } else if (action === "home") {
      router.push("/");
    }
  };

  const buttonStyle = user
    ? user.role === "student"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-purple-600 hover:bg-purple-700"
    : "bg-gray-500 hover:bg-gray-600";

  const buttonIcon = user ? (
    user.role === "student" ? (
      <GraduationCap className="w-7 h-7" />
    ) : (
      <UserCog className="w-7 h-7" />
    )
  ) : (
    <LogInIcon className="w-7 h-7" />
  );

  const isNavigating = pathname !== "/";

  return (
    <div ref={ref} className="fixed right-6 bottom-6 z-50">
      {/* Floating Button */}
      <Button
        onClick={() => (isNavigating ? handleClick("home") : setOpen(!open))}
        className={`w-16 h-16 rounded-full ${buttonStyle} text-white flex flex-col items-center justify-center shadow-xl transition-all duration-300 transform hover:scale-110 cursor-pointer`}
      >
        {isNavigating ? (
          <>
            <Home className="w-7 h-7" />
            <span className="text-xs font-semibold">Home</span>
          </>
        ) : (
          <>
            {buttonIcon}
            <span className="text-xs font-semibold">
              {user
                ? user.role === "student"
                  ? "Student"
                  : "Teacher"
                : "Login"}
            </span>
          </>
        )}
      </Button>

      {/* Animated Dropdown (only on home page) */}
      <AnimatePresence>
        {!isNavigating && open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="absolute right-0 bottom-20 w-56 bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200"
          >
            {user ? (
              <>
                {user.role === "student" ? (
                  <>
                    <button
                      onClick={() => handleClick("score")}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <BarChart2 className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-700">
                        My Score
                      </span>
                    </button>
                    <button
                      onClick={() => handleClick("logout")}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-red-500">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleClick("dashboard")}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <LayoutDashboard className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-700">
                        Dashboard
                      </span>
                    </button>
                    <button
                      onClick={() => handleClick("logout")}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-red-500">Logout</span>
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <LogInIcon className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-blue-500">Login</span>
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-green-200 transition-colors cursor-pointer"
                >
                  <UserCog className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-600">Register</span>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
