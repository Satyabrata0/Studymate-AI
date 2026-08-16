import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const BEANSTALK_URL = "http://studymate-ai-prod-env.eba-6yuyfhhu.ap-southeast-2.elasticbeanstalk.com";
const RENDER_HTTPS_URL = "https://studymate-ai-5z50.onrender.com";

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
     .text("StudyMate.AI", 50, 160, { align: "center" });

  doc.fillColor("#A5B4FC")
     .fontSize(15)
     .font("Helvetica")
     .text("Vibe Coding: Building & Deploying a Containerized AI Web App", 50, 210, { align: "center", width: 495 });

  doc.fillColor("#CBD5E1")
     .fontSize(11)
     .font("Helvetica-Oblique")
     .text("Docker Containerization, AWS Elastic Beanstalk & HTTPS Report", 50, 255, { align: "center" });

  // BOX 1: AWS ELASTIC BEANSTALK URL
  doc.rect(40, 310, 515, 75).fill("#1E293B").stroke("#38BDF8");
  
  doc.fillColor("#38BDF8")
     .fontSize(11)
     .font("Helvetica-Bold")
     .text("LIVE AWS ELASTIC BEANSTALK DEPLOYMENT (DOCKER):", 50, 325, { align: "center" });

  doc.fillColor("#FFFFFF")
     .fontSize(10)
     .font("Helvetica-Bold")
     .text(BEANSTALK_URL, 45, 348, { align: "center", width: 505 });

  // BOX 2: RENDER PUBLIC HTTPS URL
  doc.rect(40, 410, 515, 75).fill("#1E293B").stroke("#4ADE80");

  doc.fillColor("#4ADE80")
     .fontSize(11)
     .font("Helvetica-Bold")
     .text("LIVE SECURE HTTPS PUBLIC URL (DOCKER):", 50, 425, { align: "center" });

  doc.fillColor("#FFFFFF")
     .fontSize(11)
     .font("Helvetica-Bold")
     .text(RENDER_HTTPS_URL, 45, 448, { align: "center", width: 505 });

  // FOOTER DETAILS
  doc.fillColor("#F8FAFC")
     .fontSize(10)
     .font("Helvetica-Bold")
     .text("Submitted for: Vibe Coding Masterclass Series", 50, 690, { align: "center" });
  doc.fillColor("#E2E8F0")
     .fontSize(10)
     .font("Helvetica")
     .text("Organization: IBM & Bharat Cares", 50, 710, { align: "center" });

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
  addBlock(null, `• Application Name: StudyMate.AI\n• Project Title: Containerized AI Learning Assistant on AWS Elastic Beanstalk & HTTPS Cloud Platform`);

  addHeader("2. Problem Statement & Objective");
  addBlock(null, "Students and researchers face cognitive overload when synthesizing dense study material. StudyMate.AI simplifies notes into ELI5 summaries, answers real-time queries via an AI tutor, and auto-generates MCQ practice quizzes.");

  addHeader("3. Target User & Use Cases");
  addBlock(null, "• High School & University Students preparing for exams.\n• Researchers & Educators analyzing documents (.pdf, .docx, .txt).\n• Self-Learners seeking interactive subject guidance.");

  addHeader("4. LLM Model & API Integration");
  addBlock(null, "• LLM Engine: Google Gemini 3.6 Flash\n• API Integration: @google/genai Node.js SDK via secure Express.js backend endpoints.");

  addHeader("5. Docker Containerization & Live URLs");
  addBlock(null, `• Containerization: Built using multi-stage Dockerfile (Node.js 20-slim, Dockerrun.aws.json v1).\n• AWS Elastic Beanstalk URL: ${BEANSTALK_URL}\n• Live Secure HTTPS Public URL: ${RENDER_HTTPS_URL}`);

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
  addBlock(null, "• Frontend: React 19, Vite, Tailwind CSS v4, Lucide Icons, Motion.\n• Backend: Node.js 20, Express.js, Esbuild, Mammoth parser.\n• AI Engine: Google Gemini 3.6 Flash (@google/genai SDK).\n• Containerization: Multi-stage Dockerfile (Node.js 20-slim), Dockerrun.aws.json.\n• Deployments: AWS Elastic Beanstalk & Render Cloud Platform.");

  addHeader2("2. Prompting Strategy & Frameworks");
  addBlock("Persona Prompting", "Configured AI with 'Expert Academic Exam Tutor' persona for clear, structured, encouraging responses.");
  addBlock("JSON Schema Output", "Enforced rigid JSON schema for Quiz Generation [{ id, question, options, correctIndex, explanation }].");

  addHeader2("3. Live Deployment URLs");
  addBlock("AWS Elastic Beanstalk Docker URL", BEANSTALK_URL);
  addBlock("Secure HTTPS Public URL (SSL Encrypted)", RENDER_HTTPS_URL);

  addHeader2("4. Reflections & Conclusion");
  addBlock(null, "Demonstrated end-to-end Vibe Coding methodology—architecting, containerizing with Docker, and deploying a functional AI web application on AWS Elastic Beanstalk and HTTPS Cloud infrastructure with zero cost and maximum security.");

  doc.end();
  console.log("Updated Master Submission PDF created successfully!");
}

createMasterPDF();
