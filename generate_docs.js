import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const BEANSTALK_URL = "http://studymate-ai-prod-env.eba-6yuyfhhu.ap-southeast-2.elasticbeanstalk.com";

function createConceptNote() {
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  const outputPath = path.join(process.cwd(), "StudyMate_AI_Concept_Note.pdf");
  doc.pipe(fs.createWriteStream(outputPath));

  const PRIMARY = "#4F46E5";
  const DARK_TEXT = "#1E293B";

  // Header Banner
  doc.rect(0, 0, 595.28, 110).fill(PRIMARY);
  
  doc.fillColor("#FFFFFF")
     .fontSize(24)
     .font("Helvetica-Bold")
     .text("PROJECT CONCEPT NOTE", 50, 30);

  doc.fontSize(14)
     .font("Helvetica")
     .text("Vibe Coding Masterclass Series | IBM & Bharat Cares", 50, 60);

  doc.fontSize(9)
     .font("Helvetica-Oblique")
     .text(`Live AWS Elastic Beanstalk URL: ${BEANSTALK_URL}`, 50, 84);

  let y = 130;

  function addSectionHeader(title) {
    if (y > 700) { doc.addPage(); y = 50; }
    doc.fillColor(PRIMARY).fontSize(14).font("Helvetica-Bold").text(title, 50, y);
    y += 20;
    doc.moveTo(50, y).lineTo(545, y).strokeColor(PRIMARY).lineWidth(1).stroke();
    y += 10;
  }

  function addParagraph(title, text) {
    const textHeight = doc.heightOfString(text, { width: 495 });
    if (y + textHeight + (title ? 18 : 0) > 740) { doc.addPage(); y = 50; }
    if (title) {
      doc.fillColor(DARK_TEXT).fontSize(11).font("Helvetica-Bold").text(title, 50, y);
      y += 14;
    }
    doc.fillColor(DARK_TEXT).fontSize(10).font("Helvetica").text(text, 50, y, { width: 495, align: "justify" });
    y += textHeight + 12;
  }

  // 1. Project Title
  addSectionHeader("1. Project Title & Application Name");
  addParagraph(null, "Application Name: StudyMate.AI\nProject Title: Building & Deploying a Containerized AI Learning Platform on AWS Elastic Beanstalk");

  // 2. Problem Statement
  addSectionHeader("2. Problem Statement & Objective");
  addParagraph(null, "Students, researchers, and self-learners face significant cognitive overload when attempting to synthesize vast amounts of study notes, textbooks, and academic papers. Traditional study methods are often passive and inefficient.\n\nThe objective of StudyMate.AI is to provide an interactive, AI-driven study companion that simplifies complex lecture notes into ELI5 (Explain Like I'm 5) summaries, answers real-time student queries via an interactive tutor, and generates custom self-assessment quizzes to promote active recall.");

  // 3. Target User & Use Cases
  addSectionHeader("3. Target User & Primary Use Cases");
  addParagraph(null, "• High School & University Students: Preparing for exams, reviewing dense lecture notes, and generating custom practice quizzes.\n• Researchers & Educators: Uploading research documents (.pdf, .docx, .txt) for rapid synthesis and concept breakdown.\n• Lifelong Learners: Seeking simplified, structured explanations of complex subjects.");

  // 4. LLM Model & API Integration
  addSectionHeader("4. LLM Model & API Used");
  addParagraph(null, "• LLM Engine: Google Gemini 3.6 Flash API\n• SDK Integration: @google/genai Node.js SDK\n• API Handling: Express.js backend API endpoints managing secure server-side communications to prevent client-side credential exposure.");

  // 5. Containerization & Cloud Deployment
  addSectionHeader("5. Docker Containerization & AWS Architecture");
  addParagraph(null, `• Containerization: Application containerized via multi-stage Dockerfile (Node.js 20-slim).\n• Cloud Platform: AWS Elastic Beanstalk (Docker Platform running on 64-bit Amazon Linux 2023).\n• Live AWS URL: ${BEANSTALK_URL}`);

  // 6. Key Features
  addSectionHeader("6. Key Features of the Application");
  addParagraph("• Instant Notes Simplifier & ELI5 Generator", "Transforms raw study notes or uploaded documents into structured summaries, key bullet points, and simplified explanations.");
  addParagraph("• Multi-Format Document Ingestion", "Supports direct file uploads of PDFs, Word documents (.docx via Mammoth parser), and plain text (.txt).");
  addParagraph("• Interactive AI Tutor Chat", "Conversational AI persona optimized for step-by-step academic explanations and guidance.");
  addParagraph("• Automated MCQ Quiz & Score Analysis", "Generates structured multiple-choice quizzes from user notes with instant automated scoring and explanations.");

  doc.end();
  console.log("Updated Concept Note created successfully!");
}

function createProjectReport() {
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  const outputPath = path.join(process.cwd(), "StudyMate_AI_Project_Report.pdf");
  doc.pipe(fs.createWriteStream(outputPath));

  const SECONDARY = "#7C3AED";
  const DARK_TEXT = "#1E293B";

  // Header Banner
  doc.rect(0, 0, 595.28, 110).fill(SECONDARY);
  
  doc.fillColor("#FFFFFF")
     .fontSize(24)
     .font("Helvetica-Bold")
     .text("PROJECT DEVELOPMENT REPORT", 50, 30);

  doc.fontSize(14)
     .font("Helvetica")
     .text("Vibe Coding & AWS Elastic Beanstalk Deployment | IBM & Bharat Cares", 50, 60);

  doc.fontSize(9)
     .font("Helvetica-Oblique")
     .text(`Live AWS Elastic Beanstalk URL: ${BEANSTALK_URL}`, 50, 84);

  let y = 130;

  function checkPageBreak(neededHeight = 60) {
    if (y + neededHeight > 730) {
      doc.addPage();
      y = 50;
    }
  }

  function addSectionHeader(title) {
    checkPageBreak(40);
    doc.fillColor(SECONDARY).fontSize(14).font("Helvetica-Bold").text(title, 50, y);
    y += 20;
    doc.moveTo(50, y).lineTo(545, y).strokeColor(SECONDARY).lineWidth(1).stroke();
    y += 10;
  }

  function addParagraph(title, text) {
    const textHeight = doc.heightOfString(text, { width: 495 });
    checkPageBreak(textHeight + (title ? 20 : 10));
    if (title) {
      doc.fillColor(DARK_TEXT).fontSize(11).font("Helvetica-Bold").text(title, 50, y);
      y += 14;
    }
    doc.fillColor(DARK_TEXT).fontSize(10).font("Helvetica").text(text, 50, y, { width: 495, align: "justify" });
    y += textHeight + 12;
  }

  // 1. Overview & Tech Stack
  addSectionHeader("1. Application Overview & Tech Stack");
  addParagraph(null, "StudyMate.AI is a full-stack, AI-powered study platform built using modern Vibe Coding techniques, containerized with Docker, and deployed on AWS Elastic Beanstalk.");
  addParagraph("Tech Stack Breakdown:", 
    "• Frontend: React 19, Vite, Tailwind CSS v4, Motion animations, Lucide React icons.\n" +
    "• Backend: Node.js 20, Express.js framework, Esbuild bundler, Mammoth document parser.\n" +
    "• AI Model: Google Gemini 3.6 Flash (@google/genai SDK).\n" +
    "• Containerization: Docker (Dockerfile based on Node.js 20-slim, Dockerrun.aws.json v1).\n" +
    "• Cloud Infrastructure: AWS Elastic Beanstalk (Docker on 64-bit Amazon Linux 2023), Single Instance Free Tier.");

  // 2. Prompting Strategy
  addSectionHeader("2. Prompting Strategy & Frameworks Used");
  addParagraph("Persona & System Prompting", "The AI is assigned a pedagogical persona ('Expert Academic Tutor') instructed to maintain clarity, encouraging tone, and structured formatting.");
  addParagraph("Structured Output Schema (JSON)", "For Quiz Generation, prompts enforce a rigid JSON schema enforcing question text, options array, correct option index, and detailed explanation to ensure flawless UI parsing.");

  // 3. Phase-by-Phase Development Summary
  addSectionHeader("3. Phase-by-Phase Development Summary");
  addParagraph("Phase 1: Design & UI System", "Implemented frosted-glass aesthetic with dark mode and mobile responsiveness.");
  addParagraph("Phase 2: Backend & LLM Integration", "Built Express API endpoints (/api/simplify, /api/tutor, /api/quiz) ensuring Gemini API keys remain strictly secure on the server side.");
  addParagraph("Phase 3: Docker Containerization", "Created Dockerfile packaging the full-stack app into a lightweight Docker container with POSIX Linux ZIP formatting.");
  addParagraph("Phase 4: AWS Elastic Beanstalk Deployment", "Launched AWS Elastic Beanstalk environment (studymate-ai-prod-env) on Docker Platform with Environment Properties (PORT, NODE_ENV, GEMINI_API_KEY).");

  // 4. Application Architecture
  addSectionHeader("4. Application Architecture");
  addParagraph(null, `Client Browser ──(HTTP/Port 80)──► AWS Elastic Beanstalk Nginx ──► Docker Container (Node.js Express App) ──(API Key / SDK)──► Google Gemini 3.6 API\n\nLive URL: ${BEANSTALK_URL}`);

  // 5. Challenges & Resolutions
  addSectionHeader("5. Challenges Encountered & Resolutions");
  addParagraph("Challenge 1: Cross-Platform ZIP Path Separator Bug", "Windows zip utility generated backslash entry paths (dist\\server.cjs) causing Linux Docker COPY to fail. Resolved by building POSIX forward-slash ZIP archiver.");
  addParagraph("Challenge 2: Dockerrun.aws.json Manifest", "Added Dockerrun.aws.json v1 manifest mapping container port 3000 to AWS Elastic Beanstalk engine.");
  addParagraph("Challenge 3: Environment Variable Security", "Ensured API keys are never bundled in client code. Configured GEMINI_API_KEY as an AWS Elastic Beanstalk Environment Property.");

  // 6. Reflection
  addSectionHeader("6. Key Learnings & Reflection");
  addParagraph(null, "This project demonstrated end-to-end Vibe Coding methodology—architecting, containerizing with Docker, and deploying a functional AI web application on AWS Elastic Beanstalk Free Tier with zero cost and maximum security.");

  doc.end();
  console.log("Updated Project Report created successfully!");
}

createConceptNote();
createProjectReport();
