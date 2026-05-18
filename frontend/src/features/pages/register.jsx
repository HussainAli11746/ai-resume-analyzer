import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import LoadingPage from "./loading";
import "./auth.css";

const Register = () => {
  const { handleRegister, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await handleRegister(formData.username, formData.email, formData.password);
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
      setErrorMsg(err.response?.data?.error || err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  if (loading) {
    return <LoadingPage mode="register" />;
  }

  return (
    <>
      <Navbar />

      <main className="auth-page-container">
        <div className="auth-card">
          <h1 className="auth-title">Sign Up</h1>
          <p className="auth-subtitle">
            Already have an account?
            <Link to="/login" className="auth-redirect-link">
              Sign In
            </Link>
          </p>

          {errorMsg && (
            <div style={{ background: "rgba(220, 53, 69, 0.15)", border: "1px solid #dc3545", color: "#ff6b6b", padding: "10px 14px", borderRadius: "8px", fontSize: "0.88rem", marginBottom: "16px" }}>
              {errorMsg}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                placeholder="Enter your username here"
                value={formData.username}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter your email here"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="agreement-checkbox-row">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                className="agreement-checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeToTerms" style={{ cursor: "pointer" }}>
                I agree to receive communications from AI Placement Copilot via WhatsApp, SMS, email, and phone calls, even if registered under DND/NDNC.
              </label>
            </div>

            <button type="submit" className="btn-primary-auth" disabled={loading}>
              {loading ? "Registering..." : "Register Now"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;