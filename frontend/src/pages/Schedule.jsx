import { useEffect, useState, useMemo } from "react";
import scheduleService from "../services/scheduleService";
import dashboardService from "../services/dashboardService";
import Icon from "../components/Icon";

// Status configuration
const statusMeta = {
  completed: {
    label: "Completed",
    badgeClass: "status-badge-completed",
    dotClass: "legend-completed",
    icon: "check-circle"
  },
  inprogress: {
    label: "In Progress",
    badgeClass: "status-badge-inprogress",
    dotClass: "legend-ongoing",
    icon: "clock"
  },
  upcoming: {
    label: "Upcoming",
    badgeClass: "status-badge-upcoming",
    dotClass: "legend-upcoming",
    icon: "calendar"
  }
};

// Course Color Palette Generator (Dynamic, non-hardcoded)
function getCourseTheme(courseName = "") {
  const nameLower = (courseName || "").toLowerCase();
  
  if (nameLower.includes("java") && !nameLower.includes("script")) {
    return {
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      lightBg: "rgba(16, 185, 129, 0.12)",
      borderColor: "rgba(16, 185, 129, 0.3)",
      textColor: "#047857",
      badgeBg: "#d1fae5",
      badgeText: "#065f46"
    };
  }
  
  if (nameLower.includes("c#") || nameLower.includes("csharp") || nameLower.includes("c sharp")) {
    return {
      gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
      lightBg: "rgba(99, 102, 241, 0.12)",
      borderColor: "rgba(99, 102, 241, 0.3)",
      textColor: "#4338ca",
      badgeBg: "#e0e7ff",
      badgeText: "#3730a3"
    };
  }

  if (nameLower.includes("sql") || nameLower.includes("database")) {
    return {
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      lightBg: "rgba(245, 158, 11, 0.12)",
      borderColor: "rgba(245, 158, 11, 0.3)",
      textColor: "#b45309",
      badgeBg: "#fef3c7",
      badgeText: "#92400e"
    };
  }

  if (nameLower.includes("python")) {
    return {
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      lightBg: "rgba(6, 182, 212, 0.12)",
      borderColor: "rgba(6, 182, 212, 0.3)",
      textColor: "#0e7490",
      badgeBg: "#cffaff",
      badgeText: "#155e75"
    };
  }

  // Hash-based dynamic fallback palette for any new course
  let hash = 0;
  for (let i = 0; i < courseName.length; i++) {
    hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  
  return {
    gradient: `linear-gradient(135deg, hsl(${hue}, 70%, 50%) 0%, hsl(${hue}, 75%, 40%) 100%)`,
    lightBg: `hsla(${hue}, 70%, 50%, 0.12)`,
    borderColor: `hsla(${hue}, 70%, 50%, 0.3)`,
    textColor: `hsl(${hue}, 80%, 30%)`,
    badgeBg: `hsla(${hue}, 80%, 90%, 1)`,
    badgeText: `hsl(${hue}, 85%, 25%)`
  };
}

function getModuleState(session, dayStatus) {
  if (session.completed) return "completed";
  if (dayStatus === "inprogress") return "inprogress";
  return "upcoming";
}

export default function Schedule({ courseId = null }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [activeCourseId, setActiveCourseId] = useState(courseId);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'agenda'

  useEffect(() => {
    setActiveCourseId(courseId);
  }, [courseId]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userId = Number(localStorage.getItem("logged_in_user_id")) || 1;
        const dash = await dashboardService.getDashboard(userId);
        if (dash && dash.enrolled_courses) {
          setEnrolledCourses(dash.enrolled_courses);
        }
      } catch (err) {
        console.error("Failed to fetch enrolled courses for schedule filter:", err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setLoading(true);
        const userId = Number(localStorage.getItem("logged_in_user_id")) || 1;
        const result = await scheduleService.getScheduleData(userId, currentWeekIndex, activeCourseId);
        setData(result);
      } catch (error) {
        console.error("Failed to load schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [currentWeekIndex, activeCourseId]);

  const maxWeekIndex = Math.max((data?.weeks?.length || 1) - 1, 0);

  const handlePreviousWeek = () => {
    setCurrentWeekIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextWeek = () => {
    setCurrentWeekIndex((prev) => Math.min(prev + 1, maxWeekIndex));
  };

  const handleResetToToday = () => {
    setCurrentWeekIndex(0);
  };

  const currentWeek = data?.weeks?.[Math.min(currentWeekIndex, maxWeekIndex)] || data?.weeks?.[0];
  const daysList = currentWeek?.days || [];

  // Filtered sessions by search query
  const filteredDaysList = useMemo(() => {
    if (!searchQuery.trim()) return daysList;
    const q = searchQuery.toLowerCase().trim();

    return daysList.map((day) => ({
      ...day,
      sessions: (day.sessions || []).filter((session) =>
        (session.title || "").toLowerCase().includes(q) ||
        (session.course_name || "").toLowerCase().includes(q) ||
        `lu-${session.learning_unit_id}`.toLowerCase().includes(q)
      )
    }));
  }, [daysList, searchQuery]);

  // Compute completion stats
  const totalWeekSessions = useMemo(() => {
    return daysList.reduce((acc, day) => acc + (day.sessions?.length || 0), 0);
  }, [daysList]);

  const completedWeekSessions = useMemo(() => {
    return daysList.reduce((acc, day) => {
      return acc + (day.sessions || []).filter((s) => s.completed).length;
    }, 0);
  }, [daysList]);

  const completionPercentage = totalWeekSessions > 0
    ? Math.round((completedWeekSessions / totalWeekSessions) * 100)
    : 0;

  if (loading) {
    return (
      <div className="page-view schedule-container">
        <div className="schedule-loading-state">
          <div className="schedule-spinner"></div>
          <h3>Synchronizing Timetable & Course Schedules...</h3>
          <p>Fetching assigned learning units and live session slots.</p>
        </div>
      </div>
    );
  }

  if (!data?.weeks?.length) {
    return (
      <div className="page-view schedule-container">
        <div className="schedule-empty-state-container">
          <Icon name="calendar" className="empty-icon" />
          <h2>No Schedule Available</h2>
          <p>There are currently no training sessions assigned for this course view.</p>
          <button className="schedule-action-btn primary" onClick={() => setActiveCourseId(null)}>
            View All Courses Schedule
          </button>
        </div>
      </div>
    );
  }

  const dayCount = filteredDaysList.length || 5;

  return (
    <div className="page-view schedule-container">
      {/* 🌟 Schedule Header Banner */}
      <div className="schedule-banner">
        <div className="banner-top">
          <div className="schedule-banner-left">
            <div className="banner-icon-badge">
              <Icon name="calendar" />
            </div>
            <div>
              <h1 className="schedule-banner-title">Training Schedule</h1>
              <p className="schedule-banner-subtitle">
                View, filter, and track daily live sessions, module milestones, and program roadmaps.
              </p>
            </div>
          </div>

          <div className="schedule-banner-right">
            <button
              className={`schedule-banner-btn ${currentWeekIndex === 0 ? 'today-active' : ''}`}
              onClick={handleResetToToday}
              title="Jump to current week"
            >
              <Icon name="clock" />
              <span>Current Week</span>
            </button>
            <button className="schedule-banner-btn" id="btn-share" onClick={() => alert("Schedule share link copied!")}>
              <Icon name="share-2" />
              <span>Share</span>
            </button>
            <button className="schedule-banner-btn" id="btn-export" onClick={() => alert("Downloading schedule summary...")}>
              <Icon name="download" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* 📊 Overview Statistics Cards */}
        <div className="schedule-stats-card">
          {data.stats.map((stat, index) => {
            let iconName = "layers";
            if (stat.label === "Sections") iconName = "layout";
            if (stat.label === "Days") iconName = "calendar";
            if (stat.label === "Total Hours") iconName = "clock";
            
            return (
              <div key={index} className="schedule-stat-item">
                <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color || '#3563e9'}15` }}>
                  <Icon name={iconName} className="stat-icon" style={{ color: stat.color || '#3563e9' }} />
                </div>
                <div className="stat-content">
                  <span className="schedule-stat-val">{stat.value}</span>
                  <span className="schedule-stat-lbl">{stat.label}</span>
                </div>
              </div>
            );
          })}

          <div className="schedule-stat-item progress-stat-item">
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
              <Icon name="trending-up" className="stat-icon" style={{ color: '#10b981' }} />
            </div>
            <div className="stat-content">
              <div className="stat-val-group">
                <span className="schedule-stat-val">{completionPercentage}%</span>
                <span className="stat-subtext">({completedWeekSessions}/{totalWeekSessions})</span>
              </div>
              <span className="schedule-stat-lbl">Week Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 Prominent Course Filter & Control Bar */}
      <div className="schedule-control-bar">
        <div className="control-left">
          {/* Prominent Course Dropdown Filter */}
          <div className="course-dropdown-wrapper">
            <label htmlFor="course-select-filter" className="course-select-label">
              <Icon name="book-open" className="select-label-icon" />
              <span>Course Filter:</span>
            </label>
            <div className="custom-select-container">
              <select
                id="course-select-filter"
                className="course-select-dropdown"
                value={activeCourseId === null ? "all" : String(activeCourseId)}
                onChange={(e) => {
                  const val = e.target.value;
                  setActiveCourseId(val === "all" ? null : Number(val));
                }}
              >
                <option value="all">✨ All Courses (Overall Schedule)</option>
                {enrolledCourses.map((c) => (
                  <option key={c.course_id} value={c.course_id}>
                    📚 {c.course_name}
                  </option>
                ))}
              </select>
              <Icon name="chevron-down" className="select-caret-icon" />
            </div>
          </div>

          {/* Dynamic Quick Filter Pills */}
          <div className="schedule-course-filter-pills">
            <button
              type="button"
              className={`schedule-filter-pill ${activeCourseId === null ? 'active' : ''}`}
              onClick={() => setActiveCourseId(null)}
            >
              <Icon name="layers" />
              <span>All Courses</span>
            </button>
            {enrolledCourses.map((c) => {
              const theme = getCourseTheme(c.course_name);
              const isActive = activeCourseId === c.course_id;
              return (
                <button
                  key={c.course_id}
                  type="button"
                  className={`schedule-filter-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCourseId(c.course_id)}
                  style={isActive ? { background: theme.gradient, color: '#ffffff' } : {}}
                >
                  <span
                    className="pill-dot"
                    style={{ backgroundColor: isActive ? '#ffffff' : theme.textColor }}
                  />
                  <span>{c.course_name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="control-right">
          {/* Search bar within schedule */}
          <div className="schedule-search-box">
            <Icon name="search" className="search-icon" />
            <input
              type="text"
              placeholder="Search module or LU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="schedule-search-input"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
                <Icon name="x" />
              </button>
            )}
          </div>

          {/* View Mode Switcher (Grid vs Agenda) */}
          <div className="view-mode-toggle">
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Weekly Grid View"
            >
              <Icon name="layout" />
              <span className="btn-label">Grid</span>
            </button>
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'agenda' ? 'active' : ''}`}
              onClick={() => setViewMode('agenda')}
              title="Timeline Agenda View"
            >
              <Icon name="list" />
              <span className="btn-label">Agenda</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📅 Timetable Card View */}
      <div className="weekly-view-card">
        {/* Top Header & Navigation */}
        <div className="weekly-view-heading">
          <div className="heading-title-group">
            <h3>
              {activeCourseId === null
                ? "Overall Timetable (All Enrolled Courses)"
                : `${enrolledCourses.find(c => c.course_id === activeCourseId)?.course_name || 'Course'} Schedule`}
            </h3>
            <p>Mon–Fri daily session breakdown & learning unit progression.</p>
          </div>

          <div className="schedule-header-actions">
            {/* Status Legend */}
            <div className="schedule-legend">
              <span className="legend-item">
                <span className="legend-dot legend-completed"></span>
                Completed
              </span>
              <span className="legend-item">
                <span className="legend-dot legend-ongoing"></span>
                Ongoing
              </span>
              <span className="legend-item">
                <span className="legend-dot legend-upcoming"></span>
                Upcoming
              </span>
            </div>

            {/* Week Navigation Controls */}
            <div className="week-navigation bottom-navigation">
              <button
                className="schedule-banner-btn week-nav-btn"
                onClick={handlePreviousWeek}
                disabled={currentWeekIndex === 0}
              >
                <Icon name="chevron-left" />
                <span>Prev</span>
              </button>
              
              <div className="week-nav-label">
                <span className="week-tag">{currentWeek.label || `Week ${currentWeekIndex + 1}`}</span>
                <small className="week-dates">{currentWeek.range || "Current Schedule"}</small>
              </div>

              <button
                className="schedule-banner-btn week-nav-btn"
                onClick={handleNextWeek}
                disabled={currentWeekIndex >= maxWeekIndex}
              >
                <span>Next</span>
                <Icon name="chevron-right" />
              </button>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* VIEW MODE 1: WEEKLY GRID VIEW                       */}
        {/* ---------------------------------------------------- */}
        {viewMode === "grid" ? (
          <div className="timetable-grid-container">
            {/* Day Column Headers */}
            <div
              className="timetable-header-row"
              style={{ gridTemplateColumns: `repeat(${dayCount}, 1fr)` }}
            >
              {filteredDaysList.map((day) => {
                const dayStatus = statusMeta[day.status] || statusMeta.upcoming;
                return (
                  <div key={`header-${day.name}`} className="timetable-day-header">
                    <div className="day-header-top">
                      <span className="timetable-day-name">{day.shortName || day.name.substring(0, 3)}</span>
                      {day.date && <span className="timetable-day-date">{day.date}</span>}
                    </div>
                    <span className={`day-status-chip ${day.status}`}>
                      {dayStatus.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Day Columns Content */}
            <div
              className="timetable-content-row"
              style={{ gridTemplateColumns: `repeat(${dayCount}, 1fr)` }}
            >
              {filteredDaysList.map((day) => (
                <div key={`content-${day.name}`} className="timetable-day-column">
                  {day.sessions.length === 0 ? (
                    <div className="timetable-empty-slot">
                      <Icon name="coffee" className="empty-slot-icon" />
                      <span>{searchQuery ? "No matching sessions" : "No Sessions Scheduled"}</span>
                    </div>
                  ) : (
                    day.sessions.map((session, idx) => {
                      const state = getModuleState(session, day.status);
                      const stateInfo = statusMeta[state] || statusMeta.upcoming;
                      const theme = getCourseTheme(session.course_name);

                      return (
                        <div
                          key={`${session.course_name || 'c'}-${session.title}-${session.start_time}-${idx}`}
                          className={`timetable-module-card module-card-${state}`}
                          style={{
                            borderLeft: `4px solid ${session.completed ? '#10b981' : theme.textColor}`
                          }}
                        >
                          {/* Course Badge (Displayed on All Courses & Single Course view) */}
                          <div className="module-card-header">
                            {session.course_name && (
                              <span
                                className="timetable-course-badge"
                                style={{
                                  backgroundColor: theme.badgeBg,
                                  color: theme.badgeText
                                }}
                              >
                                {session.course_name}
                              </span>
                            )}

                            <span className={`module-status-chip ${state}`}>
                              <Icon name={stateInfo.icon} className="chip-icon" />
                              {stateInfo.label}
                            </span>
                          </div>

                          {/* Session Time */}
                          <div className="timetable-module-time">
                            <Icon name="clock" className="time-icon" />
                            <span>{session.start_time} – {session.end_time}</span>
                          </div>

                          {/* Module Title & LU code */}
                          <h4 className="timetable-module-title" title={session.title}>
                            {session.title}
                          </h4>

                          <div className="module-card-footer">
                            <span className="timetable-module-code">LU-{session.learning_unit_id}</span>
                            {session.duration_minutes > 0 && (
                              <span className="module-duration">{session.duration_minutes}m</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ---------------------------------------------------- */
          /* VIEW MODE 2: TIMELINE AGENDA VIEW                    */
          /* ---------------------------------------------------- */
          <div className="timetable-agenda-container">
            {filteredDaysList.map((day) => {
              const dayStatus = statusMeta[day.status] || statusMeta.upcoming;
              return (
                <div key={`agenda-${day.name}`} className="agenda-day-group">
                  <div className="agenda-day-header">
                    <div className="agenda-day-badge">
                      <span className="day-name">{day.name}</span>
                      {day.date && <span className="day-date">{day.date}</span>}
                    </div>
                    <span className={`day-status-chip ${day.status}`}>
                      {dayStatus.label}
                    </span>
                  </div>

                  <div className="agenda-day-timeline">
                    {day.sessions.length === 0 ? (
                      <div className="agenda-empty-item">
                        <Icon name="sun" className="empty-icon" />
                        <span>Rest Day — No active sessions scheduled.</span>
                      </div>
                    ) : (
                      day.sessions.map((session, idx) => {
                        const state = getModuleState(session, day.status);
                        const stateInfo = statusMeta[state] || statusMeta.upcoming;
                        const theme = getCourseTheme(session.course_name);

                        return (
                          <div
                            key={`agenda-sess-${idx}`}
                            className={`agenda-session-card ${state}`}
                          >
                            <div className="agenda-time-column">
                              <span className="time-start">{session.start_time}</span>
                              <span className="time-sep">•</span>
                              <span className="time-end">{session.end_time}</span>
                            </div>

                            <div className="agenda-timeline-connector">
                              <span
                                className="timeline-node"
                                style={{ backgroundColor: session.completed ? '#10b981' : theme.textColor }}
                              />
                              <div className="timeline-line" />
                            </div>

                            <div className="agenda-card-content">
                              <div className="agenda-content-top">
                                {session.course_name && (
                                  <span
                                    className="timetable-course-badge"
                                    style={{
                                      backgroundColor: theme.badgeBg,
                                      color: theme.badgeText
                                    }}
                                  >
                                    {session.course_name}
                                  </span>
                                )}
                                <span className={`module-status-chip ${state}`}>
                                  <Icon name={stateInfo.icon} className="chip-icon" />
                                  {stateInfo.label}
                                </span>
                              </div>

                              <h4 className="agenda-session-title">{session.title}</h4>
                              
                              <div className="agenda-content-bottom">
                                <span className="lu-badge">Learning Unit #{session.learning_unit_id}</span>
                                {session.duration_minutes > 0 && (
                                  <span className="duration-tag">
                                    <Icon name="clock" />
                                    {session.duration_minutes} minutes
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}