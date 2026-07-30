# ⚡ AI Resume Analyzer & Interview Prep Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Google_Gemini-3.6_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Puppeteer-PDF_Rendering-00D8FF?style=for-the-badge&logo=puppeteer&logoColor=black" alt="Puppeteer" />
  <img src="https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render" />
</p>

An intelligent, full-stack web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS), generate job-tailored single-page A4 resumes, and practice customized Technical, Behavioral, and HR interview questions powered by Google Gemini AI.

---

## 🔗 Live Demo

- **🌐 Live Frontend App**: [https://ai-resume-analyzer-nine-taupe.vercel.app](https://ai-resume-analyzer-nine-taupe.vercel.app)
- **⚡ Backend API Server**: `https://ai-resume-analyzer-r9nt.onrender.com`

---

## ✨ Key Features

- **📊 Comprehensive ATS Match Score**: Analyzes candidate resumes against target job descriptions, providing detailed percentage scores for ATS compatibility, keyword impact, skills validation, writing quality, and recruiter match rates.
- **📄 Single-Page Tailored A4 Resume Generation**: Uses AI to re-write and structure candidate accomplishments into strict monochrome, ATS-optimized A4 HTML resumes with zero text overflow.
- **📥 One-Click PDF Export via Puppeteer**: Server-side PDF rendering using `puppeteer-core` and `@sparticuz/chromium` for high-resolution A4 print-ready downloads.
- **🎯 Tailored Interview Questions**: Generates 9 curated interview questions tailored to the job description and candidate resume:
  - 💻 **3 Technical Questions**: Includes question difficulty, category tags, interviewer intention, sample answers, and pro tips.
  - 💬 **3 Behavioral Questions**: Focused on situational experiences and STAR method execution.
  - 🤝 **3 HR & Culture Fit Questions**: Evaluates cultural alignment and career motivation.
- **🗓️ 5-Day Actionable Preparation Plan**: Daily step-by-step prep tasks personalized for identified skill gaps.
- **⚠️ ATS Risk & Skill Gap Warnings**: Highlights critical formatting risks, missing keywords, and severity-ranked skill gaps with fix recommendations.
- **🔐 Secure Authentication & History Tracking**: User JWT authentication with cookie sessions and recent reports history management (capped to the 5 most recent analyses).

---

## 🏗️ Architecture & Tech Stack

### **Frontend**
- **Framework**: React 18 (Vite SPA)
- **Routing**: React Router DOM v6 (Client-side routing with `vercel.json` rewrites)
- **State Management**: React Context API (`AuthContext`, `InterviewContext`)
- **HTTP Client**: Axios with credential cookies
- **Styling**: Modern dark mode UI with glassmorphism effects, custom CSS tokens, and responsive CSS Grid/Flexbox
- **Deployment**: Vercel

### **Backend**
- **Runtime**: Node.js v22 (Express 5.x REST API)
- **Database**: MongoDB Atlas via Mongoose ODM
- **AI Integration**: Google Gen AI SDK (`@google/genai`) using `gemini-3.6-flash` with multi-model retry fallback (`gemini-2.0-flash`, `gemini-2.0-flash-lite`)
- **Document Parsing**: `pdf-parse` for extracting text from uploaded resume PDFs
- **PDF Engine**: `puppeteer-core` + `@sparticuz/chromium` (Cloud Linux) & `puppeteer` (Local Dev)
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs` with `SameSite=None; Secure` HTTP-only cookies
- **Deployment**: Render Web Service

---

## 📁 Repository Structure

```text
ai-resume-analyzer/
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   │   ├── auth.controller.js        # Register, Login, Logout, GetMe handlers
│   │   │   └── interview.controller.js   # Report generation, PDF download, History APIs
│   │   ├── db/
│   │   │   └── db.js                     # MongoDB connection setup
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js        # JWT verification middleware
│   │   │   └── file.middleware.js        # Multer in-memory file upload middleware
│   │   ├── models/
│   │   │   ├── user.model.js             # User Schema
│   │   │   ├── blacklist.model.js        # Token blacklist Schema
│   │   │   └── interviewReport.model.js  # ATS Report & Resume Schema
│   │   ├── routes/
│   │   │   ├── auth.route.js             # Auth endpoints
│   │   │   └── interview.route.js        # Analysis & PDF endpoints
│   │   ├── services/
│   │   │   └── ai.service.js             # Gemini AI prompts & Puppeteer PDF engine
│   │   └── app.js                        # Express app setup & CORS configuration
│   ├── .env.example
│   ├── package.json
│   └── server.js                         # Backend entry point
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg                   # Custom green lightning bolt icon
│   │   └── icons.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                # Responsive Navbar & Logout modal
│   │   │   ├── Logo.jsx
│   │   │   └── protected.jsx             # Auth protection route wrapper
│   │   ├── features/
│   │   │   ├── auth/                     # Auth Context Provider
│   │   │   ├── hooks/                    # Custom hooks (useAuth, useInterview)
│   │   │   ├── interview/                # Interview Context Provider
│   │   │   ├── pages/                    # Home, Login, Register, Report, Loading
│   │   │   └── services/                 # Axios API service instances
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.development
│   ├── .env.production
│   ├── package.json
│   ├── vercel.json                       # Vercel SPA rewrite configuration
│   └── vite.config.js
└── README.md
```

---

## 🚀 Local Development Setup

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) or local MongoDB instance
- [Google Gemini API Key](https://aistudio.google.com/apikey)

---

### **1. Clone the Repository**

```bash
git clone https://github.com/HussainAli11746/ai-resume-analyzer.git
cd ai-resume-analyzer
```

---

### **2. Setup & Start Backend**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment configuration file
cp .env.example .env
```

Open `backend/.env` and fill in your credentials:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/interview-master
JWT_SECRET=your_super_secret_jwt_key_32_chars_or_more
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

Start the backend development server:

```bash
node server.js
# Output: Server is running on port 3000 | Database connected successfully
```

---

### **3. Setup & Start Frontend**

Open a second terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

Ensure `frontend/.env.development` exists:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Start the Vite development server:

```bash
npm run dev
# Output: VITE v5.x  ready in XXX ms  ➜  Local: http://localhost:5173/
```

Open `http://localhost:5173` in your browser!

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas database connection string |
| `JWT_SECRET` | Secret key used for signing JWT authentication tokens |
| `GEMINI_API_KEY` | Google Gemini API key from Google AI Studio |
| `PORT` | Local server port (Default: `3000`) |

### Frontend (`frontend/.env.production` / `frontend/.env.development`)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL pointing to the Express backend (`http://localhost:3000` in dev, `https://ai-resume-analyzer-r9nt.onrender.com` in production) |

---

## 🔒 Security & Best Practices

- **Secrets Isolation**: Real API keys, JWT secrets, and database URIs are excluded from Git via `.gitignore`. `.env.example` templates are provided for team deployment.
- **Cross-Origin Security**: Backend CORS is explicitly scoped to trusted origins with `credentials: true`.
- **Cookie Protection**: Authentication cookies enforce `httpOnly: true`, `secure: true`, and `sameSite: 'none'` for cross-domain security between Vercel and Render.
- **Rate-Limit Resilience**: Includes retry mechanisms across multiple Gemini models (`gemini-3.6-flash`, `gemini-2.0-flash`, `gemini-2.0-flash-lite`) with user-friendly 429 quota handling.

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).

---

<p align="center">
  Developed & Maintained by <a href="https://github.com/HussainAli11746" target="_blank"><b>Hussain Ali</b></a>
</p>