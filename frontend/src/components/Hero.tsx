import React from "react";
import { Sparkles, BrainCircuit, CheckCircle2, Zap, ArrowRight, BookOpenText } from "lucide-react";
import { SAMPLE_NOTES } from "../data/sampleNotes";

interface HeroProps {
  onSelectSample: (content: string) => void;
  onStartClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectSample, onStartClick }) => {
  return (
    <div className="relative overflow-hidden glass-panel p-5 sm:p-12 mb-8 shadow-2xl border border-slate-200/80 dark:border-white/15 backdrop-blur-2xl">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f115_1px,transparent_1px),linear-gradient(to_bottom,#6366f115_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-400/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>AI-Powered Learning Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-slate-900 dark:text-white">
          Understand Complex Notes <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300">
            Faster Than Ever Before
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
          Paste your lecture material or study notes. StudyMate AI automatically generates concise summaries, Easy explanations, answers follow-up questions in real-time, and builds custom practice quizzes.
        </p>

        {/* Action Buttons & Presets */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="hero-get-started-btn"
              onClick={onStartClick}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] border border-indigo-400/30"
            >
              <span>Paste Your Notes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Presets */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-white/10">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <BookOpenText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Or try with instant sample notes:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_NOTES.map((sample, idx) => (
                <button
                  key={idx}
                  id={`sample-preset-${idx}`}
                  onClick={() => onSelectSample(sample.content)}
                  className="px-3 py-1.5 rounded-xl glass-card hover:bg-slate-100 dark:hover:bg-white/10 text-xs text-slate-800 dark:text-indigo-200 transition-all border border-slate-200/80 dark:border-white/10 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                  <span>{sample.title}</span>
                  <span className="text-[10px] text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-500/30 px-1.5 py-0.5 rounded font-semibold">
                    {sample.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              <Zap className="w-4 h-4" />
            </div>
            <span>Instant Notes Simplifier & ELI5</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <span>Streaming AI Tutor Chat</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>Auto MCQ Quiz & Score Analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
};
