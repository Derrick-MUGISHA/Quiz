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

export default function ConsentModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const consent = getCookie("userConsent");
    if (!consent) setShowModal(true);
  }, []);

  const handleClose = () => setShowModal(false);

  const handleAccept = () => {
    setCookie("userConsent", "accepted", 365);
    setShowModal(false);
    window.location.href = "/dashboard";
  };

  const handleReject = () => {
    setCookie("userConsent", "rejected", 365);
    setShowModal(false);
    window.location.href = "/";
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
      <Card className="max-w-md w-full p-6 relative animate-fade-in shadow-2xl rounded-2xl">
        {/* Close Button */}
        <Button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-shadow shadow-sm"
        >
          <X className="h-5 w-5 text-gray-600" />
        </Button>

        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            Please accept or reject to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-6 flex flex-row justify-center gap-6">
          <Button
            onClick={handleAccept}
            className="flex-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-105 transition-transform hover:shadow-2xl cursor-pointer"
          >
            Accept
          </Button>
          <Button
            onClick={handleReject}
            className="flex-1 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-105 transition-transform hover:shadow-2xl cursor-pointer"
          >
            Reject
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
