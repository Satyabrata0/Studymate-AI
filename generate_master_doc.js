import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const BEANSTALK_URL = "http://Studymate-AI-env.eba-6yuyfhhu.ap-southeast-2.elasticbeanstalk.com";

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
     .text("Containerized Docker Application & AWS Elastic Beanstalk Report", 50, 320, { align: "center" });

  doc.rect(50, 380, 495, 90).fillOpacity(0.15).fill("#FFFFFF").strokeOpacity(0.3).stroke("#A5B4FC");
  
  doc.fillColor("#38BDF8")
     .fontSize(11)
     .font("Helvetica-Bold")
     .text("LIVE AWS ELASTIC BEANSTALK URL:", 50, 400, { align: "center" });

  doc.fillColor("#FFFFFF")
     .fontSize(11)
     .font("Helvetica-Bold")
     .text(BEANSTALK_URL, 55, 425, { align: "center", width: 485 });

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
  addBlock(null, `• Application Name: StudyMate.AI\n• Project Title: Containerized AI Learning Assistant on AWS Elastic Beanstalk`);

  addHeader("2. Problem Statement & Objective");
  addBlock(null, "Students and researchers face cognitive overload when synthesizing dense study material. StudyMate.AI simplifies notes into ELI5 summaries, answers real-time queries via an AI tutor, and auto-generates MCQ practice quizzes.");

  addHeader("3. Target User & Use Cases");
  addBlock(null, "• High School & University Students preparing for exams.\n• Researchers & Educators analyzing documents (.pdf, .docx, .txt).\n• Self-Learners seeking interactive subject guidance.");

  addHeader("4. LLM Model & API Integration");
  addBlock(null, "• LLM Engine: Google Gemini 3.6 Flash\n• API Integration: @google/genai Node.js SDK via secure Express.js backend endpoints.");

  addHeader("5. Docker Containerization & AWS Platform");
  addBlock(null, `• Containerization: Built using multi-stage Dockerfile (Node.js 20 Alpine).\n• Cloud Platform: AWS Elastic Beanstalk (Docker on 64-bit Amazon Linux 2023).\n• Live URL: ${BEANSTALK_URL}`);

  // PAGE 3: PROJECT REPORT
  doc.addPage({ margin: 50, size: "A4" });
  doc.rect(0, 0, 595.28, 90).fill(SECONDARY);
  doc.fillColor("#FFFFFF").fontSize(20).font("Helvetica-Bold").text("PART 2: PROJECT DEVELOPMENT REPORT", 50, 30);
  doc.fontSize(11).font("Helvetica").text("Vibe Coding Methodology & AWS Docker Deployment", 50, 58);

  y = 110;

  function addHeader2(title) {
    if (y > 700) { doc.addPage(); y = 50; }
    doc.fillColor(SECONDARY).fontSize(13).font("Helvetica-Bold").text(title, 50, y);
    y += 18;
    doc.moveTo(50, y).lineTo(545, y).strokeColor(SECONDARY).lineWidth(1).stroke();
    y += 10;
  }

  addHeader2("1. Tech Stack Overview");
  addBlock(null, "• Frontend: React 19, Vite, Tailwind CSS v4, Lucide Icons, Motion.\n• Backend: Node.js 20, Express.js, Esbuild, Mammoth parser.\n• AI Engine: Google Gemini 3.6 Flash (@google/genai SDK).\n• Containerization: Docker (Dockerfile based on Node.js 20 Alpine).\n• Cloud: AWS Elastic Beanstalk (Docker on 64-bit Amazon Linux 2023).");

  addHeader2("2. Prompting Strategy & Frameworks");
  addBlock("Persona Prompting", "Configured AI with 'Expert Academic Exam Tutor' persona for clear, structured, encouraging responses.");
  addBlock("JSON Schema Output", "Enforced rigid JSON schema for Quiz Generation [{ id, question, options, correctIndex, explanation }].");

  addHeader2("3. Development Phases");
  addBlock("Phase 1: Design & UI System", "Implemented frosted-glass aesthetic with dark mode and mobile responsiveness.");
  addBlock("Phase 2: Backend API Development", "Built Express endpoints keeping Gemini API keys securely on server side.");
  addBlock("Phase 3: Docker Containerization", "Created Dockerfile packaging the full-stack app into a lightweight Docker container.");
  addBlock("Phase 4: AWS Elastic Beanstalk Deployment", "Launched AWS Elastic Beanstalk environment on Docker Platform with Environment Properties (PORT, NODE_ENV, GEMINI_API_KEY).");

  addHeader2("4. Reflections & Conclusion");
  addBlock(null, "Demonstrated end-to-end Vibe Coding methodology—architecting, containerizing with Docker, and deploying a functional AI web application on AWS Elastic Beanstalk Free Tier with zero cost and maximum security.");

  doc.end();
  console.log("Updated Master Submission PDF created successfully!");
}

createMasterPDF();
