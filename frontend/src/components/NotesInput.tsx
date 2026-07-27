import React, { useState, useRef } from "react";
import { Sparkles, Trash2, FileText, Loader2, Upload, File, AlertTriangle, X, Paperclip } from "lucide-react";
import { SAMPLE_NOTES } from "../data/sampleNotes";
import { AttachedFile } from "../types";

interface NotesInputProps {
  notes: string;
  setNotes: (val: string) => void;
  attachedFile: AttachedFile | null;
  setAttachedFile: (file: AttachedFile | null) => void;
  onSimplify: () => void;
  isLoading: boolean;
  onSelectSample: (content: string) => void;
}

const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc", ".txt"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
];

export const NotesInput: React.FC<NotesInputProps> = ({
  notes,
  setNotes,
  attachedFile,
  setAttachedFile,
  onSimplify,
  isLoading,
  onSelectSample,
}) => {
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;

  const validateAndProcessFile = (file: File) => {
    setFileError(null);
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    const isAllowedExt = ALLOWED_EXTENSIONS.includes(ext);
    const isAllowedMime = ALLOWED_MIME_TYPES.includes(file.type) || file.type === "";

    if (!isAllowedExt && !isAllowedMime) {
      setFileError("Invalid File Type: Only PDF (.pdf), Word (.docx), and Text (.txt) documents are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1] || result;

      setAttachedFile({
        name: file.name,
        size: file.size,
        mimeType: file.type || (ext === ".pdf" ? "application/pdf" : ext === ".docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "text/plain"),
        base64: base64Data,
      });
    };
    reader.onerror = () => {
      setFileError("Failed to read the uploaded document.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isFormValid = Boolean(notes.trim() || attachedFile);

  return (
    <div id="notes-input-section" className="glass-panel p-6 shadow-xl mb-8 transition-colors border border-slate-200/80 dark:border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Study Notes & Document Input</span>
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
            Paste study text below or upload a PDF, Word (.docx), or Text (.txt) document.
          </p>
        </div>

        {/* Quick Sample Selector & File Upload Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            id="upload-doc-btn"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 border border-indigo-300 dark:border-indigo-500/40 text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>

          <span className="text-xs text-slate-800 dark:text-slate-400 font-semibold">Preset:</span>
          <select
            id="sample-notes-dropdown"
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                const found = SAMPLE_NOTES.find((s) => s.title === val);
                if (found) {
                  onSelectSample(found.content);
                  setAttachedFile(null);
                }
              }
            }}
            defaultValue=""
            className="text-xs bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-white/15 rounded-xl px-3 py-1.5 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md shadow-sm"
          >
            <option value="" disabled className="bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300">Select sample notes...</option>
            {SAMPLE_NOTES.map((sample, i) => (
              <option key={i} value={sample.title} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-200">
                {sample.title} ({sample.category})
              </option>
            ))}
          </select>

          {(notes || attachedFile) && (
            <button
              id="clear-notes-btn"
              onClick={() => {
                setNotes("");
                setAttachedFile(null);
                setFileError(null);
              }}
              className="p-1.5 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors rounded-xl hover:bg-slate-200/60 dark:hover:bg-white/10 border border-transparent hover:border-slate-300 dark:hover:border-white/10"
              title="Clear all text & attached file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* File Validation Error Banner */}
      {fileError && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-100 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-500/40 text-rose-900 dark:text-rose-200 text-xs font-semibold flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{fileError}</span>
          </div>
          <button
            onClick={() => setFileError(null)}
            className="text-xs font-bold text-rose-700 dark:text-rose-300 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Attached File Chip Badge */}
      {attachedFile && (
        <div className="mb-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-sm">
              <File className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{attachedFile.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-200 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 font-mono">
                  {formatFileSize(attachedFile.size)}
                </span>
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Document attached successfully — ready for Gemini analysis
              </p>
            </div>
          </div>

          <button
            onClick={() => setAttachedFile(null)}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            title="Remove document"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dropzone & Main Textarea */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative mb-4 rounded-xl transition-all ${
          isDragging
            ? "ring-2 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 scale-[1.005]"
            : ""
        }`}
      >
        <textarea
          id="study-notes-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste or type your study notes here, or drag & drop a PDF, Word (.docx), or Text (.txt) document..."
          rows={7}
          className="w-full p-4 rounded-xl glass-input text-slate-950 dark:text-slate-100 placeholder-slate-600 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm leading-relaxed resize-y font-mono transition-all font-medium"
        />

        {/* Counter & Drag Hint Info */}
        <div className="absolute bottom-3 right-4 flex items-center gap-2">
          {isDragging && (
            <span className="text-[11px] text-indigo-600 dark:text-indigo-300 font-bold glass-card px-2.5 py-1 rounded-lg border border-indigo-400">
              Drop PDF / Word / Text file here
            </span>
          )}
          <div className="text-[11px] text-slate-800 dark:text-slate-400 font-mono glass-card px-2.5 py-1 rounded-lg border border-slate-300 dark:border-white/10 font-bold">
            {wordCount} words | {charCount} chars
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
          Supported Formats: PDF (.pdf), Word (.docx), and Text (.txt).
        </p>

        <button
          id="simplify-notes-submit-btn"
          onClick={onSimplify}
          disabled={!isFormValid || isLoading}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] border border-indigo-400/30"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-indigo-200" />
              <span>Analyzing & Simplifying...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Simplify Notes with AI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

