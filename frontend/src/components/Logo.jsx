import React from "react";

export const Logo = () => {
  return (
    <div className="logo-brand-wrapper">
      {/* Premium AI placement Copilot Icon Mark */}
      <div className="logo-icon-container">
        <svg
          width="34"
          height="34"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Glow Squircle */}
          <rect
            x="2"
            y="2"
            width="32"
            height="32"
            rx="10"
            fill="url(#logo_bg_grad)"
            stroke="url(#logo_border_grad)"
            strokeWidth="1.5"
          />
          {/* Futuristic AI Placement Mesh / Target Node */}
          <circle cx="18" cy="18" r="11" stroke="url(#logo_accent_grad)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <path
            d="M18 7V11M18 25V29M7 18H11M25 18H29"
            stroke="url(#logo_accent_grad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
          {/* Center Glowing Sparkle */}
          <path
            d="M18 10L19.8 16.2L26 18L19.8 19.8L18 26L16.2 19.8L10 18L16.2 16.2L18 10Z"
            fill="url(#logo_accent_grad)"
          />
          {/* Satellite Node Points */}
          <circle cx="26" cy="10" r="1.8" fill="#a3e635" />
          <circle cx="10" cy="26" r="1.5" fill="#84cc16" />

          <defs>
            <linearGradient id="logo_bg_grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#181c20" />
              <stop offset="1" stopColor="#0c0e12" />
            </linearGradient>
            <linearGradient id="logo_border_grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a3e635" stopOpacity="0.8" />
              <stop offset="1" stopColor="#4d7c0f" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="logo_accent_grad" x1="10" y1="10" x2="26" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#b5f542" />
              <stop offset="1" stopColor="#84cc16" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Vertical Separator | */}
      <div className="logo-divider-line"></div>

      {/* Two Stacked Text Lines */}
      <div className="logo-text-block">
        <span className="logo-text-main">AI Placement</span>
        <span className="logo-text-sub">Copilot</span>
      </div>
    </div>
  );
};

export default Logo;
