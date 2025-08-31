"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import Cookies from "js-cookie";

const setConsentCookie = (value: "accepted" | "rejected") => {
  Cookies.set("userConsent", value, { expires: 365, sameSite: "lax" });
};

export default function ConsentModal() {
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("userConsent");
    if (!consent) setShowModal(true);
  }, []);

  const handleClose = () => setShowModal(false);

  const handleAccept = () => {
    setConsentCookie("accepted");
    setShowModal(false);

    if (user) {
     
      window.location.href = "/"; 
    } else {
      
      window.location.href = "/login";
    }
  };

  const handleReject = () => {
    setConsentCookie("rejected");
    setShowModal(false);
    window.location.href = "/";
  };

  if (!showModal || loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
      <Card className="max-w-md w-full p-6 relative animate-fade-in shadow-2xl rounded-2xl">
        {/* Close Button */}
        <Button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-shadow shadow-sm cursor-pointer"
        >
          <X className="h-5 w-5 text-gray-600" />
        </Button>

        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            {user
              ? "Thanks for logging in! Accept to track your progress."
              : "Please accept and Login so your scores are saved."}
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-6 flex flex-row justify-center gap-6">
          <Button
            onClick={handleAccept}
            className="flex-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-105 transition-transform hover:shadow-2xl cursor-pointer"
          >
            {user ? "Accept" : "Login"}
          </Button>

          
            <Button
              onClick={handleReject}
              className="flex-1 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-105 transition-transform hover:shadow-2xl cursor-pointer"
            >
              Pass On
            </Button>
        
        </CardContent>
      </Card>
    </div>
  );
}
