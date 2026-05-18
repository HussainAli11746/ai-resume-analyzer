import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Logo from "../../components/Logo";
import { useAuth } from "../hooks/useAuth";
import { useInterview } from "../hooks/useInterview";
import { AiLoadingCard } from "./loading";
import "./home.css";

const Home = () => {
  const { user } = useAuth();
  const { generateReport, getAllReports, reports, loading: isGenerating } = useInterview();
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecentReportsModalOpen, setIsRecentReportsModalOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [generatedReport, setGeneratedReport] = useState(null);
  const [previousReport, setPreviousReport] = useState(null);
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState("");

  React.useEffect(() => {
    if (user) {
      getAllReports()
        .then((data) => {
          if (data && data.interviewReports && data.interviewReports.length > 0) {
            setPreviousReport(data.interviewReports[0]);
          }
        })
        .catch((err) => console.log("Fetch reports error:", err));
    }
  }, [user]);

  const formatReportDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0 && now.getDate() === date.getDate()) return "Today";
    if (diffDays <= 1) return "Yesterday";

    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setSelectedFile({
      raw: file,
      name: file.name,
      size: `${sizeInMB} MB`,
    });
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleHeroAnalyzeClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (selectedFile) {
      setIsModalOpen(true);
    } else {
      document.getElementById("resume-upload-input")?.click();
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!jobDescription.trim()) {
      setSubmitError("Please enter a target job description.");
      return;
    }

    try {
      const data = await generateReport({
        resume: selectedFile.raw,
        jobDescription: jobDescription.trim(),
        selfDescription: selfDescription.trim(),
      });

      setGeneratedReport(data.interviewReport);
      setIsModalOpen(false);
      if (data && data.interviewReport && data.interviewReport._id) {
        navigate(`/report/${data.interviewReport._id}`);
      }
    } catch (err) {
      console.error("Failed to generate report:", err);
      const isRate =
        err.response?.status === 429 ||
        err.response?.data?.isRateLimit ||
        String(err.message || "").includes("429") ||
        String(err.response?.data?.message || "").includes("Limit") ||
        String(err.response?.data?.message || "").includes("quota");

      if (isRate) {
        setIsModalOpen(false);
        setRateLimitMessage(
          "Google AI free-tier request limit reached for a moment. Please wait 1 to 2 minutes while Gemini recharges its batteries! ✨"
        );
        setShowRateLimitModal(true);
      } else {
        setSubmitError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to generate report. Please try again."
        );
      }
    }
  };

  const faqData = [
    {
      q: "How accurate is the ATS score?",
      a: "Our scoring system evaluates resume formatting, readability, keyword relevance, section structure, and alignment with the provided job description. While no ATS is identical, the report follows widely accepted ATS best practices.",
    },
    {
      q: "Which file formats are supported?",
      a: "You can upload PDF and DOCX resumes. Plain text resumes are also supported for analysis.",
    },
    {
      q: "Is my resume stored?",
      a: "Your uploaded files are processed securely. You remain in control of your data, and you can delete your reports whenever you choose.",
    },
    {
      q: "Why should I add a job description?",
      a: "Adding the target job description allows the AI to compare your resume with employer expectations and identify missing keywords and required skills.",
    },
    {
      q: "What is the self-description used for?",
      a: "Your self-description provides additional context such as career goals, extracurricular activities, certifications, or achievements that may not appear in your resume, enabling more personalized recommendations.",
    },
    {
      q: "Will I receive an improved resume?",
      a: "Yes. Along with detailed feedback, you'll receive an ATS-friendly optimized PDF incorporating AI suggestions to improve readability and recruiter compatibility.",
    },
    {
      q: "Can I analyze multiple resumes?",
      a: "Absolutely. Upload different resumes for different job roles and compare their ATS performance separately.",
    },
    {
      q: "Does the platform generate interview questions?",
      a: "Yes. Based on your resume and target job description, the AI creates personalized technical, behavioral, and HR interview questions to help you prepare.",
    },
  ];

  return (
    <div className="home-container">
      <Navbar />

      <div className="home-bg-glow"></div>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-grid">
          {/* LEFT COLUMN */}
          <div className="hero-left">
            <div className="hero-badge">
              ⚡ AI-Powered • ATS Optimized
            </div>

            <h1 className="hero-heading">
              Your Resume, <br />
              <span className="hero-heading-lime">Analyzed</span> in Seconds.
            </h1>

            <p className="hero-subheading">
              Upload your resume, paste a job description, and tell us about yourself. Get an AI-powered ATS report with keyword analysis, section scores, resume improvements, interview insights, and a professionally optimized PDF.
            </p>

            <div className="hero-actions">
              <button className="btn-hero-primary" onClick={handleHeroAnalyzeClick}>
                Analyze My Resume →
              </button>
            </div>

            <div className="hero-trust-stats">
              <div className="hero-stat-item">
                <div className="hero-stat-title">⚡ Under 10 Seconds</div>
                <div className="hero-stat-desc">Average analysis time</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-title">🎯 ATS Optimized</div>
                <div className="hero-stat-desc">Built for modern hiring systems</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-title">🔒 Privacy First</div>
                <div className="hero-stat-desc">Your files stay secure</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="hero-right">
            <div className="upload-card-wrapper">
              <input
                type="file"
                id="resume-upload-input"
                style={{ display: "none" }}
                accept=".pdf,.docx,.txt"
                onChange={handleInputChange}
              />

              {selectedFile ? (
                /* FILE UPLOADED STATE */
                <div className="file-uploaded-container">
                  <div className="file-icon-badge-wrapper">
                    <div className="file-icon-square">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <line x1="10" y1="9" x2="8" y2="9" />
                      </svg>
                    </div>
                    <div className="file-check-badge">✓</div>
                  </div>

                  <div className="file-name-text">{selectedFile.name}</div>
                  <div className="file-info-subtext">{selectedFile.size} • Ready to scan</div>

                  {user ? (
                    <button className="btn-scan-action" onClick={() => setIsModalOpen(true)}>
                      ⚡ Analyze Resume Now →
                    </button>
                  ) : (
                    <button className="btn-scan-action" onClick={() => navigate("/login")}>
                      🛡️ Login to Scan
                    </button>
                  )}

                  <button className="btn-remove-file" onClick={() => setSelectedFile(null)}>
                    Remove File
                  </button>
                </div>
              ) : (
                /* INITIAL DRAG & DROP ZONE */
                <div
                  className="upload-dropzone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("resume-upload-input")?.click()}
                >
                  <div className="upload-pdf-icon-graphic">
                    <span className="sparkle-badge">✨</span>
                    <span className="pdf-label-badge">PDF</span>
                  </div>
                  <h3 className="dropzone-title">Drag & drop your resume here</h3>
                  <p className="dropzone-sub">or click to browse</p>
                  <button className="btn-browse" type="button">
                    <span>↑</span> Upload Resume
                  </button>
                  <div className="dropzone-supported-formats">Supported formats: PDF, DOCX • Max 10MB</div>

                  <button
                    type="button"
                    className="btn-view-past-report"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        navigate("/login");
                      } else {
                        if (!reports || reports.length === 0) {
                          getAllReports();
                        }
                        setIsRecentReportsModalOpen(true);
                      }
                    }}
                  >
                    → View previous reports
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* GENERATED REPORT MODAL / RESULTS NOTIFICATION */}
      {generatedReport && (
        <section className="cta-banner-section" style={{ marginTop: "20px", marginBottom: "40px" }}>
          <div className="cta-banner-card" style={{ borderColor: "#a3e635" }}>
            <div className="hero-badge" style={{ background: "rgba(163, 230, 53, 0.15)" }}>
              🎉 Report Generated Successfully!
            </div>
            <h2 className="cta-title">
              ATS Match Score: <span style={{ color: "#a3e635" }}>{generatedReport.atsScore || generatedReport.matchScore || "85"}%</span>
            </h2>
            <p className="cta-sub">
              Your resume analysis and AI interview preparation questions are ready.
            </p>

            <button
              className="btn-hero-primary"
              onClick={() => {
                if (generatedReport && generatedReport._id) {
                  navigate(`/report/${generatedReport._id}`);
                }
              }}
            >
              View Full Report Details →
            </button>
          </div>
        </section>
      )}

      {/* JOB & SELF DESCRIPTION INPUT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !isGenerating && setIsModalOpen(false)}>
          {isGenerating ? (
            <div onClick={(e) => e.stopPropagation()}>
              <AiLoadingCard />
            </div>
          ) : (
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3 className="modal-title">Target Job Details</h3>
                  <p className="modal-subtitle">
                    Paste the job description to calculate your ATS match score & generate interview questions.
                  </p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => !isGenerating && setIsModalOpen(false)}
                  disabled={isGenerating}
                >
                  ✕
                </button>
              </div>

              {selectedFile && (
                <div className="modal-file-pill">
                  <span>📄 {selectedFile.name}</span>
                  <span>({selectedFile.size})</span>
                </div>
              )}

              {submitError && (
                <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", color: "#fca5a5", padding: "10px 14px", borderRadius: "8px", fontSize: "0.88rem", marginBottom: "16px" }}>
                  {submitError}
                </div>
              )}

              <form className="modal-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    Job Description <span style={{ color: "#a3e635" }}>*</span>
                  </label>
                  <textarea
                    className="form-input"
                    rows="6"
                    placeholder="Paste the target job description here (responsibilities, required skills, qualifications)..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                    disabled={isGenerating}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Self Description / Achievements <span style={{ color: "#64748b" }}>(Optional)</span>
                  </label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Key highlights, portfolio links, projects, certifications or context you want the AI to consider..."
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                    disabled={isGenerating}
                  ></textarea>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isGenerating}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-submit" disabled={isGenerating}>
                    {isGenerating ? "Analyzing Resume..." : "⚡ Generate Report"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* RECENT REPORTS LIST MODAL */}
      {isRecentReportsModalOpen && (
        <div className="modal-overlay" onClick={() => setIsRecentReportsModalOpen(false)}>
          <div className="modal-card recent-reports-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">📄 Recent Reports</h3>
                <p className="modal-subtitle">
                  Select a report to view your ATS breakdown & interview preparation. (Max 5 saved)
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsRecentReportsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="recent-reports-list">
              {reports && reports.length > 0 ? (
                reports.slice(0, 5).map((reportItem, idx) => {
                  const score = reportItem.matchScore || reportItem.atsScore || 85;
                  const title = reportItem.title
                    ? `${reportItem.title} Resume`
                    : reportItem.candidateName
                    ? `${reportItem.candidateName}'s Resume`
                    : "ATS Analyzed Resume";
                  const dateLabel = formatReportDate(reportItem.createdAt);

                  return (
                    <div
                      key={reportItem._id || idx}
                      className="recent-report-card"
                      onClick={() => navigate(`/report/${reportItem._id}`)}
                    >
                      <div className="recent-report-left">
                        <div className="recent-report-title">{title}</div>
                        <div className="recent-report-meta">
                          <span
                            className={`recent-score-pill ${
                              score >= 80 ? "score-high" : score >= 65 ? "score-med" : "score-low"
                            }`}
                          >
                            {score} ATS
                          </span>
                          <span className="recent-report-date">{dateLabel}</span>
                        </div>
                      </div>

                      <div className="recent-report-arrow-btn">
                        <span className="recent-arrow-icon">→</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="recent-reports-empty">
                  <p>No recent reports found. Upload a resume to generate your first report!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FEATURES SECTION */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2 className="section-title">Everything You Need to Build a Better Resume</h2>
          <p className="section-subtitle">
            From ATS analysis to an optimized resume and interview preparation—all powered by AI.
          </p>
        </div>

        <div className="features-marquee-wrapper">
          <div className="features-marquee-track">
            {/* FIRST SET */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">🎯</div>
              <h3 className="feature-title">ATS Score</h3>
              <p className="feature-desc">
                Measure how well your resume performs with Applicant Tracking Systems using detailed section-wise scoring.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">📄</div>
              <h3 className="feature-title">Job Match Analysis</h3>
              <p className="feature-desc">
                Compare your resume against a target job description and discover missing skills, keywords, and requirements.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">💡</div>
              <h3 className="feature-title">AI Recommendations</h3>
              <p className="feature-desc">
                Receive personalized suggestions to improve projects, skills, formatting, and overall resume quality.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">🔑</div>
              <h3 className="feature-title">Keyword Intelligence</h3>
              <p className="feature-desc">
                Identify strong keywords, uncover missing ones, and improve your recruiter match score.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">✨</div>
              <h3 className="feature-title">ATS-Friendly Resume</h3>
              <p className="feature-desc">
                Generate a professionally formatted, ATS-optimized PDF with AI-powered improvements.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">🎤</div>
              <h3 className="feature-title">Interview Preparation</h3>
              <p className="feature-desc">
                Get personalized technical, behavioral, and HR interview questions based on your resume and target role.
              </p>
            </div>

            {/* DUPLICATE CLONE SET FOR SEAMLESS INFINITE LOOP */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">🎯</div>
              <h3 className="feature-title">ATS Score</h3>
              <p className="feature-desc">
                Measure how well your resume performs with Applicant Tracking Systems using detailed section-wise scoring.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">📄</div>
              <h3 className="feature-title">Job Match Analysis</h3>
              <p className="feature-desc">
                Compare your resume against a target job description and discover missing skills, keywords, and requirements.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">💡</div>
              <h3 className="feature-title">AI Recommendations</h3>
              <p className="feature-desc">
                Receive personalized suggestions to improve projects, skills, formatting, and overall resume quality.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">🔑</div>
              <h3 className="feature-title">Keyword Intelligence</h3>
              <p className="feature-desc">
                Identify strong keywords, uncover missing ones, and improve your recruiter match score.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">✨</div>
              <h3 className="feature-title">ATS-Friendly Resume</h3>
              <p className="feature-desc">
                Generate a professionally formatted, ATS-optimized PDF with AI-powered improvements.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">🎤</div>
              <h3 className="feature-title">Interview Preparation</h3>
              <p className="feature-desc">
                Get personalized technical, behavioral, and HR interview questions based on your resume and target role.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Get your comprehensive ATS breakdown and interview prep in 3 simple steps.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">Step 01</span>
            <h3 className="step-title">Upload Resume & Job Description</h3>
            <p className="step-desc">
              Upload your existing resume file (PDF/DOCX) along with the job description you are targeting.
            </p>
          </div>

          <div className="step-card">
            <span className="step-number">Step 02</span>
            <h3 className="step-title">AI Analyzes & Scores Your Resume</h3>
            <p className="step-desc">
              Our AI engine cross-references keywords, structure, readability, and job requirements in seconds.
            </p>
          </div>

          <div className="step-card">
            <span className="step-number">Step 03</span>
            <h3 className="step-title">Get Feedback & Optimized PDF</h3>
            <p className="step-desc">
              Review your ATS match score, interview preparation questions, and download your tailored resume.
            </p>
          </div>
        </div>
      </section>

      {/* PRE-FOOTER CTA BANNER CARD */}
      <section className="cta-banner-section">
        <div className="cta-banner-card">
          <div className="hero-badge" style={{ marginBottom: "16px" }}>
            ⚡ AI-Powered • ATS Optimized
          </div>
          <h2 className="cta-title">Everything You Need to Build a Better Resume</h2>
          <p className="cta-sub">
            Upload your resume, paste a job description, and tell us about yourself. Get an AI-powered ATS report with keyword analysis, section scores, resume improvements, interview insights, and a professionally optimized PDF.
          </p>
          <button className="btn-hero-primary" onClick={handleHeroAnalyzeClick}>
            Analyze My Resume →
          </button>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section" id="faq">
        <div className="section-header">
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>

        <div className="faq-grid-accordion">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${openFaq === index ? "open" : ""}`}
            >
              <button
                className="faq-question-btn"
                onClick={() => toggleFaq(index)}
              >
                <span>{item.q}</span>
                <span className="faq-toggle-icon">+</span>
              </button>
              {openFaq === index && (
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

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

export default Home;
