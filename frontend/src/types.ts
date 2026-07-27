export interface SimplifyResult {
  summary: string;
  explanation: string;
  keyPoints: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResultState {
  questions: QuizQuestion[];
  userAnswers: Record<number, number>; // questionId -> selectedOptionIndex
  score: number;
  total: number;
  submitted: boolean;
}

export interface SampleNote {
  title: string;
  category: string;
  content: string;
}

export interface AttachedFile {
  name: string;
  size: number;
  mimeType: string;
  base64: string;
}
