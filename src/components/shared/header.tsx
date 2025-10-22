"use client";

import { useState } from "react";
import { Bell, User, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Sidebar from "./sidebar";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md",
        "flex items-center justify-between px-4 py-3"
      )}
    >
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        {/* Sidebar Toggle for Mobile */}
        <div className="md:hidden">
          <Sidebar />
        </div>

        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Notification */}
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>

        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          title={darkMode ? "Light Mode" : "Dark Mode"}
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* Profile */}
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
