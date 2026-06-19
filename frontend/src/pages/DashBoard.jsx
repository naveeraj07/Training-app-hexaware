import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService.js';
import Icon from '../components/Icon';
import Home from '../pages/Home';
import Course from '../pages/Course';
import Schedule from '../pages/Schedule';
import Placeholder from '../pages/Placeholder';
import ProgressView from './ProgressView.jsx';

export default function DashBoard() {
  const profile = dashboardService.getUserProfile();
  
  // Hash routing state
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.substring(1);
    return hash || 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      setCurrentRoute(hash || 'home');
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Set default hash to #home if none is present
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
        return <Course />;
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