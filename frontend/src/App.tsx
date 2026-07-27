import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { NotesInput } from "./components/NotesInput";
import { SummarySection } from "./components/SummarySection";
import { AITutorSection } from "./components/AITutorSection";
import { QuizSection } from "./components/QuizSection";
import { SimplifyResult, ChatMessage, AttachedFile } from "./types";
import { SAMPLE_NOTES } from "./data/sampleNotes";
import { AlertTriangle, BookOpen, MessageSquare, HelpCircle, GraduationCap } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"simplify" | "tutor" | "quiz">("simplify");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const [notes, setNotes] = useState<string>("");
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [isLoadingSimplify, setIsLoadingSimplify] = useState<boolean>(false);
  const [simplifyResult, setSimplifyResult] = useState<SimplifyResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tutorMessages, setTutorMessages] = useState<ChatMessage[]>([]);

  // Apply dark class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSelectSample = (sampleContent: string) => {
    setNotes(sampleContent);
    setAttachedFile(null);
    setSimplifyResult(null);
    setErrorMsg(null);
  };

  const handleSimplify = async () => {
    if (!notes.trim() && !attachedFile) return;

    setIsLoadingSimplify(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, attachedFile }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to simplify study notes.");
      }

      setSimplifyResult(data);
    } catch (err: any) {
      console.error("Simplify error:", err);
      let msg = err.message || "An error occurred while generating summary.";
      if (typeof msg === "string" && msg.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(msg);
          msg = parsed?.error?.message || parsed?.error || msg;
        } catch {}
      }
      setErrorMsg(msg);
    } finally {
      setIsLoadingSimplify(false);
    }
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden mesh-bg text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 relative selection:bg-indigo-500 selection:text-white">
      {/* Background glow ornaments */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Navbar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        hasNotes={Boolean(notes.trim() || attachedFile)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner */}
        <Hero
          onSelectSample={(content) => {
            handleSelectSample(content);
            setActiveTab("simplify");
            setTimeout(() => {
              const section = document.getElementById("notes-input-section");
              section?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 50);
          }}
          onStartClick={() => {
            setActiveTab("simplify");
            setTimeout(() => {
              const section = document.getElementById("notes-input-section");
              section?.scrollIntoView({ behavior: "smooth", block: "start" });
              const input = document.getElementById("study-notes-textarea");
              input?.focus();
            }, 50);
          }}
        />

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="mb-6 p-4 glass-panel bg-rose-950/40 border-rose-500/30 text-rose-200 text-sm flex items-start gap-3 shadow-lg">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Generation Error</p>
              <p className="text-xs opacity-90">{errorMsg}</p>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs font-bold text-rose-400 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Section View switcher */}
        {activeTab === "simplify" && (
          <div className="space-y-8">
            <NotesInput
              notes={notes}
              setNotes={setNotes}
              attachedFile={attachedFile}
              setAttachedFile={setAttachedFile}
              onSimplify={handleSimplify}
              isLoading={isLoadingSimplify}
              onSelectSample={handleSelectSample}
            />

            <SummarySection
              result={simplifyResult}
              onAskTutor={() => setActiveTab("tutor")}
              onGenerateQuiz={() => setActiveTab("quiz")}
            />
          </div>
        )}

        {activeTab === "tutor" && (
          <AITutorSection
            notes={notes}
            attachedFile={attachedFile}
            messages={tutorMessages}
            setMessages={setTutorMessages}
          />
        )}

        {activeTab === "quiz" && (
          <QuizSection notes={notes} attachedFile={attachedFile} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-white/10 glass-panel border-x-0 border-b-0 rounded-none py-6 mt-12 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">StudyMate AI</span>
            <span>— Frosted Glass Edition</span>
          </div>
          <div>
            Powered by <span className="font-semibold text-indigo-600 dark:text-indigo-400">Gemini 3.6 Flash</span> & Express
          </div>
        </div>
      </footer>
    </div>
  );
}
