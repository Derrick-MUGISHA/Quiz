"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

// Cookie helpers
const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )};expires=${date.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(nameEQ) === 0)
      return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
};

const hashEmail = async (email: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(email);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 12);
};

const TEACHER_EMAIL = "derrickmugisha169@gmail.com";

export default function SecureFirstVisit() {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<"teacher" | "student" | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = getCookie("userEmail");

    if (savedEmail) {
      if (savedEmail === TEACHER_EMAIL) {
        setUserType("teacher");
        setShowOptions(true);
        setShowModal(false);
      } else {
        setUserType("student");
        setShowModal(false);
      }
    } else {
      setShowModal(true);
    }
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(async () => {
      try {
        if (email === TEACHER_EMAIL) {
          const hashedEmail = await hashEmail(email);
          setUserType("teacher");
          setShowOptions(true);
          setShowModal(false);
          setCookie("userEmail", hashedEmail, 365);
          toast.success("Welcome, Teacher! Choose your path now.");
        } else {
          const hashedEmail = await hashEmail(email);
          setUserType("student");
          setShowModal(false);
          setCookie("userEmail", hashedEmail, 365);
          toast("Student stored securely! You are registered.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error: Something went wrong!");
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const handleClose = () => {
    setShowModal(false);
    setShowOptions(false);
  };

  const handleTeacherGo = () => {
    const teacherToken = generateRandomId();
    setCookie("teacherToken", teacherToken, 1);
    setShowOptions(false);
    setShowModal(false);
    window.location.href = `/teachers-dashboard/${teacherToken}`;
  };

  if (showModal) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <Card className="max-w-sm w-full p-4 relative animate-fade-in">
          {/* Close Button */}
          <Button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer z-50"
          >
            <X className="h-5 w-5 text-gray-600" />
          </Button>

          <CardHeader>
            <CardTitle>Welcome!</CardTitle>
            <CardDescription>
              Please enter your email to subscribe or continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white cursor-pointer shadow-lg hover:scale-105 transition-transform"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></span>
                    Processing...
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showOptions && userType === "teacher") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <Card className="max-w-sm w-full p-4 text-center animate-fade-in">
          <CardHeader>
            <CardTitle>Welcome, Teacher!</CardTitle>
            <CardDescription>How do you want to continue?</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button
              onClick={handleTeacherGo}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white cursor-pointer shadow-lg hover:scale-105 transition-transform"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full cursor-pointer bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></span>
                  Processing...
                </span>
              ) : (
                "Go as Teacher"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
