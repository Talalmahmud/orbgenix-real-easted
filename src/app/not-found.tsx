"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4">
      {/* Floating card */}
      <div className="relative bg-white shadow-2xl rounded-3xl p-10 md:p-16 text-center max-w-lg animate-fadeIn">
        <h1 className="text-7xl md:text-8xl font-extrabold text-indigo-600 mb-4 animate-bounce">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for might have been removed, renamed, or is
          temporarily unavailable.
        </p>
        <Link href="/">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
            Go Back Home
          </Button>
        </Link>
      </div>

      {/* Optional floating shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
    </div>
  );
}
