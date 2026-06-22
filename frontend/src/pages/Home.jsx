import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import Icon from '../components/Icon';

export default function Home() {
  // Real database-driven states mapped to the new dashboard API
  const [profile, setProfile] = useState({ name: "Student" });
  const [stats, setStats] = useState([]);
  const [keepGoing, setKeepGoing] = useState(null);
  const [timeSpent, setTimeSpent] = useState(null);
  const [progress, setProgress] = useState(null);
  
  // Interface view load states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🌟 DYNAMIC SESSION CONFIGURATION: Replaced the static ID with localStorage extraction
  const userId = Number(localStorage.getItem('logged_in_user_id')) || 1;

  useEffect(() => {
    const fetchDashboardTelemetry = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Dispatch requests using the new UI helper methods from dashboardService
        // All of these efficiently resolve from the single GET /dashboard/{user_id} API
        const [
          profileData, 
          statsData, 
          keepGoingData, 
          timeSpentData, 
          progressData
        ] = await Promise.all([
          dashboardService.getUserProfile(userId),
          dashboardService.getOverviewStats(userId),
          dashboardService.getKeepGoingData(userId),
          dashboardService.getTimeSpentData(userId),
          dashboardService.getCourseProgressData(userId)
        ]);

        setProfile(profileData || { name: "Student" });
        setStats(statsData || []);
        setKeepGoing(keepGoingData);
        setTimeSpent(timeSpentData);
        setProgress(progressData);

      } catch (err) {
        console.error("Critical error mapping dashboard metrics:", err);
        setError("Failed to synchronize live dashboard telemetry metrics.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardTelemetry();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="page-view dashboard-container structural-fallback-centered">
        <h3>Loading Dashboard Telemetry...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-view dashboard-container structural-fallback-centered">
        <h3 className="error-headline-text">{error}</h3>
      </div>
    );
  }

  return (
    <div className="page-view dashboard-container">
      
      {/* 1. Blue Header Banner */}
      <div className="dashboard-banner">
        <div className="banner-content">
          <h2 className="banner-greeting">Hii {profile.name}! 👋</h2>
          <span className="banner-subtitle">READY TO LEARN</span>
        </div>
      </div>

      {/* 2. Stats Grid (Dynamic Mapping) */}
      <div className="stats-cards-grid">
        {stats.map(stat => (
          <div key={stat.id} className={`stat-card color-${stat.color}`} id={`stat-${stat.id}`}>
            <div className="stat-icon-wrapper">
              <Icon name={stat.icon} className="stat-icon" />
            </div>
            <span className="stat-title">{stat.title}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* 3. Mid Row (Keep Going & Time Spent Cards) */}
      <div className="dashboard-row-mid">
        
        {/* Keep Going Card */}
        {keepGoing && (
          <div className="keep-going-card">
            <div className="card-badge-pill">
              <Icon name="zap" style={{ width: '12px', height: '12px', fill: '#ffdf40', stroke: '#ffdf40' }} />
              <span>{keepGoing.badge}</span>
            </div>
            
            <div className="keep-going-content">
              <h3 className="keep-going-title">{keepGoing.title}</h3>
              <p className="keep-going-desc">{keepGoing.description}</p>
            </div>
            
            <a href="#course" className="continue-btn">
              <span>{keepGoing.buttonText}</span>
              <Icon name="arrow-right" style={{ width: '16px', height: '16px' }} />
            </a>
          </div>
        )}

        {/* Time Spent Venn Diagram Card */}
        {timeSpent && timeSpent.categories && timeSpent.categories.length >= 3 && (
          <div className="time-spent-card">
            <div className="card-badge-pill time-spent-badge">
              <Icon name="zap" style={{ width: '12px', height: '12px', fill: '#ffdf40', stroke: '#ffdf40' }} />
              <span>{timeSpent.badge}</span>
            </div>
            
            <div className="venn-container">
              {/* Learning Contents Circle */}
              <div className="venn-circle circle-learning">
                <span className="venn-circle-title">{timeSpent.categories[0].title}</span>
                <span className="venn-circle-hours">{timeSpent.categories[0].hours}</span>
                <span className="venn-circle-label">{timeSpent.categories[0].label}</span>
              </div>
              
              {/* Assessment Circle */}
              <div className="venn-circle circle-assessment">
                <span className="venn-circle-hours">{timeSpent.categories[1].hours}</span>
                <span className="venn-circle-label">{timeSpent.categories[1].label}</span>
              </div>
              
              {/* Practice Circle */}
              <div className="venn-circle circle-practice">
                <span className="venn-circle-hours">{timeSpent.categories[2].hours}</span>
                <span className="venn-circle-label">{timeSpent.categories[2].label}</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4. Bottom Row (Course Progress & Line Graph Tracker) */}
      {progress && (
        <div className="course-progress-card">
          <div className="course-progress-header">
            <div className="course-progress-info">
              <div className="course-icon-bg">
                <Icon name="book-open" style={{ width: '20px', height: '20px' }} />
              </div>
              <div className="course-title-sub">
                <h3>{progress.title}</h3>
                <span>{progress.subtitle}</span>
              </div>
            </div>
            <span className="progress-percent-label">{progress.percent}% Completed</span>
          </div>

          {/* SVG Progress Curve plotted dynamically */}
          <div className="line-chart-container">
            <svg viewBox="0 0 1000 120" className="chart-svg" preserveAspectRatio="none">
              {/* Background tracking alignment rail line */}
              <line x1="100" y1="90" x2="900" y2="90" style={{ stroke: '#e2e8f0', strokeWidth: 2 }} />
              
              {/* Progress line curvature */}
              <path 
                d={`M 100 80 Q 250 50 400 ${90 - (progress.percent * 0.7)} T 700 40 T 900 35`} 
                className="chart-line" 
              />
              
              {/* Dynamic Milestone node circles based on API timeline data */}
              {progress.chartPoints && progress.chartPoints.map((point, index) => {
                const totalPoints = progress.chartPoints.length;
                const normalizedXCoordinate = 100 + (index * (800 / Math.max(1, totalPoints - 1)));
                const calculatedYCoordinate = 90 - (point.progress_percentage * 0.8);

                return (
                  <circle 
                    key={index}
                    cx={normalizedXCoordinate} 
                    cy={calculatedYCoordinate} 
                    r="5" 
                    className="chart-point" 
                    data-desc={`Day ${point.day}: ${point.progress_percentage.toFixed(0)}%`} 
                  />
                );
              })}
              
              {/* Scale references */}
              <text x="100" y="112" className="chart-label" textAnchor="middle">0%</text>
              <text x="900" y="112" className="chart-label" textAnchor="middle">100%</text>
            </svg>
          </div>

          {/* Date references & footer button redirection links */}
          <div className="course-progress-footer">
            <div className="date-ranges">
              <div className="date-item">
                <Icon name="calendar" />
                <div>
                  <span className="date-lbl">Start Date</span>
                  <span className="date-val">{progress.startDate}</span>
                </div>
              </div>
              
              <div className="date-separator"></div>
              
              <div className="date-item">
                <Icon name="calendar" />
                <div>
                  <span className="date-lbl">End Date</span>
                  <span className="date-val">{progress.endDate}</span>
                </div>
              </div>
            </div>
            
            <a href="#course" className="view-course-btn">View Course</a>
          </div>
        </div>
      )}

    </div>
  );
}