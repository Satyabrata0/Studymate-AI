import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import mammoth from "mammoth";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

interface AttachedFilePayload {
  name: string;
  size: number;
  mimeType: string;
  base64: string;
}

// Helper to process attached file (PDF inlineData vs Word/TXT text extraction)
async function getFileContentPart(attachedFile?: AttachedFilePayload | null): Promise<any | null> {
  if (!attachedFile || !attachedFile.base64) return null;

  const ext = "." + (attachedFile.name.split(".").pop() || "").toLowerCase();
  const isPdf = attachedFile.mimeType === "application/pdf" || ext === ".pdf";
  const isDocx =
    attachedFile.mimeType.includes("wordprocessingml") ||
    attachedFile.mimeType.includes("msword") ||
    ext === ".docx" ||
    ext === ".doc";
  const isTxt = attachedFile.mimeType === "text/plain" || ext === ".txt";

  if (isPdf) {
    return {
      inlineData: {
        data: attachedFile.base64,
        mimeType: "application/pdf",
      },
    };
  } else if (isDocx) {
    const buffer = Buffer.from(attachedFile.base64, "base64");
    const result = await mammoth.extractRawText({ buffer });
    return {
      text: `Attached Word Document (${attachedFile.name}):\n"""\n${result.value}\n"""`,
    };
  } else if (isTxt) {
    const textContent = Buffer.from(attachedFile.base64, "base64").toString("utf-8");
    return {
      text: `Attached Text File (${attachedFile.name}):\n"""\n${textContent}\n"""`,
    };
  }

  return null;
}

// Helper to initialize Gemini SDK safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Healthcheck endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "StudyMate AI Backend" });
});

// Helper to format Gemini error messages into clean human-readable text
function formatGeminiError(error: any): string {
  if (!error) return "An unexpected error occurred.";
  let msg = typeof error === "string" ? error : error.message || String(error);

  if (typeof msg === "string" && msg.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(msg);
      if (parsed?.error?.message) {
        msg = parsed.error.message;
      }
    } catch {
      // Keep original
    }
  }

  if (
    msg.includes("429") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("Quota exceeded") ||
    msg.includes("limit: 20") ||
    msg.includes("exceeded your current quota")
  ) {
    return "API rate limit or quota exceeded. Please wait about 30 seconds and try again.";
  }

  return msg;
}

// 1. Simplify Endpoint
app.post("/api/simplify", async (req, res) => {
  try {
    const { notes, attachedFile } = req.body;
    if ((!notes || typeof notes !== "string" || !notes.trim()) && !attachedFile) {
      res.status(400).json({ error: "Study notes content or an attached document is required." });
      return;
    }

    const ai = getGeminiClient();
    const promptText = `Analyze the following study material thoroughly and create a simplified breakdown:

${notes && notes.trim() ? `Study Notes Text:\n"""\n${notes.trim()}\n"""\n` : ""}
Provide a concise summary, a simple easy-to-grasp explanation (ELI5 style), and key takeaway bullet points.`;

    const filePart = await getFileContentPart(attachedFile);
    const contents: any[] = [];
    if (filePart) {
      contents.push(filePart);
    }
    contents.push(promptText);

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        systemInstruction: "You are StudyMate AI, a world-class academic tutor that simplifies complex material into digestible summaries, clear ELI5 explanations, and key takeaways.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A comprehensive yet concise summary of the study notes (2-3 paragraphs).",
            },
            explanation: {
              type: Type.STRING,
              description: "A simplified, crystal-clear explanation suitable for a beginner.",
            },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4 to 7 crucial key takeaway points.",
            },
          },
          required: ["summary", "explanation", "keyPoints"],
        },
      },
    });

    const text = response.text || "{}";
    const parsedData = JSON.parse(text);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error in /api/simplify:", error);
    const cleanErr = formatGeminiError(error);
    res.status(500).json({ error: cleanErr });
  }
});

// 2. AI Tutor Streaming Endpoint
app.post("/api/tutor", async (req, res) => {
  try {
    const { notes, question, history, attachedFile } = req.body;
    if (!question || typeof question !== "string" || !question.trim()) {
      res.status(400).json({ error: "Question is required." });
      return;
    }

    const ai = getGeminiClient();

    // Setup SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const systemInstruction = `You are an experienced, highly distinguished master teacher and academic professor.
${notes ? `The student has provided the following study notes as primary context:\n---\n${notes}\n---\n` : ""}
Teaching Persona & Writing Instructions:
1. Explain concepts with the clarity, depth, structure, and pedagogical warmth of a veteran master teacher. Break down complex topics into intuitive, logical, step-by-step explanations with illustrative examples.
2. CRITICAL FORMATTING RULE: NEVER use any asterisk symbols ('*') or double asterisks ('**') anywhere in your output. Never use markdown header hash tags ('#', '##', '###').
3. Instead of using asterisks for emphasis or headers, exchange the '*' symbol with single ('...') or double ("...") quotes around key terms, key phrases, or titles (for example, write 'Biological Pollutants:' or "Biological Pollutants:" instead of **Biological Pollutants:**).
4. Use clean numbered points (1., 2., 3.) or simple dashes (-) for lists, strictly avoiding any asterisk characters.
5. Keep the tone encouraging, intellectually inspiring, authoritative yet accessible, and focused on genuine student comprehension.`;

    // Construct message history if provided
    const contents: any[] = [];
    const filePart = await getFileContentPart(attachedFile);
    if (filePart) {
      contents.push({ role: "user", parts: [filePart] });
    }

    if (Array.isArray(history)) {
      for (const item of history) {
        if (item.role && item.content) {
          contents.push({
            role: item.role === "assistant" ? "model" : "user",
            parts: [{ text: item.content }],
          });
        }
      }
    }
    contents.push({ role: "user", parts: [{ text: question }] });

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        systemInstruction,
      },
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error: any) {
    console.error("Error in /api/tutor:", error);
    const cleanErr = formatGeminiError(error);
    if (!res.headersSent) {
      res.status(500).json({ error: cleanErr });
    } else {
      res.write(`data: ${JSON.stringify({ error: cleanErr })}\n\n`);
      res.end();
    }
  }
});

// 3. Quiz Generator Endpoint
app.post("/api/quiz", async (req, res) => {
  try {
    const { notes, difficulty = "Medium", count = 5, attachedFile } = req.body;
    if ((!notes || typeof notes !== "string" || !notes.trim()) && !attachedFile) {
      res.status(400).json({ error: "Notes content or an attached document is required to generate a quiz." });
      return;
    }

    const ai = getGeminiClient();
    const quizCount = Math.min(Math.max(Number(count) || 5, 3), 10);
    const difficultyLevel = ["Easy", "Medium", "Hard"].includes(difficulty) ? difficulty : "Medium";

    const promptText = `Generate exactly ${quizCount} multiple-choice questions (MCQs) testing knowledge from the following study material.
Difficulty level: ${difficultyLevel}.

${notes && notes.trim() ? `Study Notes:\n"""\n${notes.trim()}\n"""\n` : ""}

Each question must have:
- A clear question statement.
- Exactly 4 options.
- The zero-based index (0, 1, 2, or 3) of the correct option.
- A concise explanation of why the answer is correct.`;

    const filePart = await getFileContentPart(attachedFile);
    const contents: any[] = [];
    if (filePart) {
      contents.push(filePart);
    }
    contents.push(promptText);

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        systemInstruction: "You are a precise academic exam author. Create unambiguous, educational multiple-choice questions with 4 distinct options based strictly on the user's notes.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER, description: "Question number starting from 1" },
              question: { type: Type.STRING, description: "The multiple choice question text" },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of exactly 4 distinct option strings",
              },
              correctIndex: {
                type: Type.INTEGER,
                description: "Index 0 to 3 indicating the correct answer in the options array",
              },
              explanation: {
                type: Type.STRING,
                description: "Explanation for why this option is correct",
              },
            },
            required: ["id", "question", "options", "correctIndex", "explanation"],
          },
        },
      },
    });

    const text = response.text || "[]";
    const rawQuestions = JSON.parse(text);
    const questions = Array.isArray(rawQuestions)
      ? rawQuestions.map((q: any, idx: number) => ({ ...q, id: idx + 1 }))
      : [];
    res.json({ questions });
  } catch (error: any) {
    console.error("Error in /api/quiz:", error);
    const cleanErr = formatGeminiError(error);
    res.status(500).json({ error: cleanErr });
  }
});

// Handle uncaught exceptions and rejections gracefully
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Setup Vite Dev Server or Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      root: path.resolve("../frontend"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyMate AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

