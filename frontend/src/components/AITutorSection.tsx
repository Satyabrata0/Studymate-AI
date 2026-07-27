import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, AttachedFile } from "../types";
import { MessageSquare, Send, Bot, User, Sparkles, Loader2, RefreshCw, Copy, Check, FileText } from "lucide-react";

interface AITutorSectionProps {
  notes: string;
  attachedFile?: AttachedFile | null;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const TUTOR_SUGGESTIONS = [
  "Can you give a real-world example of this?",
  "What are the 3 most common exam questions on this topic?",
  "Can you explain the hardest concept in simpler terms?",
  "How does this connect to fundamental principles?",
];

// Helper function to format teacher output by replacing asterisks with single quotes and cleaning markdown tags
const formatTeacherText = (text: string) => {
  if (!text) return "";
  let formatted = text;
  // Remove markdown header tags like ### or ##
  formatted = formatted.replace(/^#{1,6}\s*/gm, "");
  // Replace **text** with 'text'
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "'$1'");
  // Replace *text* with 'text'
  formatted = formatted.replace(/\*(.*?)\*/g, "'$1'");
  // Replace any leftover single asterisks with '
  formatted = formatted.replace(/\*/g, "'");
  return formatted;
};

export const AITutorSection: React.FC<AITutorSectionProps> = ({
  notes,
  attachedFile,
  messages,
  setMessages,
}) => {
  const [inputQuestion, setInputQuestion] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSendQuestion = async (questionText?: string) => {
    const q = questionText || inputQuestion;
    if (!q.trim() || isStreaming) return;

    const userMsgId = Date.now().toString();
    const assistantMsgId = (Date.now() + 1).toString();

    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: q.trim(),
      timestamp: new Date(),
    };

    const newAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg, newAssistantMsg]);
    setInputQuestion("");
    setIsStreaming(true);

    try {
      const historyForApi = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes,
          question: q.trim(),
          history: historyForApi,
          attachedFile,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to connect to AI Tutor streaming backend.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (!reader) throw new Error("ReadableStream not supported.");

      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                accumulatedText += parsed.text;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: accumulatedText }
                      : msg
                  )
                );
              }
            } catch (e: any) {
              if (e.message && e.message !== "Unexpected end of JSON input") {
                throw e;
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Streaming error:", error);
      let errorMsg = error.message || "Failed to reach AI Tutor.";
      if (errorMsg.startsWith("{")) {
        try {
          const parsed = JSON.parse(errorMsg);
          errorMsg = parsed?.error?.message || parsed?.error || errorMsg;
        } catch {}
      }
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content:
                  (msg.content ? msg.content + "\n\n" : "") +
                  `*(Notice: ${errorMsg})*`,
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="ai-tutor-section" className="glass-panel p-6 shadow-2xl mb-8 transition-colors border border-slate-200/80 dark:border-white/10 backdrop-blur-xl flex flex-col h-[680px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center font-bold shadow-md shadow-indigo-500/10">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>AI Tutor Chat</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-bold">
                Streaming Active
              </span>
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              {attachedFile ? (
                <span className="text-slate-800 dark:text-slate-300 font-semibold">
                  Context: Document attached ({attachedFile.name})
                </span>
              ) : notes.trim() ? (
                <span className="text-slate-800 dark:text-slate-300 font-semibold">
                  Context: Study notes loaded ({notes.trim().split(/\s+/).length} words)
                </span>
              ) : (
                <span className="text-amber-800 dark:text-amber-300 font-semibold">
                  General Tutor Mode (Paste notes or upload PDF/Word/TXT for context)
                </span>
              )}
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            id="clear-chat-history-btn"
            onClick={() => setMessages([])}
            className="p-1.5 rounded-xl text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 border border-transparent hover:border-slate-300 dark:hover:border-white/10 text-xs flex items-center gap-1 transition-all"
            title="Reset Chat History"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-semibold">Reset Chat</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-700 dark:text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/15">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Ask AI Tutor Anything
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-400 max-w-md mb-6 leading-relaxed font-medium">
              I can explain difficult concepts, clarify doubts, generate real-world analogies, or test your memory on the notes.
            </p>

            {/* Quick Suggestions */}
            <div className="w-full max-w-md space-y-2">
              <p className="text-[11px] uppercase tracking-wider font-bold text-slate-800 dark:text-slate-400 mb-1">
                Suggested Prompts:
              </p>
              {TUTOR_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  id={`tutor-suggestion-${i}`}
                  onClick={() => handleSendQuestion(sug)}
                  className="w-full text-left p-3 rounded-xl glass-card hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-300/80 dark:border-white/10 text-xs text-slate-900 dark:text-slate-200 font-medium transition-all flex items-center justify-between group shadow-sm"
                >
                  <span>"{sug}"</span>
                  <Send className="w-3 h-3 text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white border border-indigo-400/30 flex items-center justify-center shrink-0 text-xs font-bold shadow-md shadow-indigo-600/20 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/20 font-medium"
                    : "glass-card text-slate-900 dark:text-slate-100 border border-slate-300/80 dark:border-white/10 rounded-bl-none shadow-md backdrop-blur-md font-medium"
                }`}
              >
                {msg.role === "assistant" && !msg.content ? (
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-400 text-xs py-1 font-medium">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                    <span>AI Tutor is thinking & streaming answer...</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-line">
                    {msg.role === "assistant" ? formatTeacherText(msg.content) : msg.content}
                  </div>
                )}

                {msg.role === "assistant" && msg.content && (
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    <span>StudyMate Tutor</span>
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="p-1 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-800 text-white border border-slate-700 dark:border-white/10 flex items-center justify-center shrink-0 text-xs font-bold shadow-md mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuestion();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="tutor-question-input"
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask AI Tutor a question about your study notes..."
            disabled={isStreaming}
            className="flex-1 p-3.5 rounded-xl glass-input text-slate-950 dark:text-slate-100 placeholder-slate-600 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all font-medium"
          />

          <button
            id="tutor-send-question-btn"
            type="submit"
            disabled={!inputQuestion.trim() || isStreaming}
            className="p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white shadow-lg shadow-indigo-600/25 border border-indigo-400/30 transition-all flex items-center justify-center"
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin text-indigo-200" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
