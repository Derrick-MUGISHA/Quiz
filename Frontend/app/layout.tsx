import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Cookies from "@/components/cookies";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import FloatingUserButton from "@/components/FloatingUserButton";
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevQuiz",
  description:
    "Train yourself for the better you with quizzes on coding, web development, and more.",
  keywords: [
    "DevQuiz",
    "coding quizzes",
    "programming practice",
    "web development quiz",
    "JavaScript quiz",
    "React quiz",
    "Python quiz",
  ],
  authors: [{ name: "DevQuiz Team" }],
  metadataBase: new URL("https://quiz-five-rho-90.vercel.app/"),
  alternates: {
    canonical: "https://quiz-five-rho-90.vercel.app/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "DevQuiz – Train yourself for the better you",
    description:
      "Sharpen your coding skills with fun, interactive quizzes on web development and programming.",
    url: "https://quiz-five-rho-90.vercel.app/",
    siteName: "DevQuiz",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevQuiz – Sharpen your coding skills",
      },
    ],
    locale: "Kigali",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@yourTwitterHandle",
    creator: "@yourTwitterHandle",
    title: "DevQuiz – Train yourself for the better you",
    description: "Sharpen your coding skills with fun, interactive quizzes.",
    images: ["https://yourdomain.com/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Analytics />
          <FloatingUserButton />
          <Cookies />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
