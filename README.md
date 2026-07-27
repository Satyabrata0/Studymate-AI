# StudyMate AI 🎓

StudyMate AI is a clean, production-ready AI-powered study assistant built with Express, Node.js, React, Tailwind CSS, and Google Gemini 3.6 Flash.

## Core Features

- 📝 **Notes Simplifier**: Instant summaries, ELI5 simplified explanations, and key takeaways.
- 💬 **AI Tutor**: Real-time streaming interactive Q&A assistant backed by your study notes.
- 🎯 **Quiz Generator**: Customizable MCQs (Easy/Medium/Hard, 5 or 10 questions) with automated scoring and detailed explanations.
- ⚡ **Real-Time Streaming**: Low-latency response streaming using Server-Sent Events (SSE).
- 🐳 **Docker & AWS App Runner Ready**: Production-grade multi-stage container build.

---

## Architecture & Tech Stack

- **Frontend**: React, Tailwind CSS v4, Lucide Icons, Framer Motion
- **Backend**: Node.js + Express (`server.ts`)
- **AI SDK**: `@google/genai` using model `gemini-3.6-flash`
- **Containerization**: Docker multi-stage build (`Dockerfile`)
- **Deployment**: AWS App Runner / Cloud Run / Container Registry

---

## Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file or export the key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Docker Build & Run

1. **Build Docker Image**
   ```bash
   docker build -t studymate-ai .
   ```

2. **Run Docker Container**
   ```bash
   docker run -p 3000:3000 -e GEMINI_API_KEY="your_api_key" studymate-ai
   ```

---

## AWS App Runner Deployment

1. **Push Container to AWS ECR**:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
   docker tag studymate-ai:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/studymate-ai:latest
   docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/studymate-ai:latest
   ```

2. **Deploy Service on App Runner**:
   - Create a new service in AWS App Runner console.
   - Choose **Container Image** and select `studymate-ai:latest`.
   - Set Port to `3000`.
   - Add Environment Variable `GEMINI_API_KEY`.
   - Click **Deploy**.

---

## Decoupled PDF Processing Microservice Architecture (Recommendation)

For production scalability, PDF parsing should remain decoupled from the main web server to keep the core API fast and lightweight.

### Proposed PDF Microservice Design:
1. **API Gateway / Lambda or Microservice**: A standalone Node.js service running `pdf-parse` or using AWS Textract.
2. **Storage**: User uploads PDF directly to an S3 bucket via presigned upload URL.
3. **Extraction**: S3 event triggers an AWS Lambda function or PDF worker service to extract plain text markdown.
4. **Integration**: The extracted text is returned or saved and passed to `POST /api/simplify` as note content.
5. **Alternative**: Native Gemini multimodal parsing allows sending base64 PDF inline directly to the Gemini API without external OCR libraries.
