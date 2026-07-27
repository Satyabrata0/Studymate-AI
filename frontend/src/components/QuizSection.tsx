import React, { useState } from "react";
import { QuizQuestion, AttachedFile } from "../types";
import { HelpCircle, Sparkles, Loader2, CheckCircle2, ArrowRight, Layers, FileText } from "lucide-react";
import { QuizResultModal } from "./QuizResultModal";

interface QuizSectionProps {
  notes: string;
  attachedFile?: AttachedFile | null;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ notes, attachedFile }) => {
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [count, setCount] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateQuiz = async () => {
    if (!notes.trim() && !attachedFile) {
      setErrorMessage("Please paste study notes or upload a document first before generating a quiz.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSubmitted(false);
    setUserAnswers({});

    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, difficulty, count, attachedFile }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate quiz.");
      }

      if (data.questions && Array.isArray(data.questions)) {
        const sanitizedQuestions = data.questions.map((q: any, idx: number) => ({
          ...q,
          id: idx + 1,
        }));
        setQuestions(sanitizedQuestions);
      } else {
        throw new Error("Invalid quiz response format.");
      }
    } catch (err: any) {
      console.error("Quiz error:", err);
      let msg = err.message || "Failed to generate quiz.";
      if (typeof msg === "string" && msg.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(msg);
          msg = parsed?.error?.message || parsed?.error || msg;
        } catch { }
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    if (!questions) return 0;
    return questions.reduce((acc, q) => {
      return userAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
    }, 0);
  };

  const handleSubmitQuiz = () => {
    if (!questions) return;
    setSubmitted(true);
  };

  if (submitted && questions) {
    return (
      <QuizResultModal
        questions={questions}
        userAnswers={userAnswers}
        score={calculateScore()}
        onRetake={() => {
          setSubmitted(false);
          setUserAnswers({});
        }}
        onNewQuiz={() => {
          setQuestions(null);
          setSubmitted(false);
          setUserAnswers({});
        }}
      />
    );
  }

  return (
    <div id="quiz-generator-section" className="glass-panel p-6 shadow-2xl mb-8 transition-colors border border-slate-200/80 dark:border-white/10 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Multiple Choice Quiz Generator
            </h2>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
            Generate custom practice exam questions powered by your study material.
          </p>
        </div>

        {/* Configuration Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Question Count selector */}
          <div className="flex items-center gap-1.5 bg-slate-200/60 dark:bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-slate-300/80 dark:border-white/10">
            <span className="text-[11px] text-slate-800 dark:text-slate-400 font-bold px-2">Count:</span>
            {[5, 10].map((c) => (
              <button
                key={c}
                id={`quiz-count-${c}-btn`}
                onClick={() => setCount(c)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${count === c
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
              >
                {c} MCQs
              </button>
            ))}
          </div>

          {/* Difficulty selector */}
          <div className="flex items-center gap-1.5 bg-slate-200/60 dark:bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-slate-300/80 dark:border-white/10">
            <span className="text-[11px] text-slate-800 dark:text-slate-400 font-bold px-2">Difficulty:</span>
            {(["Easy", "Medium", "Hard"] as const).map((d) => (
              <button
                key={d}
                id={`quiz-diff-${d.toLowerCase()}-btn`}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${difficulty === d
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            id="generate-quiz-action-btn"
            onClick={handleGenerateQuiz}
            disabled={isLoading || (!notes.trim() && !attachedFile)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 border border-purple-400/30 flex items-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                <span>Generating Quiz...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Generate Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Warning if no notes loaded */}
      {!notes.trim() && !attachedFile && !questions && (
        <div className="mt-6 p-4 rounded-xl glass-card bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 text-amber-950 dark:text-amber-200 text-xs flex items-center gap-3 font-medium">
          <FileText className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Please paste study notes or upload a PDF/Word/TXT document in Section 1 before generating a quiz.
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 p-3 rounded-xl glass-card bg-rose-100 dark:bg-rose-500/10 border border-rose-300 dark:border-rose-500/20 text-rose-950 dark:text-rose-300 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* Quiz Questions Taking View */}
      {questions && questions.length > 0 && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-400 pb-2 border-b border-slate-200/80 dark:border-white/10 font-medium">
            <span className="font-bold text-slate-900 dark:text-slate-200">
              Answered {Object.keys(userAnswers).length} of {questions.length} questions
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30 text-[10px] font-bold">
              Level: {difficulty}
            </span>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const selectedOpt = userAnswers[q.id];

              return (
                <div
                  key={`quiz-card-${q.id}-${idx}`}
                  className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-300/80 dark:border-white/10 shadow-lg"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                      {q.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-9">
                    {q.options.map((optionText, optIdx) => {
                      const isSelected = selectedOpt === optIdx;

                      return (
                        <button
                          key={optIdx}
                          id={`q-${q.id}-opt-${optIdx}`}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-start gap-3 ${isSelected
                              ? "bg-purple-600 text-white border-purple-500 shadow-md"
                              : "bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border-slate-300/80 dark:border-slate-700/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:border-purple-400"
                            }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md text-[10px] font-bold font-mono flex items-center justify-center shrink-0 ${isSelected
                                ? "bg-purple-700 text-white"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                              }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-snug">{optionText}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-700 dark:text-slate-400 font-medium">
              Complete all questions then submit to calculate score.
            </span>

            <button
              id="quiz-submit-answers-btn"
              onClick={handleSubmitQuiz}
              disabled={Object.keys(userAnswers).length === 0}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25 border border-purple-400/30 flex items-center gap-2 transition-all hover:scale-[1.01]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Quiz & View Score</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
