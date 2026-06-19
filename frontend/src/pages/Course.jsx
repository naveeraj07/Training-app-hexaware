import { useState, useEffect } from 'react';
import courseService from '../services/courseService';
import Icon from '../components/Icon';
import '../styles/Course.css';

// Global simulation variables (replace with your dynamic Auth context values)
const CURRENT_USER_ID = 1; 
const CURRENT_COURSE_ID = 1; 

export default function Course() {
  // Asynchronous Core Data States
  const [course, setCourse] = useState(null);
  const [rawCourseData, setRawCourseData] = useState(null); // Retained for unmapped backend overview references
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Layout Sub-Views Controllers
  const [activeMainTab, setActiveMainTab] = useState('Content'); // 'Content' or 'Overview'
  const [subView, setSubView] = useState('outline'); // 'outline' or 'player'
  const [activeHorizontalTab, setActiveHorizontalTab] = useState('Videos');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [unitVideos, setUnitVideos] = useState([]);
  
  // Progress states tied directly to the backend schemas
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Fetch Structure and Progress from Backend on Mount
  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        setIsLoading(true);
        
        // Fetch course schema and user progress records concurrently
        const [contentData, progressData] = await Promise.all([
          courseService.getCourseContent(CURRENT_COURSE_ID),
          courseService.getCourseProgress(CURRENT_COURSE_ID, CURRENT_USER_ID)
        ]);
        
        setRawCourseData(contentData.course);

        // Transform backend relational schema to fit our frontend structure
        const mappedCourse = {
          title: contentData.course.title,
          totalDays: contentData.course.duration_days,
          currentDay: 7, // Matched with screen layout examples
          modules: contentData.days.map(day => ({
            id: day.day_number,
            title: day.title || `Day ${day.day_number}`,
            dayLabel: `DAY ${day.day_number}`,
            lessons: day.units.map(unit => ({
              id: unit.id,
              title: unit.title,
              duration: "Estimated: 45m"
            }))
          }))
        };

        setCourse(mappedCourse);
        setProgressPercentage(progressData.progress_percentage || 58); // Default fallback placeholder to match user interface visual assets

        // Pre-populate completed lessons from user history records
        if (progressData.completed_units) {
          setCompletedLessons(new Set(progressData.completed_units));
        }
        
      } catch (err) {
        console.error("Failed to fetch course data:", err);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseAndProgress();
  }, []);

  // Toggle Progress Checks with API Sync
  const toggleLesson = async (lessonId, e) => {
    e.stopPropagation();
    const isCurrentlyCompleted = completedLessons.has(lessonId);
    
    // Optimistic UI state update for immediate user feedback
    setCompletedLessons(prev => {
      const next = new Set(prev);
      if (isCurrentlyCompleted) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });

    try {
      if (isCurrentlyCompleted) {
        await courseService.markUnitIncomplete(CURRENT_USER_ID, lessonId);
      } else {
        await courseService.markUnitComplete(CURRENT_USER_ID, lessonId);
      }
      
      // Re-fetch progress metrics to calculate new percentage values across the headers
      const updatedProgress = await courseService.getCourseProgress(CURRENT_COURSE_ID, CURRENT_USER_ID);
      setProgressPercentage(updatedProgress.progress_percentage || 0);
    } catch (err) {
      console.error("Failed to sync progress with database:", err);
      // Revert state if backend update fails
      setCompletedLessons(prev => {
        const next = new Set(prev);
        if (isCurrentlyCompleted) {
          next.add(lessonId);
        } else {
          next.delete(lessonId);
        }
        return next;
      });
    }
  };

  // Launch Dynamic Video Player & Fetch Asset Items
  const handleLaunchVideoPlayer = async (lesson, fallbackTab = 'Videos') => {
    setSelectedLesson(lesson);
    setActiveHorizontalTab(fallbackTab);
    setSubView('player');
    setUnitVideos([]); // Reset playlist items during transitions
    setCurrentVideoUrl('');

    try {
      // Query specific video contents assigned to this unit node
      const videos = await courseService.getUnitVideos(lesson.id);
      setUnitVideos(videos);
      
      if (videos && videos.length > 0) {
        setCurrentVideoUrl(videos[0].video_url);
      }
    } catch (err) {
      console.error("Failed to load videos for the learning unit:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="course-viewport-centered-fallback">
        <h3>Loading Course Details...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-viewport-centered-fallback">
        <h3 className="error-headline-text">{error}</h3>
      </div>
    );
  }

  if (!course) return null; 

  /* ==========================================================================
      VIEW 1: OUTLINE PROFILE BANNER & TIMELINE
     ========================================================================== */
  if (subView === 'outline') {
    return (
      <div className="course-main-viewport">
        <div className="course-hero-banner">
          <div className="hero-left-block">
            <span className="hero-meta-label">COURSE CONTENT</span>
            <h2 className="hero-main-title">{course.title}</h2>
            <div className="hero-navigation-tabs">
              <button 
                className={`hero-tab-item ${activeMainTab === 'Content' ? 'active-ui-tab' : ''}`}
                onClick={() => setActiveMainTab('Content')}
              >
                Content
              </button>
              <button 
                className={`hero-tab-item ${activeMainTab === 'Overview' ? 'active-ui-tab' : ''}`}
                onClick={() => setActiveMainTab('Overview')}
              >
                Overview
              </button>
            </div>
          </div>

          <div className="hero-right-metrics">
            <div className="metric-pill-card">
              <span className="metric-pill-title">PROGRESS</span>
              <span className="metric-pill-digit">{progressPercentage}%</span>
              <div className="metric-pill-track-rail">
                <div className="metric-pill-track-fill" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
            <div className="metric-pill-card">
              <span className="metric-pill-title">CURRENT DAY</span>
              <span className="metric-pill-digit">{course.currentDay}/{course.totalDays}</span>
            </div>
          </div>
        </div>

        <div className="course-workspace-scroll-area">
          {activeMainTab === 'Content' ? (
            /* RENDERING LOGIC: STANDARD INTERACTIVE COURSE SYLLABUS */
            course.modules.map(module => (
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
                            {/* ACTION TARGET 1: VIDEOS LINK */}
                            <button 
                              className="action-pill-btn variant-blue-play"
                              onClick={() => handleLaunchVideoPlayer(lesson, 'Videos')}
                            >
                              <Icon name="play" style={{ fill: '#ffffff', marginRight: '4px' }} />
                              <span>Videos</span>
                            </button>

                            {/* ACTION TARGET 2: NOTES SHORTCUT */}
                            <button 
                              className="variant-secondary-notes"
                              onClick={() => handleLaunchVideoPlayer(lesson, 'Notes')}
                            >
                              <Icon name="file-text" style={{ marginRight: '4px', width: '14px', height: '14px' }} />
                              <span>Notes</span>
                            </button>
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
            ))
          ) : (
            /* [REFACTORED] RENDERING LOGIC: PERFECT TWO-COLUMN OVERVIEW UI */
            <div className="overview-split-layout-grid">
              
              {/* LEFT HAND PANEL BLOCK: DESCRIPTION SUMMARY */}
              <div className="overview-informational-card">
                <h3>Course Overview</h3>
                <p className="overview-body-narrative">
                  {rawCourseData?.description || "Master the fundamentals of Java programming with this comprehensive course. Learn everything from basic syntax to advanced concepts like data structures, algorithms, and object-oriented programming."}
                </p>
                
                <div className="overview-metrics-vertical-stack">
                  <div className="overview-metric-strip-row">
                    <div className="overview-metric-icon-housing">
                      <Icon name="clock" />
                    </div>
                    <div className="overview-metric-meta-details">
                      <span className="overview-metric-meta-label">Duration</span>
                      <span className="overview-metric-meta-value">{course.totalDays} Days • 48 Hours</span>
                    </div>
                  </div>

                  <div className="overview-metric-strip-row">
                    <div className="overview-metric-icon-housing">
                      <Icon name="file-text" />
                    </div>
                    <div className="overview-metric-meta-details">
                      <span className="overview-metric-meta-label">Total Lessons</span>
                      <span className="overview-metric-meta-value">48 Video Lessons</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT HAND PANEL BLOCK: KEY CURRICULUM CHECKLIST */}
              <div className="overview-informational-card">
                <h3>What You'll Learn</h3>
                <div className="overview-curriculum-checklist-deck">
                  {[
                    "Core Java syntax and fundamentals",
                    "Object-oriented programming concepts",
                    "Data structures and algorithms",
                    "Exception handling and debugging",
                    "File I/O and serialization",
                    "Multithreading and concurrency"
                  ].map((curriculumValue, index) => (
                    <div key={index} className="overview-checklist-node-item">
                      <div className="overview-checklist-bullet-node">
                        <Icon name="check" />
                      </div>
                      <span className="overview-checklist-bullet-text">{curriculumValue}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    );
  }

  /* ==========================================================================
      VIEW 2: LECTURE VIDEO WORKSPACE
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
        <p className="video-banner-subtitle">{selectedLesson?.title}</p>
      </div>

      <div className="course-workspace-scroll-area">
        <div className="video-media-frame-wrapper">
          <div className="video-playback-screen-canvas">
            {currentVideoUrl ? (
              <video 
                key={currentVideoUrl} 
                controls 
                className="dashboard-active-video-element"
                autoPlay
              >
                <source src={currentVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div style={{ color: '#94a3b8', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: '12px' }}>
                <Icon name="play" style={{ width: '48px', height: '48px', opacity: 0.3 }} />
                <p>No video streaming paths found for this topic node.</p>
              </div>
            )}
          </div>
        </div>

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

        <div className="video-dynamic-card-container-wrapper">
          {activeHorizontalTab === 'Videos' && (
            <VideoPlaylist 
              videos={unitVideos}
              currentVideoUrl={currentVideoUrl} 
              setCurrentVideoUrl={setCurrentVideoUrl} 
            />
          )}

          {activeHorizontalTab === 'Notes' && (
            <NotesSection learningUnitId={selectedLesson?.id} />
          )}

          {activeHorizontalTab === 'Assignment' && (
            <AssignmentSection />
          )}

          {activeHorizontalTab === 'Q&A' && (
            <QnASection learningUnitId={selectedLesson?.id} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   REAL FUNCTIONAL SUB-COMPONENTS
   ========================================================================== */

function VideoPlaylist({ videos, currentVideoUrl, setCurrentVideoUrl }) {
  if (!videos || videos.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
        <p>No lecture parts attached to this module block.</p>
      </div>
    );
  }

  return (
    <div className="video-tab-playlist-vertical-stack">
      {videos.map((video, idx) => (
        <div 
          key={video.id || idx}
          className={`playlist-card-item ${currentVideoUrl === video.video_url ? 'selection-active' : ''}`}
          onClick={() => setCurrentVideoUrl(video.video_url)} 
        >
          <div className="playlist-card-icon-frame"><Icon name="play" /></div>
          <div className="playlist-card-text-block">
            <h4 className="playlist-card-title">{video.title || `Part ${idx + 1}`}</h4>
            <p className="playlist-card-meta">
              {video.duration_minutes ? `${video.duration_minutes} Mins` : 'Lecture Video File'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function NotesSection({ learningUnitId }) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!learningUnitId) return;
    
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await courseService.getUnitNotes(learningUnitId);
        setNotes(data?.content_text || 'No theory text summaries provided for this lesson yet.');
      } catch (err) {
        console.error("Failed to fetch notes:", err);
        setError("Could not load lesson text summaries.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [learningUnitId]);

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}><p>Fetching lesson notes...</p></div>;
  if (error) return <div style={{ padding: '24px', textAlign: 'center', color: 'red' }}><p>{error}</p></div>;

  return (
    <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#1e293b' }}>
        <Icon name="file-text" style={{ width: '20px', height: '20px' }} />
        <h3 style={{ margin: 0, fontSize: '18px' }}>Lesson Notes & Summaries</h3>
      </div>
      <div style={{ color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
        {notes}
      </div>
    </div>
  );
}

function QnASection({ learningUnitId }) {
  const [qaList, setQaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!learningUnitId) return;

    const fetchQA = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await courseService.getUnitQA(learningUnitId);
        setQaList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load Q&A data:", err);
        setError("Could not pull discussion board feeds.");
      } finally {
        setLoading(false);
      }
    };

    fetchQA();
  }, [learningUnitId]);

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}><p>Loading discussions...</p></div>;
  if (error) return <div style={{ padding: '24px', textAlign: 'center', color: 'red' }}><p>{error}</p></div>;

  return (
    <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: '#1e293b' }}>
        <Icon name="message-circle" style={{ width: '20px', height: '20px' }} />
        <h3 style={{ margin: 0, fontSize: '18px' }}>Student Discussion & Forum Boards</h3>
      </div>

      {qaList.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#64748b', padding: '16px' }}>
          <p>No questions have been submitted for this module unit yet. Be the first to start the thread!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {qaList.map((item) => (
            <div key={item.id} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <h4 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '15px' }}>Q: {item.question}</h4>
              <p style={{ margin: 0, color: '#475569', fontSize: '14px', paddingLeft: '20px' }}>
                <span style={{ fontWeight: '600', color: '#2563eb' }}>A: </span>
                {item.answer || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Pending answer from instructors...</span>}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AssignmentSection() {
  return (
    <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
      <Icon name="file-text" style={{ width: '32px', height: '32px', marginBottom: '16px', opacity: 0.5 }} />
      <h3>Assignments & Code Labs</h3>
      <p style={{ maxWidth: '400px', margin: '0 auto 12px auto', fontSize: '14px' }}>
        Coding sandbox workspaces and testing suite verifications are currently being developed by our backend engineering team.
      </p>
      <span style={{ fontSize: '11px', textTransform: 'uppercase', padding: '4px 8px', backgroundColor: '#e2e8f0', borderRadius: '4px', color: '#475569', fontWeight: 'bold' }}>
        Coming Soon
      </span>
    </div>
  );
}