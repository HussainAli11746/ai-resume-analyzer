import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Logo from "../../components/Logo";
import { useInterview } from "../hooks/useInterview";
import LoadingPage, { PdfLoadingCard } from "./loading";
import "./report.css";

const ReportPage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { report, getReportById, downloadResumePdf, loading } = useInterview();
  const [currentReport, setCurrentReport] = useState(report);
  const [downloading, setDownloading] = useState(false);

  // Active Tab: "technical" | "behavioral" | "hr"
  const [activeTab, setActiveTab] = useState("technical");
  // Question Modal & Risk Modal State
  const [activeQuestionModal, setActiveQuestionModal] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [activeRiskModal, setActiveRiskModal] = useState(null);

  useEffect(() => {
    if (interviewId && (!currentReport || currentReport._id !== interviewId)) {
      getReportById(interviewId)
        .then((data) => {
          if (data && data.interviewReport) {
            setCurrentReport(data.interviewReport);
          }
        })
        .catch((err) => {
          console.error("Error fetching report:", err);
        });
    } else if (report) {
      setCurrentReport(report);
    }
  }, [interviewId, report]);

  // Handle ESC key to close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveQuestionModal(null);
        setActiveRiskModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [showRateLimitModal, setShowRateLimitModal] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState("");

  const handleDownloadPdf = async () => {
    if (!currentReport || !currentReport._id) return;
    try {
      setDownloading(true);
      await downloadResumePdf(currentReport._id, `${currentReport.title || "resume"}_tailored.pdf`);
    } catch (err) {
      console.error("PDF Download error:", err);
      const isRate =
        err.response?.status === 429 ||
        err.response?.data?.isRateLimit ||
        String(err.message || "").includes("429") ||
        String(err.response?.data?.message || "").includes("Limit") ||
        String(err.response?.data?.message || "").includes("quota");

      if (isRate) {
        setRateLimitMessage(
          err.response?.data?.message ||
            "AI Token Limit Reached! Gemini AI is taking a short nap. Please try again in 1-2 minutes! 🤖💤"
        );
        setShowRateLimitModal(true);
      } else {
        alert("Failed to download PDF. Please try again.");
      }
    } finally {
      setDownloading(false);
    }
  };

  if (loading && !currentReport) {
    return <LoadingPage mode="login" />;
  }

  if (!currentReport) {
    return (
      <div className="home-container" style={{ minHeight: "100vh" }}>
        <Navbar />
        <main className="report-page-container" style={{ alignItems: "center", justifyContent: "center" }}>
          <div className="modal-card" style={{ textAlign: "center" }}>
            <h2 className="modal-title" style={{ marginBottom: "12px" }}>No Report Selected</h2>
            <p className="modal-subtitle" style={{ marginBottom: "24px" }}>
              Please analyze a resume first to view detailed ATS feedback and interview preparation.
            </p>
            <Link to="/" className="btn-hero-primary" style={{ textDecoration: "none" }}>
              ← Go to Resume Analyzer
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const matchScore = currentReport.matchScore || 74;
  const grade = currentReport.grade || (matchScore >= 85 ? "A Grade" : matchScore >= 70 ? "B+ Grade" : "C Grade");
  const readiness = currentReport.readiness || "Solid ATS readiness ↗";
  const candidateName = currentReport.candidateName || "Candidate Profile";
  const scannedDate = currentReport.createdAt
    ? new Date(currentReport.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "July 28, 2026";

  const strengthsList = currentReport.strengths && currentReport.strengths.length > 0
    ? currentReport.strengths
    : [
        "Strong project experience",
        "Good technical skills",
        "Involvement in leadership roles",
        "Competitive programming experience",
      ];

  const improvementsList = currentReport.improvements && currentReport.improvements.length > 0
    ? currentReport.improvements
    : [
        "Add quantified achievements to projects",
        "Include professional work experience if available",
        "Improve resume formatting for better readability",
        "Add more specific details about teaching assistant role",
        "Include more context about hackathon participation",
      ];

  const secScores = currentReport.sectionScores || {
    atsCompatibility: 92,
    impactAndAchievements: 59,
    skillsValidation: 80,
    projectQuality: 50,
    writingQuality: 79,
    professionalism: 74,
  };

  const atsRisksList = (currentReport.atsRisks && currentReport.atsRisks.length > 0)
    ? currentReport.atsRisks
    : [
        {
          issue: "Inconsistent formatting",
          severity: "MEDIUM",
          description: "The resume has inconsistent bullet points and section headings which may affect ATS parsing.",
          fixRecommendation: "Fix: Standardize formatting throughout the resume."
        }
      ];

  const strongKw = currentReport.strongKeywords && currentReport.strongKeywords.length > 0
    ? currentReport.strongKeywords
    : ["React 96%", "Node.js 94%", "MongoDB 92%", "Python 90%", "LangChain 88%", "Gemini API 86%", "JWT 84%", "REST APIs 82%"];

  const missingKw = currentReport.missingKeywords && currentReport.missingKeywords.length > 0
    ? currentReport.missingKeywords
    : ["internship", "collaboration", "agile", "CI/CD", "testing", "microservices", "cloud", "DevOps"];

  // 3 Questions per Section
  const technicalQuestions = (currentReport.technicalQuestions && currentReport.technicalQuestions.length >= 3)
    ? currentReport.technicalQuestions.slice(0, 3)
    : [
        {
          question: "Can you explain JWT Authentication and how stateless sessions work?",
          topic: "Authentication",
          difficulty: "Medium",
          estimatedTime: "5 min",
          intention: "Evaluates your understanding of web security, tokens, and backend architecture.",
          answer: "JWT (JSON Web Token) consists of Header, Payload, and Signature. It provides stateless authentication without server database session lookups.",
          proTip: "Mention security best practices like HTTP-only cookies and short token expiration."
        },
        {
          question: "How do you optimize React component rendering performance?",
          topic: "React",
          difficulty: "Medium",
          estimatedTime: "4 min",
          intention: "Tests your mastery of state management, memoization, and rendering lifecycles.",
          answer: "Use React.memo, useMemo, useCallback, lazy loading components, and avoiding inline function definitions.",
          proTip: "Highlight actual performance bottlenecks you fixed in past web apps."
        },
        {
          question: "What is database indexing and how does it improve query execution time?",
          topic: "Database",
          difficulty: "Hard",
          estimatedTime: "5 min",
          intention: "Verifies database optimization skills and B-Tree indexing knowledge.",
          answer: "Indexes store data in B-Tree data structures, reducing table scan operations from O(N) to O(log N).",
          proTip: "Discuss composite indexes and avoiding over-indexing write-heavy tables."
        }
      ];

  const behavioralQuestions = (currentReport.behavioralQuestions && currentReport.behavioralQuestions.length >= 3)
    ? currentReport.behavioralQuestions.slice(0, 3)
    : [
        {
          question: "Tell me about a time you faced a difficult technical challenge and how you solved it.",
          topic: "Problem Solving",
          difficulty: "Medium",
          estimatedTime: "4 min",
          intention: "Assesses resilience, analytical thinking, and execution under tight deadlines.",
          answer: "Structure using STAR method: Detail the obstacle, root cause investigation, engineering fix, and positive project outcome.",
          proTip: "Quantify the result (e.g. reduced latency by 30%)."
        },
        {
          question: "Describe a situation where you had a disagreement with a team member on architecture.",
          topic: "Conflict Resolution",
          difficulty: "Medium",
          estimatedTime: "4 min",
          intention: "Evaluates teamwork, communication skills, and data-driven decision making.",
          answer: "Explain how you listened to their perspective, benchmarked performance metrics objectively, and reached alignment.",
          proTip: "Emphasize collaboration over proving yourself right."
        },
        {
          question: "How do you prioritize tasks when managing multiple project deadlines?",
          topic: "Time Management",
          difficulty: "Easy",
          estimatedTime: "3 min",
          intention: "Tests organizational skills and ability to handle high-velocity work environments.",
          answer: "Prioritize based on critical path impact, user severity, and break complex goals into sprint milestones.",
          proTip: "Mention project tools like Jira, GitHub Projects, or Trello."
        }
      ];

  const hrQuestions = (currentReport.hrQuestions && currentReport.hrQuestions.length >= 3)
    ? currentReport.hrQuestions.slice(0, 3)
    : [
        {
          question: "Why do you want to join our engineering team?",
          topic: "Culture Fit",
          difficulty: "Easy",
          estimatedTime: "3 min",
          intention: "Verifies genuine interest in company products, tech stack, and mission.",
          answer: "Express passion for the company's tech domain, highlight engineering growth alignment, and show enthusiasm for the role.",
          proTip: "Reference specific recent features or technical innovations of the company."
        },
        {
          question: "Where do you see yourself professionally in the next 3 to 5 years?",
          topic: "Career Goals",
          difficulty: "Easy",
          estimatedTime: "3 min",
          intention: "Evaluates career ambition, long-term commitment, and growth mindset.",
          answer: "Focus on growing technical depth as a full-stack engineer, taking end-to-end ownership of core systems, and mentoring junior devs.",
          proTip: "Keep goals aligned with engineering leadership or staff engineer tracks."
        },
        {
          question: "What are your salary expectations for this role?",
          topic: "Compensation",
          difficulty: "Medium",
          estimatedTime: "3 min",
          intention: "Assesses market awareness and salary alignment.",
          answer: "State a competitive market range based on industry research while emphasizing open flexibility for total compensation.",
          proTip: "Always research salary ranges for the role and location beforehand."
        }
      ];

  const activeQuestionList =
    activeTab === "technical"
      ? technicalQuestions
      : activeTab === "behavioral"
      ? behavioralQuestions
      : hrQuestions;

  const openQuestionModal = (item, index) => {
    setActiveQuestionModal(item);
    setActiveQuestionIndex(index);
  };

  const handlePrevQuestion = () => {
    if (activeQuestionIndex > 0) {
      const prevIndex = activeQuestionIndex - 1;
      setActiveQuestionIndex(prevIndex);
      setActiveQuestionModal(activeQuestionList[prevIndex]);
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < activeQuestionList.length - 1) {
      const nextIndex = activeQuestionIndex + 1;
      setActiveQuestionIndex(nextIndex);
      setActiveQuestionModal(activeQuestionList[nextIndex]);
    }
  };

  return (
    <div className="home-container">
      <Navbar />

      <main className="report-page-container">
        <div className="report-content-wrapper">
          {/* TOP GRID ROW (4 CARDS MATCHING REFERENCE DESIGN) */}
          <div className="report-top-grid">
            {/* CARD 1: ATS SCORE RING */}
            <div className="report-score-card">
              <div className="score-card-title">ATS SCORE</div>
              <div className="score-ring-wrapper">
                <svg className="score-ring-svg" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#a3e635"
                    strokeWidth="10"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * matchScore) / 100}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="score-number-center">
                  {matchScore}
                  <div className="score-number-sub">/100</div>
                </div>
              </div>
              <div className="score-grade-tag">{grade}</div>
              <div className="score-grade-sub">{readiness}</div>
            </div>

            {/* CARD 2: ATS SCAN RESULTS OVERVIEW */}
            <div className="report-overview-card">
              <div>
                <div className="overview-tag">ATS SCAN RESULTS</div>
                <h1 className="overview-title">
                  ATS Resume <span>Analysis</span>
                </h1>
                <p className="overview-role-subtitle">{currentReport.title || "Full-Stack Developer Resume"}</p>
                <p className="overview-desc">
                  Review the analysis below to improve your resume's ATS compatibility and increase your chances of getting shortlisted.
                </p>

                <div className="filename-box">
                  <span>📄</span>
                  <span>resume_devanshjha_fin.pdf</span>
                </div>
              </div>

              <div className="overview-meta-row">
                <div>
                  <div className="meta-item-label">DATE SCANNED</div>
                  <div className="meta-item-val">{scannedDate}</div>
                </div>
                <div>
                  <div className="meta-item-label">TARGET ROLE</div>
                  <div className="meta-item-val">{currentReport.title || "Full-Stack Developer"}</div>
                </div>
                <div>
                  <div className="meta-item-label">ATS PARSE RATE</div>
                  <div className="meta-item-val">{currentReport.parseRate || 100}%</div>
                </div>
                <div>
                  <div className="meta-item-label">RECRUITER MATCH</div>
                  <div className="meta-item-val" style={{ color: "#a3e635" }}>
                    {currentReport.recruiterMatch || matchScore || 60}%
                  </div>
                </div>
                <div>
                  <div className="meta-item-label">EXPERIENCE</div>
                  <div className="meta-item-val">{currentReport.experienceYears || "0 Years"}</div>
                </div>
              </div>
            </div>

            {/* CARD 3: QUICK INSIGHTS */}
            <div className="report-insights-card">
              <div className="insights-card-title">
                ⚡ QUICK INSIGHTS
              </div>
              <div className="insights-list">
                <div className="insight-item-box">
                  <div className="insight-item-icon icon-green">✓</div>
                  <div>
                    <div className="insight-text-title">ATS Friendly</div>
                    <div className="insight-text-sub">{secScores.atsCompatibility || 92}/100 compatibility score</div>
                  </div>
                </div>

                <div className="insight-item-box">
                  <div className="insight-item-icon icon-amber">⚠</div>
                  <div>
                    <div className="insight-text-title">Some Metrics Missing</div>
                    <div className="insight-text-sub">{secScores.impactAndAchievements || 59}/100 impact score</div>
                  </div>
                </div>

                <div className="insight-item-box">
                  <div className="insight-item-icon icon-amber">⚠</div>
                  <div>
                    <div className="insight-text-title">Keyword Gaps Found</div>
                    <div className="insight-text-sub">{strongKw.length} strong, {missingKw.length} missing</div>
                  </div>
                </div>

                <div className="insight-item-box">
                  <div className="insight-item-icon icon-amber">⚠</div>
                  <div>
                    <div className="insight-text-title">Weak Project Details</div>
                    <div className="insight-text-sub">{secScores.projectQuality || 50}/100 project quality score</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4: RESUME PREVIEW MOCKUP */}
            <div className="report-preview-card">
              <div className="preview-card-header">
                <span>📄 RESUME PREVIEW</span>
                <span style={{ cursor: "pointer" }}>🔗</span>
              </div>

              <div className="resume-paper-mockup">
                <div className="paper-name">{candidateName}</div>
                <div className="paper-sub">{currentReport.title || "Full-Stack Developer"} | Contact & Links</div>
                <div style={{ fontWeight: "700", marginBottom: "3px", color: "#a3e635" }}>EDUCATION</div>
                <div style={{ color: "#94a3b8", marginBottom: "6px" }}>B.Tech Computer Science & Engineering (2022-2026)</div>
                <div style={{ fontWeight: "700", marginBottom: "3px", color: "#a3e635" }}>TECHNICAL SKILLS</div>
                <div style={{ color: "#94a3b8", marginBottom: "6px" }}>React, Node.js, Express, MongoDB, Python, C++, Git</div>
                <div style={{ fontWeight: "700", marginBottom: "3px", color: "#a3e635" }}>PROJECTS & EXPERIENCE</div>
                <div style={{ color: "#94a3b8" }}>• Full-Stack Web App: Built AI Placement Copilot with authentication...</div>
              </div>

              <div className="preview-legend-row">
                <div className="legend-item"><span className="dot-strong"></span> Strong</div>
                <div className="legend-item"><span className="dot-amber"></span> Needs Improvements</div>
                <div className="legend-item"><span className="dot-missing"></span> Missing</div>
              </div>
            </div>
          </div>

          {/* BOTTOM GRID ROW (4 CARDS MATCHING REFERENCE DESIGN) */}
          <div className="report-bottom-grid">
            {/* CARD 1: AI SUMMARY */}
            <div className="bottom-card">
              <div className="bottom-card-header card-header-lime">
                <span>✨ AI Summary</span>
              </div>
              <p className="summary-text-p">
                {currentReport.aiSummary ||
                  `${candidateName} is a promising candidate with solid foundational skills and practical experience in full-stack development. Projects demonstrate a good understanding of modern web technologies and AI integration. However, quantified achievements and professional experience can be expanded.`}
              </p>

              <div className="summary-star-box">
                <span>⭐</span>
                <span>Implement the suggested improvements to boost your ATS score.</span>
              </div>
            </div>

            {/* CARD 2: STRENGTHS */}
            <div className="bottom-card">
              <div className="bottom-card-header card-header-lime">
                <span>🚀 Strengths</span>
              </div>
              <div className="bullet-list">
                {strengthsList.map((item, idx) => (
                  <div key={idx} className="bullet-item">
                    <span className="bullet-icon-green">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 3: IMPROVEMENTS */}
            <div className="bottom-card">
              <div className="bottom-card-header card-header-amber">
                <span>🎯 Improvements</span>
              </div>
              <div className="bullet-list">
                {improvementsList.map((item, idx) => (
                  <div key={idx} className="bullet-item">
                    <span className="bullet-icon-amber">⚠</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 4: SECTION SCORES */}
            <div className="bottom-card">
              <div className="bottom-card-header card-header-lime">
                <span>📈 Section Scores</span>
              </div>
              <div className="section-scores-list">
                <div className="section-score-row">
                  <div className="section-score-info">
                    <span className="section-name-text">ATS Compatibility</span>
                    <span className="section-score-num" style={{ color: "#a3e635" }}>{secScores.atsCompatibility || 92}/100</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-lime" style={{ width: `${secScores.atsCompatibility || 92}%` }}></div>
                  </div>
                </div>

                <div className="section-score-row">
                  <div className="section-score-info">
                    <span className="section-name-text">Impact & Achievements</span>
                    <span className="section-score-num" style={{ color: "#f59e0b" }}>{secScores.impactAndAchievements || 59}/100</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-amber" style={{ width: `${secScores.impactAndAchievements || 59}%` }}></div>
                  </div>
                </div>

                <div className="section-score-row">
                  <div className="section-score-info">
                    <span className="section-name-text">Skills Validation</span>
                    <span className="section-score-num" style={{ color: "#a3e635" }}>{secScores.skillsValidation || 80}/100</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-lime" style={{ width: `${secScores.skillsValidation || 80}%` }}></div>
                  </div>
                </div>

                <div className="section-score-row">
                  <div className="section-score-info">
                    <span className="section-name-text">Project Quality</span>
                    <span className="section-score-num" style={{ color: "#ef4444" }}>{secScores.projectQuality || 50}/100</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-red" style={{ width: `${secScores.projectQuality || 50}%` }}></div>
                  </div>
                </div>

                <div className="section-score-row">
                  <div className="section-score-info">
                    <span className="section-name-text">Writing Quality</span>
                    <span className="section-score-num" style={{ color: "#a3e635" }}>{secScores.writingQuality || 79}/100</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-lime" style={{ width: `${secScores.writingQuality || 79}%` }}></div>
                  </div>
                </div>

                <div className="section-score-row">
                  <div className="section-score-info">
                    <span className="section-name-text">Professionalism</span>
                    <span className="section-score-num" style={{ color: "#a3e635" }}>{secScores.professionalism || 74}/100</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-lime" style={{ width: `${secScores.professionalism || 74}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2-COLUMN PAIRED SECTION: ATS RISKS (LEFT) + KEYWORDS ANALYSIS (RIGHT) */}
          <div className="paired-risks-keywords-grid">
            {/* LEFT: ATS RISKS CARD (MATCHING REFERENCE IMAGE 1) */}
            <div className="ats-risks-card">
              <div className="card-section-title-amber">
                ⚠ ATS Risks <span>(Fix These)</span>
              </div>

              {atsRisksList.map((risk, idx) => (
                <div key={idx} className="risk-inner-box">
                  <div className="risk-info-left">
                    <span className="risk-severity-badge">{risk.severity || "MEDIUM"}</span>
                    <div>
                      <h4 className="risk-title-heading">{risk.issue}</h4>
                      <p className="risk-desc-p">{risk.description}</p>
                      <div className="risk-fix-text">{risk.fixRecommendation}</div>
                    </div>
                  </div>

                  <button
                    className="btn-view-fix"
                    onClick={() => setActiveRiskModal(risk)}
                  >
                    View Fix →
                  </button>
                </div>
              ))}
            </div>

            {/* RIGHT: KEYWORDS ANALYSIS CARD (MATCHING REFERENCE IMAGE 1) */}
            <div className="keywords-card">
              <h3 className="keywords-card-title">Keywords Analysis</h3>

              <div className="pills-group">
                <div className="pills-group-title strong">🟢 Strong Keywords</div>
                <div className="pills-subtext">These keywords are already working in your favour</div>
                <div className="pills-flex-wrap">
                  {strongKw.map((kw, idx) => (
                    <span key={idx} className="keyword-pill-lime">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pills-group">
                <div className="pills-group-title missing">🔴 Missing Keywords</div>
                <div className="pills-subtext">Add these to improve your ATS match rate</div>
                <div className="pills-flex-wrap">
                  {missingKw.map((kw, idx) => (
                    <span key={idx} className="keyword-pill-amber">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* REDESIGNED TABBED COMPACT INTERVIEW PREPARATION COMPONENT (EXACTLY 3 QUESTIONS PER SECTION) */}
          <div className="interview-prep-component">
            <div className="prep-component-header">
              <h3 className="prep-component-title">
                🎤 AI Interview Preparation
              </h3>

              {/* PILL-SHAPED TABS */}
              <div className="prep-tabs-pill-row">
                <button
                  className={`prep-tab-btn ${activeTab === "technical" ? "active" : ""}`}
                  onClick={() => setActiveTab("technical")}
                >
                  Technical <span className="prep-tab-count">(3)</span>
                </button>

                <button
                  className={`prep-tab-btn ${activeTab === "behavioral" ? "active" : ""}`}
                  onClick={() => setActiveTab("behavioral")}
                >
                  Behavioral <span className="prep-tab-count">(3)</span>
                </button>

                <button
                  className={`prep-tab-btn ${activeTab === "hr" ? "active" : ""}`}
                  onClick={() => setActiveTab("hr")}
                >
                  HR <span className="prep-tab-count">(3)</span>
                </button>
              </div>
            </div>

            {/* VERTICAL COMPACT QUESTION CARDS LIST */}
            <div className="questions-compact-list" key={activeTab}>
              {activeQuestionList.map((item, idx) => (
                <div
                  key={idx}
                  className="question-compact-card"
                  onClick={() => openQuestionModal(item, idx)}
                >
                  <div className="card-left-info">
                    <div className="question-card-title">{item.question}</div>
                    <div className="question-badges-row">
                      <span className="badge-topic">{item.topic || "General"}</span>
                      <span
                        className={
                          item.difficulty === "Easy"
                            ? "badge-diff-easy"
                            : item.difficulty === "Hard"
                            ? "badge-diff-hard"
                            : "badge-diff-medium"
                        }
                      >
                        {item.difficulty || "Medium"}
                      </span>
                      <span className="badge-time">⏱ {item.estimatedTime || "4 min"}</span>
                    </div>
                  </div>

                  <div className="card-arrow-icon">→</div>
                </div>
              ))}
            </div>
          </div>

          {/* SLEEK COMPACT PRE-FOOTER BANNER BAR */}
          <div className="sleek-cta-bar">
            <div className="sleek-cta-left">
              <div className="sleek-cta-icon-circle">⚡</div>
              <div>
                <h4 className="sleek-cta-title">Ready to improve your ATS score?</h4>
                <p className="sleek-cta-sub">Download your tailored PDF resume or upload an improved version to rescan.</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <button className="btn-sleek-reanalyze" onClick={handleDownloadPdf} disabled={downloading}>
                {downloading ? "Generating PDF..." : "📥 Download Tailored PDF Resume"}
              </button>
              <button
                type="button"
                className="btn-sleek-reanalyze"
                onClick={() => {
                  navigate("/");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#ffffff",
                  boxShadow: "none",
                  cursor: "pointer"
                }}
              >
                Re-analyze Resume →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* QUESTION DETAIL MODAL */}
      {activeQuestionModal && (
        <div className="q-modal-overlay" onClick={() => setActiveQuestionModal(null)}>
          <div className="q-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="q-modal-header">
              <div className="q-modal-badges">
                <span className="badge-topic">{activeQuestionModal.topic || "General"}</span>
                <span
                  className={
                    activeQuestionModal.difficulty === "Easy"
                      ? "badge-diff-easy"
                      : activeQuestionModal.difficulty === "Hard"
                      ? "badge-diff-hard"
                      : "badge-diff-medium"
                  }
                >
                  {activeQuestionModal.difficulty || "Medium"}
                </span>
                <span className="badge-time">⏱ {activeQuestionModal.estimatedTime || "4 min"}</span>
              </div>

              <button className="modal-close-btn" onClick={() => setActiveQuestionModal(null)}>
                ✕
              </button>
            </div>

            <div className="q-modal-body">
              <div>
                <div className="q-block-label" style={{ marginBottom: "4px" }}>QUESTION</div>
                <h3 className="q-modal-section-title">{activeQuestionModal.question}</h3>
              </div>

              <div className="q-section-block">
                <div className="q-block-label">WHY INTERVIEWERS ASK</div>
                <div className="q-block-content">{activeQuestionModal.intention}</div>
              </div>

              <div className="q-section-block">
                <div className="q-block-label">IDEAL ANSWER</div>
                <div className="q-block-content">{activeQuestionModal.answer}</div>
              </div>

              {activeQuestionModal.proTip && (
                <div className="q-protip-block">
                  <div className="q-protip-label">💡 PRO TIP</div>
                  <div className="q-protip-text">{activeQuestionModal.proTip}</div>
                </div>
              )}
            </div>

            <div className="q-modal-footer">
              <button
                className="btn-nav-modal"
                onClick={handlePrevQuestion}
                disabled={activeQuestionIndex === 0}
              >
                ← Previous
              </button>
              <button
                className="btn-nav-modal"
                onClick={handleNextQuestion}
                disabled={activeQuestionIndex === activeQuestionList.length - 1}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ATS RISK FIX MODAL */}
      {activeRiskModal && (
        <div className="q-modal-overlay" onClick={() => setActiveRiskModal(null)}>
          <div className="q-modal-card" style={{ maxWidth: "540px" }} onClick={(e) => e.stopPropagation()}>
            <div className="q-modal-header">
              <div className="q-modal-badges">
                <span className="badge-topic" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                  ⚠️ ATS Risk Fix
                </span>
                <span className={activeRiskModal.severity === "HIGH" ? "badge-diff-hard" : activeRiskModal.severity === "LOW" ? "badge-diff-easy" : "badge-diff-medium"}>
                  {activeRiskModal.severity || "MEDIUM"} SEVERITY
                </span>
              </div>

              <button className="modal-close-btn" onClick={() => setActiveRiskModal(null)}>
                ✕
              </button>
            </div>

            <div className="q-modal-body">
              <div>
                <div className="q-block-label" style={{ marginBottom: "6px" }}>IDENTIFIED ATS ISSUE</div>
                <h3 className="q-modal-section-title" style={{ fontSize: "1.3rem" }}>{activeRiskModal.issue}</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.93rem", lineHeight: "1.6", marginTop: "8px" }}>
                  {activeRiskModal.description}
                </p>
              </div>

              <div className="q-section-block" style={{ background: "rgba(163, 230, 53, 0.08)", border: "1px solid rgba(163, 230, 53, 0.25)", borderRadius: "14px", padding: "18px" }}>
                <div className="q-block-label" style={{ color: "#a3e635", marginBottom: "6px" }}>💡 RECOMMENDED ACTIONABLE FIX</div>
                <div style={{ color: "#ffffff", fontSize: "0.96rem", lineHeight: "1.65", fontWeight: "600" }}>
                  {activeRiskModal.fixRecommendation}
                </div>
              </div>

              <div className="q-section-block">
                <div className="q-block-label">STEPS TO APPLY THIS FIX</div>
                <ul style={{ color: "#cbd5e1", fontSize: "0.88rem", lineHeight: "1.6", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <li>Open your resume source document (Word/Google Docs/LaTeX).</li>
                  <li>Locate the relevant section containing the flagged issue.</li>
                  <li>Apply the recommended text adjustment to maintain standard ATS parsing readability.</li>
                  <li>Export a new clean PDF and click <strong>Re-analyze Resume</strong> below to rescan!</li>
                </ul>
              </div>
            </div>

            <div className="q-modal-footer">
              <button className="btn-modal-done" style={{ width: "100%" }} onClick={() => setActiveRiskModal(null)}>
                Got It, I'll Fix This ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF GENERATION LOADING MODAL */}
      {downloading && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <PdfLoadingCard />
        </div>
      )}

      {/* CUTE AI TOKEN LIMIT MODAL */}
      {showRateLimitModal && (
        <div className="modal-overlay" style={{ zIndex: 1200 }}>
          <div className="rate-limit-card">
            <div className="rate-limit-badge">AI TOKEN LIMIT REACHED</div>
            <div className="rate-limit-icon">🤖💤</div>
            <h3 className="rate-limit-title">Gemini AI Needs a Quick Power Nap!</h3>
            <p className="rate-limit-desc">
              {rateLimitMessage ||
                "Google AI free tier request limits have been reached for a moment. Please wait 1 to 2 minutes while Gemini recharges its batteries! ✨"}
            </p>
            <div className="rate-limit-timer-pill">
              <span className="timer-icon">⏳</span>
              <span>Resetting in ~60 seconds...</span>
            </div>
            <button
              className="btn-modal-submit"
              style={{ marginTop: "1.2rem", width: "100%" }}
              onClick={() => setShowRateLimitModal(false)}
            >
              Got It! I'll Try Again Soon ☕
            </button>
          </div>
        </div>
      )}

      {/* CUTE MINIMAL FOOTER */}
      <footer className="home-footer">
        <div className="footer-inner-cute">
          <Logo />
          <span className="footer-dot">•</span>
          <p className="footer-copyright">
            © 2026 AI Placement Copilot. Built with ❤️ for students, graduates, and professionals.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ReportPage;
