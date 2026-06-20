import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">Hexaware</div>
        
        {/* User Profile Badge */}
        <div className="user-badge">
          <span className="name" id="sidebar-name">{user.fullName || "Name"}</span>
          <span className="email" id="sidebar-email">{user.email || "h.tech@email.com"}</span>
        </div>
        
        {/* Menu Links */}
        <nav className="nav-links">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Home
          </NavLink>
          
          <NavLink 
            to="/course" 
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            Course
          </NavLink>
          
          <NavLink 
            to="/schedule" 
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Schedule
          </NavLink>
          
          <NavLink 
            to="/progress" 
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Progress
          </NavLink>
          
          <NavLink 
            to="/notes" 
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Notes
          </NavLink>
          
          <NavLink 
            to="/profile" 
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Profile
          </NavLink>
        </nav>
      </div>
      
      <div className="sidebar-bottom">
        <button className="logout-btn" onClick={onLogout}>
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
