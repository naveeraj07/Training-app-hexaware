import { useState, useEffect } from 'react';
import courseService from '../services/courseService';
import Icon from '../components/Icon';
import '../styles/Course.css';

export default function Course() {
  // 1. New Asynchronous Data States
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Navigation Sub-Views Layout Controller
  const [subView, setSubView] = useState('outline'); 
  const [activeHorizontalTab, setActiveHorizontalTab] = useState('Videos');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  
  // Start with an empty Set. We will populate this once the backend data arrives.
  const [completedLessons, setCompletedLessons] = useState(new Set());

  // 2. Fetch Data from Backend on Component Mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const data = await courseService.getCourseData(); 
        
        setCourse(data);

        // Pre-populate completed lessons check state based on backend response
        const completed = new Set();
        data.modules.forEach(module => {
          module.lessons.forEach(lesson => {
            if (lesson.completed) {
              completed.add(lesson.id);
            }
          });
        });
        setCompletedLessons(completed);
        
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, []);

  const toggleLesson = (lessonId, e) => {
    e.stopPropagation();
    
    setCompletedLessons(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  };

  const handleLaunchVideoPlayer = (lesson) => {
    setSelectedLesson(lesson);
    setActiveHorizontalTab('Videos');
    setSubView('player');
    setCurrentVideoUrl(lesson.videoUrl || 'https://res.cloudinary.com/dqtotv05r/video/upload/q_auto/f_auto/v1781008049/Day_1_Algorithm_Basics_zcfxd7.mp4');
  };

  // 3. Handle Loading and Error States in the UI
  if (isLoading) {
    return (
      <div className="course-main-viewport" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h3>Loading Course Details...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-main-viewport" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h3 style={{ color: 'red' }}>{error}</h3>
      </div>
    );
  }

  // 4. Render Main Content
  if (!course) return null; 

  /* ==========================================================================
     VIEW 1: OUTLINE PROFILE BANNER & TIMELINE ("Course 1")
     ========================================================================== */
  if (subView === 'outline') {
    return (
      <div className="course-main-viewport">
        <div className="course-hero-banner">
          <div className="hero-left-block">
            <span className="hero-meta-label">COURSE CONTENT</span>
            <h2 className="hero-main-title">{course.title}</h2>
            <div className="hero-navigation-tabs">
              <button className="hero-tab-item active-ui-tab">Content</button>
              <button className="hero-tab-item">Overview</button>
            </div>
          </div>

          <div className="hero-right-metrics">
            <div className="metric-pill-card">
              <span className="metric-pill-title">PROGRESS</span>
              <span className="metric-pill-digit">{course.progress}%</span>
              <div className="metric-pill-track-rail">
                <div className="metric-pill-track-fill" style={{ width: `${course.progress}%` }}></div>
              </div>
            </div>
            <div className="metric-pill-card">
              <span className="metric-pill-title">CURRENT DAY</span>
              <span className="metric-pill-digit">{course.currentDay}/{course.totalDays}</span>
            </div>
          </div>
        </div>

        <div className="course-workspace-scroll-area">
          {course.modules.map(module => (
            <div key={module.id} className="module-timeline-group">
              <div className="module-timeline-header">
                <div className="module-numeric-badge">{module.id}</div>
                <div className="module-heading-details">
                  <h3 className="module-primary-title">{module.title}</h3>
                  <span className="module-duration-subtitle">
                    <Icon name="clock" />
                    <span>{module.dayLabel}</span>
                  </span>
                </div>
              </div>

              <div className="module-lessons-deck">
                {module.lessons.map(lesson => {
                  const isCompleted = completedLessons.has(lesson.id);
                  return (
                    <div key={lesson.id} className="lesson-row-interactive-card">
                      <div className="lesson-row-meta-left">
                        <h4 className="lesson-row-title">{lesson.title}</h4>
                        <span className="lesson-row-duration">{lesson.duration}</span>
                        
                        <div className="lesson-row-action-row">
                          <button 
                            className="action-pill-btn variant-blue-play"
                            onClick={() => handleLaunchVideoPlayer(lesson)}
                          >
                            <Icon name="play" style={{ fill: '#ffffff' }} />
                            <span>{lesson.videos} Videos</span>
                          </button>
                          
                          {lesson.hasNotes && (
                            <button className="action-pill-btn variant-gray-notes">
                              <Icon name="file-text" />
                              <span>Notes</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="lesson-row-checkbox-right">
                        <div 
                          className={`ui-checkbox-node ${isCompleted ? 'state-checked' : 'state-unchecked'}`} 
                          onClick={(e) => toggleLesson(lesson.id, e)}
                        >
                          {isCompleted && <Icon name="check" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ==========================================================================
     VIEW 2: LECTURE VIDEO WORKSPACE ("video 2")
     ========================================================================== */
  return (
    <div className="course-main-viewport">
      <div className="video-workspace-banner">
        <button className="video-banner-back-btn" onClick={() => setSubView('outline')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to Course
        </button>
        <h2 className="video-banner-title">{course.title}</h2>
        <p className="video-banner-subtitle">Day {course.currentDay} of {course.totalDays}</p>
      </div>

      <div className="course-workspace-scroll-area">
        
        {/* 16:9 Aspect Frame Wrapper Area */}
        <div className="video-media-frame-wrapper">
          <div className="video-playback-screen-canvas">
            <video 
              key={currentVideoUrl} 
              controls 
              className="dashboard-active-video-element"
            >
              <source src={currentVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Tab Row Selector */}
        <div className="video-content-horizontal-nav-row">
          {['Videos', 'Notes', 'Assignment', 'Q&A'].map((tabName) => (
            <button
              key={tabName}
              onClick={() => setActiveHorizontalTab(tabName)}
              className={`video-horizontal-nav-item ${activeHorizontalTab === tabName ? 'active-nav-pill' : ''}`}
            >
              {tabName}
            </button>
          ))}
        </div>

        {/* Tab Panel Content Box */}
        <div className="video-dynamic-card-container-wrapper">
          
          {/* TAB AREA 1: PLAYLIST TUNNEL (Real Component) */}
          {activeHorizontalTab === 'Videos' && (
            <VideoPlaylist 
              currentVideoUrl={currentVideoUrl} 
              setCurrentVideoUrl={setCurrentVideoUrl} 
            />
          )}

          {/* TAB AREA 2: NOTES (Placeholder) */}
          {activeHorizontalTab === 'Notes' && <NotesPlaceholder />}

          {/* TAB AREA 3: ASSIGNMENT (Placeholder) */}
          {activeHorizontalTab === 'Assignment' && <AssignmentPlaceholder />}

          {/* TAB AREA 4: Q&A (Placeholder) */}
          {activeHorizontalTab === 'Q&A' && <QnAPlaceholder />}

        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   EXTRACTED COMPONENTS 
   ========================================================================== */

function VideoPlaylist({ currentVideoUrl, setCurrentVideoUrl }) {
  return (
    <div className="video-tab-playlist-vertical-stack">
      <div 
        className={`playlist-card-item ${currentVideoUrl.includes('Algorithm_Basics') || currentVideoUrl.includes('mov_bbb') ? 'selection-active' : ''}`}
        onClick={() => setCurrentVideoUrl('https://res.cloudinary.com/dqtotv05r/video/upload/q_auto/f_auto/v1781008049/Day_1_Algorithm_Basics_zcfxd7.mp4')} 
      >
        <div className="playlist-card-icon-frame"><Icon name="play" /></div>
        <div className="playlist-card-text-block">
          <h4 className="playlist-card-title">Using an Inner Join</h4>
          <p className="playlist-card-meta">15:58 • DONE</p>
        </div>
      </div>

      <div 
        className={`playlist-card-item ${currentVideoUrl.includes('movie.mp4') ? 'selection-active' : ''}`}
        onClick={() => setCurrentVideoUrl('https://www.w3schools.com/html/movie.mp4')} 
      >
        <div className="playlist-card-icon-frame"><Icon name="play" /></div>
        <div className="playlist-card-text-block">
          <h4 className="playlist-card-title">Using an Outer Join</h4>
          <p className="playlist-card-meta">12:45 • NOT STARTED</p>
        </div>
      </div>

      <div 
        className={`playlist-card-item ${currentVideoUrl.includes('flower.mp4') ? 'selection-active' : ''}`}
        onClick={() => setCurrentVideoUrl('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4')}
      >
        <div className="playlist-card-icon-frame"><Icon name="play" /></div>
        <div className="playlist-card-text-block">
          <h4 className="playlist-card-title">Cross Join Examples</h4>
          <p className="playlist-card-meta">18:30 • NOT STARTED</p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   PLACEHOLDER COMPONENTS 
   ========================================================================== */

function NotesPlaceholder() {
  return (
    <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
      <Icon name="file-text" style={{ width: '32px', height: '32px', marginBottom: '16px', opacity: 0.5 }} />
      <h3>Notes Component</h3>
      <p>Lesson notes will be rendered here.</p>
    </div>
  );
}

function AssignmentPlaceholder() {
  return (
    <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
      <Icon name="edit" style={{ width: '32px', height: '32px', marginBottom: '16px', opacity: 0.5 }} />
      <h3>Assignment Component</h3>
      <p>Interactive assignments will be loaded here.</p>
    </div>
  );
}

function QnAPlaceholder() {
  return (
    <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
      <Icon name="message-circle" style={{ width: '32px', height: '32px', marginBottom: '16px', opacity: 0.5 }} />
      <h3>Q&A Component</h3>
      <p>Student discussions and questions will appear here.</p>
    </div>
  );
}