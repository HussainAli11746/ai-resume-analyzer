import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Zap, FileText, ShieldCheck } from "lucide-react";
import "./auth.css";

export const AiLoadingCard = () => {
  const [progress, setProgress] = useState(14);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) return 94;
        const step = Math.floor(Math.random() * 4) + 3;
        return Math.min(prev + step, 94);
      });
    }, 550);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-card" style={{ maxWidth: "480px" }}>
      {/* Animated Spinner Ring */}
      <div className="animated-ring-wrapper">
        <div className="animated-ring"></div>
      </div>

      {/* Titles */}
      <h2 className="loading-title">Analyzing Your Resume</h2>
      <p className="loading-subtitle">
        Gemini AI is scanning your experience, skills & generating interview prep...
      </p>

      {/* Progress Bar with Percentage */}
      <div className="ai-progress-bar-container">
        <div className="ai-progress-header">
          <span className="ai-progress-label">Analysis Progress</span>
          <span className="ai-progress-percent">{progress}%</span>
        </div>
        <div className="ai-progress-track">
          <div className="ai-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="loading-steps-list">
        <div className={`loading-step ${progress >= 20 ? "item-done" : "item-active"}`}>
          <span className={`step-icon ${progress >= 20 ? "done-icon" : "active-icon"}`}>
            {progress >= 20 ? "✓" : "●"}
          </span>
          <span className={`step-text ${progress >= 20 ? "" : "active-text"}`}>
            Parsing resume structure & extracting text
          </span>
        </div>

        <div className={`loading-step ${progress >= 45 ? "item-done" : progress >= 20 ? "item-active" : "item-pending"}`}>
          <span className={`step-icon ${progress >= 45 ? "done-icon" : progress >= 20 ? "active-icon" : "pending-icon"}`}>
            {progress >= 45 ? "✓" : progress >= 20 ? "●" : "○"}
          </span>
          <span className={`step-text ${progress >= 45 ? "" : progress >= 20 ? "active-text" : "pending-text"}`}>
            Matching resume keywords with target job description
          </span>
        </div>

        <div className={`loading-step ${progress >= 70 ? "item-done" : progress >= 45 ? "item-active" : "item-pending"}`}>
          <span className={`step-icon ${progress >= 70 ? "done-icon" : progress >= 45 ? "active-icon" : "pending-icon"}`}>
            {progress >= 70 ? "✓" : progress >= 45 ? "●" : "○"}
          </span>
          <span className={`step-text ${progress >= 70 ? "" : progress >= 45 ? "active-text" : "pending-text"}`}>
            Calculating section scores & ATS compatibility
          </span>
        </div>

        <div className={`loading-step ${progress >= 90 ? "item-done" : progress >= 70 ? "item-active" : "item-pending"}`}>
          <span className={`step-icon ${progress >= 90 ? "done-icon" : progress >= 70 ? "active-icon" : "pending-icon"}`}>
            {progress >= 90 ? "✓" : progress >= 70 ? "●" : "○"}
          </span>
          <span className={`step-text ${progress >= 90 ? "" : progress >= 70 ? "active-text" : "pending-text"}`}>
            Generating Technical, Behavioral & HR questions
          </span>
        </div>

        <div className={`loading-step ${progress >= 92 ? "item-active" : "item-pending"}`}>
          <span className={`step-icon ${progress >= 92 ? "active-icon" : "pending-icon"}`}>
            {progress >= 92 ? "●" : "○"}
          </span>
          <span className={`step-text ${progress >= 92 ? "active-text" : "pending-text"}`}>
            Finalizing your ATS report dashboard
          </span>
        </div>
      </div>

      {/* Divider Line */}
      <div className="loading-divider"></div>

      {/* Security Footer */}
      <div className="loading-footer">
        <span className="lock-icon"><Zap size={16} /></span>
        <span>Powered by Google Gemini AI 3.6 Flash</span>
      </div>
    </div>
  );
};

export const PdfLoadingCard = () => {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) return 94;
        const step = Math.floor(Math.random() * 5) + 4;
        return Math.min(prev + step, 94);
      });
    }, 450);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-card" style={{ maxWidth: "480px" }}>
      {/* Animated Spinner Ring */}
      <div className="animated-ring-wrapper">
        <div className="animated-ring"></div>
      </div>

      {/* Titles */}
      <h2 className="loading-title">Generating Tailored PDF Resume</h2>
      <p className="loading-subtitle">
        Gemini AI is tailoring your resume content and Puppeteer is rendering an ATS-friendly A4 single-page PDF...
      </p>

      {/* Progress Bar with Percentage */}
      <div className="ai-progress-bar-container">
        <div className="ai-progress-header">
          <span className="ai-progress-label">PDF Generation Progress</span>
          <span className="ai-progress-percent">{progress}%</span>
        </div>
        <div className="ai-progress-track">
          <div className="ai-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="loading-steps-list">
        <div className={`loading-step ${progress >= 25 ? "item-done" : "item-active"}`}>
          <span className={`step-icon ${progress >= 25 ? "done-icon" : "active-icon"}`}>
            {progress >= 25 ? "✓" : "●"}
          </span>
          <span className={`step-text ${progress >= 25 ? "" : "active-text"}`}>
            Incorporating target keywords & achievements
          </span>
        </div>

        <div className={`loading-step ${progress >= 55 ? "item-done" : progress >= 25 ? "item-active" : "item-pending"}`}>
          <span className={`step-icon ${progress >= 55 ? "done-icon" : progress >= 25 ? "active-icon" : "pending-icon"}`}>
            {progress >= 55 ? "✓" : progress >= 25 ? "●" : "○"}
          </span>
          <span className={`step-text ${progress >= 55 ? "" : progress >= 25 ? "active-text" : "pending-text"}`}>
            Formatting strict single-page monochrome HTML layout
          </span>
        </div>

        <div className={`loading-step ${progress >= 80 ? "item-done" : progress >= 55 ? "item-active" : "item-pending"}`}>
          <span className={`step-icon ${progress >= 80 ? "done-icon" : progress >= 55 ? "active-icon" : "pending-icon"}`}>
            {progress >= 80 ? "✓" : progress >= 55 ? "●" : "○"}
          </span>
          <span className={`step-text ${progress >= 80 ? "" : progress >= 55 ? "active-text" : "pending-text"}`}>
            Rendering high-resolution A4 document via Puppeteer
          </span>
        </div>

        <div className={`loading-step ${progress >= 94 ? "item-active" : "item-pending"}`}>
          <span className={`step-icon ${progress >= 94 ? "active-icon" : "pending-icon"}`}>
            {progress >= 94 ? "●" : "○"}
          </span>
          <span className={`step-text ${progress >= 94 ? "active-text" : "pending-text"}`}>
            Preparing your download...
          </span>
        </div>
      </div>

      {/* Divider Line */}
      <div className="loading-divider"></div>

      {/* Footer */}
      <div className="loading-footer">
        <span className="lock-icon"><FileText size={16} /></span>
        <span>Single-Page ATS Print Ready PDF</span>
      </div>
    </div>
  );
};

const LoadingPage = ({ mode = "login" }) => {
  const isRegister = mode === "register";
  const isAi = mode === "ai";

  return (
    <>
      <Navbar />

      <main className="auth-page-container">
        {isAi ? (
          <AiLoadingCard />
        ) : (
          <div className="loading-card">
            {/* Animated Spinner Ring */}
            <div className="animated-ring-wrapper">
              <div className="animated-ring"></div>
            </div>

            {/* Titles */}
            <h2 className="loading-title">
              {isRegister ? "Creating Your Account" : "Signing You In..."}
            </h2>
            <p className="loading-subtitle">
              {isRegister
                ? "Setting up your account securely..."
                : "Please wait while we verify your credentials."}
            </p>

            {/* Checklist Items */}
            <div className="loading-steps-list">
              {isRegister ? (
                <>
                  <div className="loading-step item-done">
                    <span className="step-icon done-icon">✓</span>
                    <span className="step-text">Validating your information</span>
                  </div>
                  <div className="loading-step item-done">
                    <span className="step-icon done-icon">✓</span>
                    <span className="step-text">Encrypting your password</span>
                  </div>
                  <div className="loading-step item-active">
                    <span className="step-icon active-icon">●</span>
                    <span className="step-text active-text">Creating your profile</span>
                  </div>
                  <div className="loading-step item-pending">
                    <span className="step-icon pending-icon">○</span>
                    <span className="step-text pending-text">Preparing your dashboard</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="loading-step item-done">
                    <span className="step-icon done-icon">✓</span>
                    <span className="step-text">Verifying email</span>
                  </div>
                  <div className="loading-step item-done">
                    <span className="step-icon done-icon">✓</span>
                    <span className="step-text">Validating password</span>
                  </div>
                  <div className="loading-step item-active">
                    <span className="step-icon active-icon">●</span>
                    <span className="step-text active-text">Creating secure session</span>
                  </div>
                </>
              )}
            </div>

            {/* Divider Line */}
            <div className="loading-divider"></div>

            {/* Security Footer */}
            <div className="loading-footer">
              <span className="lock-icon"><ShieldCheck size={16} /></span>
              <span>
                {isRegister
                  ? "Your account is protected with secure encryption."
                  : "Your data is encrypted"}
              </span>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default LoadingPage;
