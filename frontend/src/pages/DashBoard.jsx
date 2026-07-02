import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService.js';
import Icon from '../components/Icon';
import Home from '../pages/Home';
import Course from '../pages/Course';
import Schedule from '../pages/Schedule';
import Placeholder from '../pages/Placeholder';
import ProgressView from './ProgressView.jsx';

export default function DashBoard() {
  // 1. Convert profile to a state object to handle asynchronous API loading
  const [profile, setProfile] = useState({ name: "Loading...", email: "" });
  
  // 🌟 Dynamic Course ID State tracking user's enrollment assignment
  const [courseId, setCourseId] = useState(null);
  const [isCourseLoading, setIsCourseLoading] = useState(true);
  
  // Hash routing state
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.substring(1);
    return hash || 'home';
  });

  // 2. Dynamically retrieve the logged-in user ID from localStorage
  const userId = Number(localStorage.getItem('logged_in_user_id')) || 1;

  // 3. Fetch the user profile and assigned course asynchronously when the dashboard mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await dashboardService.getUserProfile(userId);
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to load user profile in sidebar:", error);
        
        // Smart Fallback
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setProfile({ 
          name: storedUser.employee_id || "Student", 
          email: storedUser.email || "student@example.com" 
        });
      }
    };

    // 🌟 New: Fetch the course ID assigned to this user from the API endpoint
    const fetchUserAssignedCourse = async () => {
      try {
        setIsCourseLoading(true);
        const API_BASE = "http://localhost:8000";

const response = await fetch(
    `${API_BASE}/courses/users/${userId}`
);
const data = await response.json();

console.log("Courses API Response:", data);

const assignedId = data[0]?.id ?? 1;

console.log("Assigned Course ID:", assignedId);

setCourseId(assignedId);
      } catch (error) {
        console.error("Failed to load assigned user course:", error);
        setCourseId(1); // Production Fallback to default course
      } finally {
        setIsCourseLoading(false);
      }
    };

    fetchProfile();
    fetchUserAssignedCourse();
  }, [userId]);

  // 4. Handle hash-based navigation changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      setCurrentRoute(hash || 'home');
    };

    window.addEventListener('hashchange', handleHashChange);
    
    if (!window.location.hash) {
      window.location.hash = 'home';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderContent = () => {
    switch (currentRoute) {
      case 'home':
        return <Home />;
      case 'course':
        // 🌟 Pass the live backend assigned courseId down to the Course subpage
        if (isCourseLoading) {
          return <div style={{ padding: '40px', textAlign: 'center' }}><h3>Verifying active enrollment...</h3></div>;
        }
        return <Course courseId={courseId} />;
      case 'schedule':
        return <Schedule />;
      case 'progress':
        return <ProgressView/>;
      case 'notes':
        return <Placeholder title="Notes" description="Manage your course notes and key highlights." />;
      case 'profile':
        return <Placeholder title="Profile" description="View and update your student profile information." />;
      case 'logout':
        return <Placeholder title="Logged Out" description="You have been successfully logged out." />;
      default:
        return <Home />;
    }
  };

  const navItems = [
    { page: 'home', icon: 'home', label: 'Home' },
    { page: 'course', icon: 'book-open', label: 'Course' },
    { page: 'schedule', icon: 'clock', label: 'Schedule' },
    { page: 'progress', icon: 'star', label: 'Progress' },
    { page: 'notes', icon: 'file-text', label: 'Notes' },
    { page: 'profile', icon: 'user', label: 'Profile' }
  ];

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">Hexaware</h1>
        </div>
        
        {/* User profile info */}
        <div className="user-profile-card">
          <div className="profile-info">
            <span className="user-label">Name</span>
            <span className="user-name" id="user-display-name">{profile.name}</span>
            <span className="user-email" id="user-display-email">{profile.email}</span>
          </div>
        </div>
        
        {/* Nav menu list */}
        <nav className="nav-menu">
          <ul>
            {navItems.map(item => (
              <li key={item.page}>
                <a 
                  href={`#${item.page}`} 
                  className={`nav-item ${currentRoute === item.page ? 'active' : ''}`}
                  data-page={item.page}
                >
                  <Icon name={item.icon} className="nav-icon" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Logout at bottom */}
        <div className="sidebar-footer">
          <a 
            href="#logout" 
            className={`nav-item logout-btn ${currentRoute === 'logout' ? 'active' : ''}`}
            data-page="logout"
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
              localStorage.removeItem('logged_in_user_id');
              window.location.href = '/'; 
            }}
          >
            <Icon name="log-out" className="nav-icon" />
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="main-content" id="app-content">
        {renderContent()}
      </main>
    </div>
  );
}