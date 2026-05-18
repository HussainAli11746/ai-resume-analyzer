import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../features/hooks/useAuth";

export const Navbar = () => {
  const location = useLocation();
  const { user, handleLogout } = useAuth();
  const isLoginPage = location.pathname === "/login";

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
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
              onClick={handleLogout}
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
  );
};

export default Navbar;
