import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Cookies from "@/components/cookies";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import FloatingUserButton from "@/components/FloatingUserButton";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import QueryProvider from "@/components/query-provider";

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
  authors: [{ name: "DevQuiz Team/Derrick" }],
  metadataBase: new URL("https://quiz-five-rho-90.vercel.app"),
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
        url: "https://res.cloudinary.com/dvl1iht4u/image/upload/v1756327948/ChatGPT_Image_Aug_27_2025_10_18_31_PM_xrbmge.png",
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
    images: ["https://res.cloudinary.com/dvl1iht4u/image/upload/v1756327948/ChatGPT_Image_Aug_27_2025_10_18_31_PM_xrbmge.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.svg",
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
          <QueryProvider>
          {children}
          <Analytics />
          <SpeedInsights />
          <FloatingUserButton />
          <Cookies />
          <Toaster position="top-right" />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
