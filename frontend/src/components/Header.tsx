import React from "react";
import { GraduationCap, Sparkles, Moon, Sun, BookOpen, MessageSquare, HelpCircle, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  activeTab: "simplify" | "tutor" | "quiz";
  setActiveTab: (tab: "simplify" | "tutor" | "quiz") => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  hasNotes: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  hasNotes,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab("simplify")}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform border border-white/20">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                StudyMate<span className="text-indigo-600 dark:text-indigo-400">.AI</span>
              </span>
              <span className="hidden sm:inline-flex text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                Gemini 3.6
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 hidden md:block">
              AI Study Assistant & Exam Tutor
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-slate-200/70 dark:bg-white/5 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl border border-slate-300 dark:border-white/10 shrink-0">
          <button
            id="tab-simplify-btn"
            onClick={() => setActiveTab("simplify")}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "simplify"
                ? "bg-white dark:bg-indigo-600/30 border border-slate-300 dark:border-indigo-500/40 text-indigo-950 dark:text-white shadow-sm font-bold"
                : "text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">1. Notes & Summary</span>
            <span className="md:hidden">Notes</span>
          </button>

          <button
            id="tab-tutor-btn"
            onClick={() => setActiveTab("tutor")}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === "tutor"
                ? "bg-white dark:bg-indigo-600/30 border border-slate-300 dark:border-indigo-500/40 text-indigo-950 dark:text-white shadow-sm font-bold"
                : "text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-white/5"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden md:inline">2. AI Tutor</span>
            <span className="md:hidden">Tutor</span>
            {hasNotes && (
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 absolute -top-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
            )}
          </button>

          <button
            id="tab-quiz-btn"
            onClick={() => setActiveTab("quiz")}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === "quiz"
                ? "bg-white dark:bg-indigo-600/30 border border-slate-300 dark:border-indigo-500/40 text-indigo-950 dark:text-white shadow-sm font-bold"
                : "text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-white/5"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden md:inline">3. Quiz Generator</span>
            <span className="md:hidden">Quiz</span>
          </button>
        </nav>

        {/* Right Utilities */}
        <div className="flex items-center gap-3">
          <button
            id="theme-toggle-btn"
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/60 hover:bg-slate-300/60 dark:bg-white/5 dark:hover:bg-white/10 transition-colors border border-slate-300/60 dark:border-white/10"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
