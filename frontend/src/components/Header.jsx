import React from "react";

export default function Header({ title, subtitle, icon, children }) {
  return (
    <div className="banner-card">
      <div className="banner-left">
        <div className="banner-icon-container">
          {icon}
        </div>
        <div className="banner-text">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      {children && (
        <div className="banner-right">
          {children}
        </div>
      )}
    </div>
  );
}
