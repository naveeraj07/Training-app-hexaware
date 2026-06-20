import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { certificateData, learningInsights, assessmentResults } from "../data/progressData";

export default function Progress() {
  const navigate = useNavigate();

  return (
    <div className="view-section">
      {/* Blue Banner Header */}
      <Header
        title="Your Progress"
        subtitle="Track your progress"
        icon={
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        }
      >
        <button className="btn-white" onClick={() => navigate("/notes")}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
          </svg>
          New Note
        </button>
      </Header>

      {/* Two Column Layout: Certificate & Insights */}
      <div className="two-column-layout">
        
        {/* Course Certificate Card */}
        <div className="dashboard-card">
          <div className="card-header-with-icon">
            <div className="card-header-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div className="card-header-info">
              <h2>Course Certificate</h2>
              <p>Complete all modules to unlock</p>
            </div>
          </div>

          <div className="progress-status-container">
            <div className="progress-header-row">
              <span className="title">Requirements Progress</span>
              <span className="percentage">{certificateData.requirementsPercent}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${certificateData.requirementsPercent}%` }}></div>
            </div>
            
            <div className="checklist-container">
              {certificateData.checklist.map(item => (
                <div key={item.id} className={`checklist-item ${item.completed ? "checked" : "unchecked"}`}>
                  <div className="check-icon-slot">
                    {item.completed ? (
                      <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                    )}
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-gray-locked" disabled>
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Certificate Locked
          </button>
        </div>

        {/* Learning Insights Card */}
        <div className="dashboard-card">
          <div className="card-header-with-icon">
            <div className="card-header-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="card-header-info">
              <h2>Learning Insights</h2>
            </div>
          </div>

          <div className="insights-list">
            {learningInsights.map(insight => (
              <div key={insight.id} className="insight-pill">
                <span className="title">{insight.title}</span>
                <span className="subtitle">{insight.subtitle}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Assessment Results Section */}
      <div className="assessment-card">
        <h2>Assessment Results</h2>
        <div className="assessment-list">
          {assessmentResults.map(test => {
            const isPassed = test.status === "Passed";
            const scoreText = isPassed ? `Score: ${test.score}/${test.total}` : "Not yet taken";
            const badgeClass = isPassed ? "passed" : "upcoming";
            
            return (
              <div key={test.id} className="assessment-item">
                <div className="assessment-info">
                  <span className="assessment-name">{test.name}</span>
                  <span className="assessment-score">{scoreText}</span>
                </div>
                <div className="assessment-progress-wrapper">
                  <div className="assessment-progress-bar-bg">
                    <div className="assessment-progress-bar-fill" style={{ width: `${test.percent}%` }}></div>
                  </div>
                </div>
                <span className={`assessment-badge ${badgeClass}`}>{test.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
