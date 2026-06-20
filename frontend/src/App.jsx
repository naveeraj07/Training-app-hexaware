import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import PlaceholderView from "./components/PlaceholderView";
import Schedule from "./pages/Schedule";
import Progress from "./pages/Progress";
import "./styles/index.css";

export default function App() {
  const [user, setUser] = useState({
    fullName: "Name",
    email: "h.tech@email.com",
    avatar: ""
  });

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out? This will reset the dashboard parameters.")) {
      // Just refresh/reload state for now
      window.location.reload();
    }
  };

  return (
    <Router>
      <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
        {/* Left Navigation Sidebar */}
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Right Content Injection Area */}
        <main className="main-content">
          <Routes>
            {/* Redirect root to progress or home */}
            <Route path="/" element={
              <PlaceholderView
                title="Hexaware Portal"
                subtitle="Welcome to your learning cockpit"
                headerIcon={
                  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                }
                placeholderTitle="Home Dashboard"
                placeholderDesc="This module is currently being integrated. Please visit the Schedule and Progress pages to review your training data!"
              />
            } />

            <Route path="/course" element={
              <PlaceholderView
                title="Hexaware Course"
                subtitle="Access your lessons, tutorials, and training assignments"
                headerIcon={
                  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                }
                placeholderTitle="Course Explorer"
                placeholderDesc="The Course Explorer module is under active development. You will soon be able to view and manage your assigned training modules here."
              />
            } />

            <Route path="/schedule" element={<Schedule />} />
            <Route path="/progress" element={<Progress />} />

            <Route path="/notes" element={
              <PlaceholderView
                title="Study Notes"
                subtitle="Write, edit, and keep track of your training notes"
                headerIcon={
                  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                }
                placeholderTitle="Study Notes Hub"
                placeholderDesc="Study Notes page is currently being upgraded to React. You can look forward to note taking, colored cards, and grid filters very soon!"
              />
            } />

            <Route path="/profile" element={
              <PlaceholderView
                title="Student Profile"
                subtitle="Manage your personal details, credentials, and settings"
                headerIcon={
                  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                }
                placeholderTitle="Student Settings"
                placeholderDesc="The Profile settings screen is currently being integrated into React. Soon you will be able to edit details, upload avatars, and toggle dark mode."
              />
            } />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
