import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import LoadingPage from "./loading";
import "./auth.css";

const Login = () => {
    const { handleLogin, loading } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            await handleLogin(formData.email, formData.password);
            navigate("/");
        } catch (err) {
            console.error("Login failed:", err);
            setErrorMsg(err.response?.data?.error || err.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    if (loading) {
        return <LoadingPage mode="login" />;
    }

    return (
        <>
            <Navbar />

            <main className="auth-page-container">
                <div className="auth-back-row">
                    <button className="auth-back-btn" onClick={() => navigate("/")}>
                        <span className="auth-back-arrow">&#8592;</span>
                        Back to Home
                    </button>
                </div>
                <div className="auth-card">
                    <h1 className="auth-title">Sign In</h1>
                    <p className="auth-subtitle">
                        New user?
                        <Link to="/register" className="auth-redirect-link">
                            Create an account
                        </Link>
                    </p>

                    {errorMsg && (
                        <div style={{ background: "rgba(220, 53, 69, 0.15)", border: "1px solid #dc3545", color: "#ff6b6b", padding: "10px 14px", borderRadius: "8px", fontSize: "0.88rem", marginBottom: "16px" }}>
                            {errorMsg}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
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
                                    placeholder="Enter your password here"
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

                        <button type="submit" className="btn-primary-auth" style={{ marginTop: "10px" }} disabled={loading}>
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
};

export default Login;