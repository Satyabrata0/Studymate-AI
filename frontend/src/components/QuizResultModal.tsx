import React from "react";
import { QuizQuestion } from "../types";
import { Trophy, CheckCircle2, XCircle, RotateCcw, AlertCircle, ArrowLeft, Award, HelpCircle } from "lucide-react";

interface QuizResultModalProps {
  questions: QuizQuestion[];
  userAnswers: Record<number, number>;
  score: number;
  onRetake: () => void;
  onNewQuiz: () => void;
}

export const QuizResultModal: React.FC<QuizResultModalProps> = ({
  questions,
  userAnswers,
  score,
  onRetake,
  onNewQuiz,
}) => {
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);

  let feedbackBadge = {
    title: "Needs Practice",
    color: "bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-500/30",
    message: "Review your study notes and try asking the AI Tutor to explain missed questions!",
  };

  if (percentage >= 80) {
    feedbackBadge = {
      title: "Mastery Achieved! 🎉",
      color: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30",
      message: "Outstanding! You have a firm grasp of these study concepts.",
    };
  } else if (percentage >= 60) {
    feedbackBadge = {
      title: "Good Job!",
      color: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-900 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/30",
      message: "Good effort! Review the detailed explanations below to polish your knowledge.",
    };
  }

  return (
    <div id="quiz-result-view" className="glass-panel p-6 shadow-2xl mb-8 transition-colors border border-slate-200/80 dark:border-white/10 backdrop-blur-xl">
      {/* Score Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 dark:bg-indigo-600/30 border border-indigo-300 dark:border-indigo-400/30 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-500/20 backdrop-blur-md">
            <Trophy className="w-8 h-8 text-amber-500 dark:text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${feedbackBadge.color}`}>
                {feedbackBadge.title}
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-400 font-mono font-bold">
                {score}/{total} Correct
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Your Score: <span className="text-indigo-600 dark:text-indigo-400">{percentage}%</span>
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-400 mt-1 max-w-md font-medium">
              {feedbackBadge.message}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            id="quiz-retake-btn"
            onClick={onRetake}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl glass-card hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-900 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all border border-slate-300 dark:border-white/10 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>

          <button
            id="quiz-new-generator-btn"
            onClick={onNewQuiz}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 border border-indigo-400/30 flex items-center justify-center gap-2 transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            <span>New Quiz</span>
          </button>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="mt-6 space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Question Answer Breakdown ({total})</span>
        </h3>

        {questions.map((q, qIndex) => {
          const selectedOption = userAnswers[q.id];
          const isCorrect = selectedOption === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border transition-all ${
                isCorrect
                  ? "glass-card bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/20"
                  : "glass-card bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/20"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="mt-0.5">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider block mb-0.5">
                    Question {qIndex + 1}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {q.question}
                  </h4>
                </div>
              </div>

              {/* Options list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 pl-8">
                {q.options.map((opt, optIndex) => {
                  const isUserSelection = selectedOption === optIndex;
                  const isTheCorrectOption = q.correctIndex === optIndex;

                  let optionStyle =
                    "bg-slate-100/90 dark:bg-slate-800/90 border-slate-300/80 dark:border-slate-700/80 text-slate-900 dark:text-slate-300 font-medium";

                  if (isTheCorrectOption) {
                    optionStyle =
                      "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-200 font-bold ring-1 ring-emerald-400";
                  } else if (isUserSelection && !isCorrect) {
                    optionStyle =
                      "bg-rose-100 dark:bg-rose-500/20 border-rose-400 dark:border-rose-500/40 text-rose-950 dark:text-rose-200 line-through font-semibold";
                  }

                  return (
                    <div
                      key={optIndex}
                      className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${optionStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-200/80 dark:bg-white/10 flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Explanation box */}
              <div className="mt-3 ml-8 p-3 rounded-xl glass-card bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-medium">
                <span className="font-bold text-indigo-700 dark:text-indigo-400">Explanation: </span>
                {q.explanation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
