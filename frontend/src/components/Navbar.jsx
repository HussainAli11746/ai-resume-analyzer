import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../features/hooks/useAuth";

export const Navbar = () => {
  const location = useLocation();
  const { user, handleLogout } = useAuth();
  const isLoginPage = location.pathname === "/login";
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmLogout = () => {
    setShowConfirm(false);
    handleLogout();
  };

  return (
    <>
      <header className="navbar-header">
        <div className="navbar-logo-container">
          <Link to="/" onClick={handleLogoClick} style={{ textDecoration: "none" }}>
            <Logo />
          </Link>
        </div>

        <nav className="navbar-center-pill">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#faq" className="nav-link">FAQ</a>
        </nav>

        <div className="navbar-right">
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ color: "#a3e635", fontSize: "0.88rem", fontWeight: "600" }}>
                {user.username || user.email}
              </span>
              <button
                onClick={() => setShowConfirm(true)}
                className="nav-action-link"
                style={{ background: "transparent", cursor: "pointer" }}
              >
                Logout
              </button>
            </div>
          ) : isLoginPage ? (
            <Link to="/register" className="btn-navbar-primary">
              Sign Up Free
            </Link>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Link to="/login" className="nav-link" style={{ fontWeight: "500" }}>
                Sign In
              </Link>
              <Link to="/login" className="btn-navbar-primary">
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div
          onClick={() => setShowConfirm(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#161b22",
              border: "1px solid rgba(163,230,53,0.2)",
              borderRadius: "16px",
              padding: "32px 36px",
              width: "100%",
              maxWidth: "380px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}><LogOut size={36} style={{ color: "#a3e635" }} /></div>
            <h2 style={{ color: "#f0f6fc", fontSize: "1.25rem", fontWeight: "700", marginBottom: "8px" }}>
              Log out?
            </h2>
            <p style={{ color: "#8b949e", fontSize: "0.9rem", marginBottom: "28px" }}>
              Are you sure you want to log out of your account?
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1, padding: "10px 0",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: "#c9d1d9", fontSize: "0.95rem", fontWeight: "600",
                  cursor: "pointer", transition: "background 0.2s",
                }}
                onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.06)"}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  flex: 1, padding: "10px 0",
                  background: "linear-gradient(135deg, #a3e635, #65a30d)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#0a0a0a", fontSize: "0.95rem", fontWeight: "700",
                  cursor: "pointer", transition: "opacity 0.2s",
                }}
                onMouseEnter={e => e.target.style.opacity = "0.85"}
                onMouseLeave={e => e.target.style.opacity = "1"}
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
