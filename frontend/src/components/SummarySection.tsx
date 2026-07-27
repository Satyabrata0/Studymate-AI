import React, { useState } from "react";
import { SimplifyResult } from "../types";
import { BookOpen, Sparkles, CheckCircle2, Copy, Check, MessageSquare, HelpCircle, Lightbulb } from "lucide-react";

interface SummarySectionProps {
  result: SimplifyResult | null;
  onAskTutor: () => void;
  onGenerateQuiz: () => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  result,
  onAskTutor,
  onGenerateQuiz,
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "eli5" | "keypoints">("summary");

  if (!result) return null;

  const handleCopy = () => {
    const fullText = `=== SUMMARY ===\n${result.summary}\n\n=== SIMPLE EXPLANATION ===\n${result.explanation}\n\n=== KEY POINTS ===\n${result.keyPoints.map((kp) => `• ${kp}`).join("\n")}`;
    navigator.clipboard.writeText(fullText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div id="summary-result-section" className="glass-panel p-6 shadow-xl mb-8 transition-colors border border-slate-200/80 dark:border-white/10 backdrop-blur-xl">
      {/* Header with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Notes Summary & Key Points
            </h2>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
            Synthesized by Gemini 3.6 Flash from your study notes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="copy-summary-btn"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl glass-card hover:bg-slate-200/60 dark:hover:bg-white/10 text-xs font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5 transition-all border border-slate-300/80 dark:border-white/10 shadow-sm"
          >
            {copiedSummary ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All</span>
              </>
            )}
          </button>

          <button
            id="summary-ask-tutor-btn"
            onClick={onAskTutor}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 border border-indigo-300 dark:border-indigo-500/40 text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask Tutor</span>
          </button>

          <button
            id="summary-generate-quiz-btn"
            onClick={onGenerateQuiz}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 border border-purple-400/30 flex items-center gap-1.5 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Generate Quiz</span>
          </button>
        </div>
      </div>

      {/* Internal Sub-tabs for quick navigation */}
      <div className="flex border-b border-slate-200/80 dark:border-white/10 my-4 gap-2">
        <button
          onClick={() => setActiveTab("summary")}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-t-xl transition-all ${
            activeTab === "summary"
              ? "bg-white dark:bg-indigo-600/30 border-t border-x border-slate-300 dark:border-indigo-500/40 text-indigo-900 dark:text-white font-bold shadow-sm"
              : "text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5"
          }`}
        >
          Executive Summary
        </button>

        <button
          onClick={() => setActiveTab("eli5")}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-t-xl transition-all ${
            activeTab === "eli5"
              ? "bg-white dark:bg-indigo-600/30 border-t border-x border-slate-300 dark:border-indigo-500/40 text-indigo-900 dark:text-white font-bold shadow-sm"
              : "text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5"
          }`}
        >
          Simple Explanation (ELI5)
        </button>

        <button
          onClick={() => setActiveTab("keypoints")}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-t-xl transition-all ${
            activeTab === "keypoints"
              ? "bg-white dark:bg-indigo-600/30 border-t border-x border-slate-300 dark:border-indigo-500/40 text-indigo-900 dark:text-white font-bold shadow-sm"
              : "text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5"
          }`}
        >
          Key Takeaways ({result.keyPoints.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="py-2">
        {activeTab === "summary" && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl glass-card text-slate-900 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line border border-slate-300/80 dark:border-white/10 font-medium">
              {result.summary}
            </div>
          </div>
        )}

        {activeTab === "eli5" && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl glass-card bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 text-amber-950 dark:text-amber-100 text-sm leading-relaxed font-medium">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold mb-2">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Beginner-Friendly Breakdown:</span>
              </div>
              {result.explanation}
            </div>
          </div>
        )}

        {activeTab === "keypoints" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.keyPoints.map((point, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl glass-card border border-slate-300/80 dark:border-white/10 flex items-start gap-3 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              >
                <div className="mt-0.5 p-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-300 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm text-slate-900 dark:text-slate-200 font-semibold leading-normal">
                  {point}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
