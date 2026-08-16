import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

function createMasterPDF() {
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  const outputPath = path.join(process.cwd(), "StudyMate_AI_Master_Submission.pdf");
  doc.pipe(fs.createWriteStream(outputPath));

  const PRIMARY = "#4F46E5";
  const SECONDARY = "#7C3AED";
  const DARK_TEXT = "#1E293B";

  // COVER PAGE
  doc.rect(0, 0, 595.28, 841.89).fill("#0F172A");

  doc.fillColor("#FFFFFF")
     .fontSize(32)
     .font("Helvetica-Bold")
     .text("StudyMate.AI", 50, 220, { align: "center" });

  doc.fillColor("#A5B4FC")
     .fontSize(16)
     .font("Helvetica")
     .text("Vibe Coding: Building & Deploying an AI Web Application on AWS", 50, 270, { align: "center", width: 495 });

  doc.fillColor("#E2E8F0")
     .fontSize(12)
     .font("Helvetica-Oblique")
     .text("Project Concept Note & Comprehensive Development Report", 50, 320, { align: "center" });

  doc.rect(100, 380, 395, 80).fillOpacity(0.15).fill("#FFFFFF").strokeOpacity(0.3).stroke("#A5B4FC");
  
  doc.fillColor("#38BDF8")
     .fontSize(11)
     .font("Helvetica-Bold")
     .text("LIVE AWS DEPLOYED APPLICATION URL:", 50, 400, { align: "center" });

  doc.fillColor("#FFFFFF")
     .fontSize(13)
     .font("Helvetica-Bold")
     .text("https://15.135.202.64.sslip.io", 50, 422, { align: "center" });

  doc.fillColor("#94A3B8")
     .fontSize(10)
     .font("Helvetica")
     .text("Submitted for: Vibe Coding Masterclass Series", 50, 700, { align: "center" });
  doc.text("Organization: IBM & Bharat Cares", 50, 715, { align: "center" });

  // PAGE 2: CONCEPT NOTE
  doc.addPage({ margin: 50, size: "A4" });
  doc.rect(0, 0, 595.28, 90).fill(PRIMARY);
  doc.fillColor("#FFFFFF").fontSize(20).font("Helvetica-Bold").text("PART 1: PROJECT CONCEPT NOTE", 50, 30);
  doc.fontSize(11).font("Helvetica").text("Vibe Coding Masterclass | IBM & Bharat Cares", 50, 58);

  let y = 110;

  function addHeader(title) {
    if (y > 700) { doc.addPage(); y = 50; }
    doc.fillColor(PRIMARY).fontSize(13).font("Helvetica-Bold").text(title, 50, y);
    y += 18;
    doc.moveTo(50, y).lineTo(545, y).strokeColor(PRIMARY).lineWidth(1).stroke();
    y += 10;
  }

  function addBlock(title, text) {
    const textHeight = doc.heightOfString(text, { width: 495 });
    if (y + textHeight + (title ? 18 : 0) > 740) { doc.addPage(); y = 50; }
    if (title) {
      doc.fillColor(DARK_TEXT).fontSize(11).font("Helvetica-Bold").text(title, 50, y);
      y += 14;
    }
    doc.fillColor(DARK_TEXT).fontSize(10).font("Helvetica").text(text, 50, y, { width: 495, align: "justify" });
    y += textHeight + 10;
  }

  addHeader("1. Project Title & Application Name");
  addBlock(null, "• Application Name: StudyMate.AI\n• Project Title: Building & Deploying an AI-Powered Learning Assistant on AWS");

  addHeader("2. Problem Statement & Objective");
  addBlock(null, "Students and researchers face cognitive overload when synthesizing dense study material, textbooks, and lecture notes. StudyMate.AI simplifies notes into ELI5 summaries, answers real-time queries via an AI tutor, and auto-generates MCQ practice quizzes.");

  addHeader("3. Target User & Use Cases");
  addBlock(null, "• High School & University Students preparing for exams.\n• Researchers & Educators analyzing documents (.pdf, .docx, .txt).\n• Self-Learners seeking interactive subject guidance.");

  addHeader("4. LLM Model & API Integration");
  addBlock(null, "• LLM Engine: Google Gemini 3.6 Flash\n• API Integration: @google/genai Node.js SDK via secure Express.js backend endpoints.");

  addHeader("5. Key Features");
  addBlock("• Instant Notes Simplifier & ELI5 Generator", "Converts raw notes/documents into concise structured bullet points.");
  addBlock("• Multi-Format Document Ingestion", "Parses PDFs, Word files (.docx), and plain text (.txt).");
  addBlock("• Interactive AI Tutor Chat", "Real-time AI tutor offering step-by-step academic explanations.");
  addBlock("• Automated MCQ Quiz & Score Analysis", "Generates 5-question multiple choice quizzes with instant scoring.");

  addHeader("6. Expected Outcomes & Live URL");
  addBlock(null, "Reduces study time by up to 60% and increases information retention.\n\nLive AWS Application URL: https://15.135.202.64.sslip.io");

  // PAGE 3: PROJECT REPORT
  doc.addPage({ margin: 50, size: "A4" });
  doc.rect(0, 0, 595.28, 90).fill(SECONDARY);
  doc.fillColor("#FFFFFF").fontSize(20).font("Helvetica-Bold").text("PART 2: PROJECT DEVELOPMENT REPORT", 50, 30);
  doc.fontSize(11).font("Helvetica").text("Vibe Coding Methodology & AWS Deployment Summary", 50, 58);

  y = 110;

  function addHeader2(title) {
    if (y > 700) { doc.addPage(); y = 50; }
    doc.fillColor(SECONDARY).fontSize(13).font("Helvetica-Bold").text(title, 50, y);
    y += 18;
    doc.moveTo(50, y).lineTo(545, y).strokeColor(SECONDARY).lineWidth(1).stroke();
    y += 10;
  }

  addHeader2("1. Tech Stack Overview");
  addBlock(null, "• Frontend: React 19, Vite, Tailwind CSS v4, Lucide Icons, Motion.\n• Backend: Node.js 20, Express.js, Esbuild, Mammoth parser.\n• AI Engine: Google Gemini 3.6 Flash (@google/genai SDK).\n• Cloud: AWS EC2 (t2.micro / Ubuntu 24.04 LTS), Nginx Reverse Proxy, PM2, Let's Encrypt Certbot SSL.");

  addHeader2("2. Prompting Strategy & Frameworks");
  addBlock("Persona Prompting", "Configured AI with 'Expert Academic Exam Tutor' persona for clear, structured, encouraging responses.");
  addBlock("JSON Schema Output", "Enforced rigid JSON schema for Quiz Generation [{ id, question, options, correctIndex, explanation }].");

  addHeader2("3. Development Phases");
  addBlock("Phase 1: Design & UI System", "Implemented frosted-glass aesthetic with dark mode and mobile responsiveness.");
  addBlock("Phase 2: Backend API Development", "Built Express endpoints keeping Gemini API keys securely on server side.");
  addBlock("Phase 3: Code Hardening & Git", "Configured .gitignore to prevent secret leaks, pushing clean code to GitHub.");
  addBlock("Phase 4: AWS Cloud Infrastructure", "Provisioned EC2 instance, configured Security Groups (22, 80, 443), installed Node 20, PM2, and Nginx.");
  addBlock("Phase 5: SSL Security & Optimization", "Configured Let's Encrypt Certbot on 15.135.202.64.sslip.io and optimized mobile layout.");

  addHeader2("4. Challenges & Resolutions");
  addBlock("Challenge: Secret Key Protection", "GitHub Push Protection blocked commit due to API keys in env file. Resolved by clearing git history, updating .gitignore, and setting environment variables directly on EC2.");
  addBlock("Challenge: Mobile Layout Overflow", "Adjusted header navigation items and root container overflow-x-hidden for 390px mobile viewports.");

  addHeader2("5. Reflections & Conclusion");
  addBlock(null, "Demonstrated end-to-end Vibe Coding methodology—architecting, building, and deploying a functional AI web application on AWS Free Tier with zero cost and maximum security.");

  doc.end();
  console.log("Master Submission PDF created successfully!");
}

createMasterPDF();
