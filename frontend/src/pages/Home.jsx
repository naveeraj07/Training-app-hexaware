import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import Icon from '../components/Icon';

export default function Home() {
  // Real database-driven states matching your system specification
  const [activeCourse, setActiveCourse] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);
  const [timelinePoints, setTimelinePoints] = useState([]);
  
  // Interface view load states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = 1; // Current active user session ID

  useEffect(() => {
    const fetchDashboardTelemetry = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch user's enrolled courses
        const enrolledCourses = await dashboardService.getCoursesByUser(userId);
        
        if (enrolledCourses && enrolledCourses.length > 0) {
          const currentCourse = enrolledCourses[0];
          setActiveCourse(currentCourse);

          // Dispatch requests in parallel for calculation stats and line graph arrays
          const [progressData, timelineData] = await Promise.all([
            dashboardService.getCourseProgress(currentCourse.id, userId),
            dashboardService.getProgressTimeline(userId)
          ]);

          setCourseProgress(progressData);
          setTimelinePoints(timelineData || []);
        } else {
          setError("You are not currently enrolled in any courses.");
        }
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

  // Fallback to defaults if backend values aren't populated yet
  const currentCompletionPercentage = courseProgress?.percentage || 48; 
  const totalUnitsCount = courseProgress?.total_units || 46;
  const completedUnitsCount = courseProgress?.completed_units || 5;

  return (
    <div className="page-view dashboard-container">
      
      {/* 1. Blue Header Banner */}
      <div className="dashboard-banner">
        <div className="banner-content">
          <h2 className="banner-greeting">Hii Name! 👋</h2>
          <span className="banner-subtitle">READY TO LEARN</span>
        </div>
      </div>

      {/* 2. Stats Grid (Overlapping Row) */}
      <div className="stats-cards-grid">
        <div className="stat-card color-blue" id="stat-current-course">
          <div className="stat-icon-wrapper">
            <Icon name="book-open" className="stat-icon" />
          </div>
          <span className="stat-title">{activeCourse?.title || "Core Java"}</span>
          <span className="stat-label">Course Enrolled</span>
        </div>

        <div className="stat-card color-green" id="stat-modules-completed">
          <div className="stat-icon-wrapper">
            <Icon name="check-circle" className="stat-icon" />
          </div>
          <span className="stat-title">{completedUnitsCount}</span>
          <span className="stat-label">Modules Completed</span>
        </div>

        <div className="stat-card color-blue" id="stat-overall-completion">
          <div className="stat-icon-wrapper">
            <Icon name="trending-up" className="stat-icon" />
          </div>
          <span className="stat-title">{currentCompletionPercentage}%</span>
          <span className="stat-label">Over All Completion</span>
        </div>

        <div className="stat-card color-red" id="stat-courses-enrolled">
          <div className="stat-icon-wrapper">
            <Icon name="alert-circle" className="stat-icon" />
          </div>
          <span className="stat-title">0</span>
          <span className="stat-label">Course Enrolled</span>
        </div>
      </div>

      {/* 3. Mid Row (Keep Going & Time Spent Cards Fully Restored) */}
      <div className="dashboard-row-mid">
        
        {/* Keep Going Card */}
        <div className="keep-going-card">
          <div className="card-badge-pill">
            <Icon name="zap" style={{ width: '12px', height: '12px', fill: '#ffdf40', stroke: '#ffdf40' }} />
            <span>Keep Going!</span>
          </div>
          
          <div className="keep-going-content">
            <h3 className="keep-going-title">61 Modules Almost Done</h3>
            <p className="keep-going-desc">You're making amazing progress! Finish your courses and unlock new achievements.</p>
          </div>
          
          <a href="#course" className="continue-btn">
            <span>Continue Learning</span>
            <Icon name="arrow-right" style={{ width: '16px', height: '16px' }} />
          </a>
        </div>

        {/* Time Spent Venn Diagram Card */}
        <div className="time-spent-card">
          <div className="card-badge-pill time-spent-badge">
            <Icon name="zap" style={{ width: '12px', height: '12px', fill: '#ffdf40', stroke: '#ffdf40' }} />
            <span>Time spent</span>
          </div>
          
          <div className="venn-container">
            {/* Learning Contents Circle */}
            <div className="venn-circle circle-learning">
              <span className="venn-circle-title">1 Day</span>
              <span className="venn-circle-hours">05:00 hrs</span>
              <span className="venn-circle-label">Learning Contents</span>
            </div>
            
            {/* Assessment Circle */}
            <div className="venn-circle circle-assessment">
              <span className="venn-circle-hours">00:03:20 hrs</span>
              <span className="venn-circle-label">Assessment</span>
            </div>
            
            {/* Practice Circle */}
            <div className="venn-circle circle-practice">
              <span className="venn-circle-hours">00:01:40 hrs</span>
              <span className="venn-circle-label">Practice</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Bottom Row (Course Progress & Line Graph Tracker) */}
      <div className="course-progress-card">
        <div className="course-progress-header">
          <div className="course-progress-info">
            <div className="course-icon-bg">
              <Icon name="book-open" style={{ width: '20px', height: '20px' }} />
            </div>
            <div className="course-title-sub">
              <h3>{activeCourse?.title || "Core Java"}</h3>
              <span>Day 7 of {activeCourse?.duration_days || 12}</span>
            </div>
          </div>
          <span className="progress-percent-label">{currentCompletionPercentage}% Completed</span>
        </div>

        {/* SVG Progress Curve plotted using timeline dashboard elements */}
        <div className="line-chart-container">
          <svg viewBox="0 0 1000 120" className="chart-svg" preserveAspectRatio="none">
            {/* Background tracking alignment rail line */}
            <line x1="100" y1="90" x2="900" y2="90" style={{ stroke: '#e2e8f0', strokeWidth: 2 }} />
            
            {/* Progress line curvature */}
            <path 
              d={`M 100 80 Q 250 50 400 ${90 - (currentCompletionPercentage * 0.7)} T 700 40 T 900 35`} 
              className="chart-line" 
            />
            
            {/* Milestone node circles */}
            <circle cx="100" cy="80" r="5" className="chart-point" data-desc="Day 0: 0%" />
            <circle cx="400" cy={90 - (currentCompletionPercentage * 0.7)} r="5" className="chart-point" data-desc={`Current Level: ${currentCompletionPercentage}%`} />
            <circle cx="900" cy="35" r="5" className="chart-point" data-desc="Completion target: 100%" />
            
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
                <span className="date-val">13 May, 26</span>
              </div>
            </div>
            
            <div className="date-separator"></div>
            
            <div className="date-item">
              <Icon name="calendar" />
              <div>
                <span className="date-lbl">End Date</span>
                <span className="date-val">13 May, 26</span>
              </div>
            </div>
          </div>
          
          <a href="#course" className="view-course-btn">View Course</a>
        </div>
      </div>

    </div>
  );
}