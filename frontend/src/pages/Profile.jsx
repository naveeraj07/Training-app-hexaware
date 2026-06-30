import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
// Make sure to import your components correctly
// import Icon from '../components/Icon'; 
// import dashboardService from '../services/dashboardService.js';

export default function Profile() {
  const [expandedSection, setExpandedSection] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const { isDarkMode, toggleTheme } = useTheme();
  const darkModeEnabled = isDarkMode;

  const [profileData, setProfileData] = useState({
    name: "Loading...",
    email: "Loading..."
  });

  // Get userId from localStorage
  const userId = Number(localStorage.getItem('logged_in_user_id')) || 1;

  // Fetch profile data from backend on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // const data = await dashboardService.getProfileViewData(userId);
        // Using mock data here for demonstration
        const data = { name: "John Doe", email: "john@example.com" };
        if (data) {
          setProfileData(data);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setProfileData({
          name: user.employee_id || user.name || 'Student',
          email: user.email || 'student@example.com'
        });
      }
    };

    fetchProfileData();
  }, [userId]);



  const userName = profileData.name;
  const userEmail = profileData.email;

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleLogout = () => {
    localStorage.removeItem('logged_in_user_id');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // --- THEME CONFIGURATION ---
  // We define dynamic colors based on the darkModeEnabled state
  const theme = {
    bgApp: darkModeEnabled ? '#0f172a' : '#f8fafc',
    bgCard: darkModeEnabled ? '#1e293b' : 'white',
    bgExpanded: darkModeEnabled ? '#0f172a' : '#f8fafc',
    bgHover: darkModeEnabled ? '#334155' : '#f8fafc',
    textMain: darkModeEnabled ? '#f8fafc' : '#1e293b',
    textSub: darkModeEnabled ? '#94a3b8' : '#64748b',
    borderColor: darkModeEnabled ? '#334155' : '#e2e8f0',
  };

  return (
    <div style={{ padding: '0', minHeight: '100vh', background: theme.bgApp, transition: 'background 0.3s ease' }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #3563e9 0%, #254dd0 100%)',
        padding: '40px 30px',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 8px 24px rgba(53, 99, 233, 0.2)',
        marginBottom: '30px'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '32px',
          fontWeight: '700',
          margin: '0',
          letterSpacing: '-0.5px'
        }}>
          Profile
        </h1>
      </div>

      {/* Main Content */}
      <div style={{ padding: '0 30px', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Profile Card */}
        <div style={{
          background: theme.bgCard,
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          marginBottom: '30px',
          border: `1px solid ${theme.borderColor}`,
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3563e9, #254dd0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '28px',
              fontWeight: '700'
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{
                margin: '0 0 5px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: theme.textMain,
                transition: 'color 0.3s ease'
              }}>
                {userName}
              </h2>
              <p style={{
                margin: '0',
                fontSize: '14px',
                color: theme.textSub,
                transition: 'color 0.3s ease'
              }}>
                {userEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Account Settings Section */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: theme.textMain,
            marginBottom: '15px',
            letterSpacing: '0.5px',
            transition: 'color 0.3s ease'
          }}>
            Account Settings
          </h3>

          {/* Personal Details */}
          <div style={{
            background: theme.bgCard,
            borderRadius: '12px',
            marginBottom: '12px',
            border: `1px solid ${theme.borderColor}`,
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}>
            <button
              onClick={() => toggleSection('personal')}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'background 150ms ease-out'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = theme.bgHover}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: darkModeEnabled ? '#1e3a8a' : '#eef2ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3563e9',
                  fontSize: '16px'
                }}>
                  👤
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme.textMain
                }}>
                  Personal Details
                </span>
              </div>
              <span style={{
                color: theme.textSub,
                fontSize: '18px',
                transform: expandedSection === 'personal' ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 300ms ease-out'
              }}>
                ›
              </span>
            </button>
            
            {expandedSection === 'personal' && (
              <div style={{
                padding: '16px 20px',
                borderTop: `1px solid ${theme.borderColor}`,
                background: theme.bgExpanded
              }}>
                <p style={{
                  fontSize: '13px',
                  color: theme.textSub,
                  margin: '0',
                  lineHeight: '1.6'
                }}>
                  Update your personal information including name, email, and contact details.
                </p>
              </div>
            )}
          </div>

          {/* Passwords */}
          <div style={{
            background: theme.bgCard,
            borderRadius: '12px',
            marginBottom: '12px',
            border: `1px solid ${theme.borderColor}`,
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}>
            <button
              onClick={() => toggleSection('password')}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'background 150ms ease-out'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = theme.bgHover}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: darkModeEnabled ? '#14532d' : '#f0fdf4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#22c55e',
                  fontSize: '16px'
                }}>
                  🔐
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme.textMain
                }}>
                  Passwords
                </span>
              </div>
              <span style={{
                color: theme.textSub,
                fontSize: '18px',
                transform: expandedSection === 'password' ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 300ms ease-out'
              }}>
                ›
              </span>
            </button>
            
            {expandedSection === 'password' && (
              <div style={{
                padding: '16px 20px',
                borderTop: `1px solid ${theme.borderColor}`,
                background: theme.bgExpanded
              }}>
                <p style={{
                  fontSize: '13px',
                  color: theme.textSub,
                  margin: '0',
                  lineHeight: '1.6'
                }}>
                  Change or update your password to keep your account secure.
                </p>
              </div>
            )}
          </div>

          {/* Mode (Dark Mode Toggle) */}
          <div style={{
            background: theme.bgCard,
            borderRadius: '12px',
            marginBottom: '12px',
            border: `1px solid ${theme.borderColor}`,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: darkModeEnabled ? '#78350f' : '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
                fontSize: '16px'
              }}>
                ✨
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: theme.textMain
              }}>
                Dark Mode
              </span>
            </div>
            <button
              onClick={() => toggleTheme()}
              style={{
                width: '48px',
                height: '28px',
                borderRadius: '14px',
                border: 'none',
                background: darkModeEnabled ? '#3563e9' : '#cbd5e1',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 300ms ease-out',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: darkModeEnabled ? '24px' : '4px'
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'white',
                transition: 'all 300ms ease-out'
              }}></div>
            </button>
          </div>

          {/* Notifications Toggle */}
          <div style={{
            background: theme.bgCard,
            borderRadius: '12px',
            marginBottom: '12px',
            border: `1px solid ${theme.borderColor}`,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: darkModeEnabled ? '#1e3a8a' : '#e0e7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3563e9',
                fontSize: '16px'
              }}>
                🔔
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: theme.textMain
              }}>
                Notifications
              </span>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              style={{
                width: '48px',
                height: '28px',
                borderRadius: '14px',
                border: 'none',
                background: notificationsEnabled ? '#3563e9' : '#cbd5e1',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 300ms ease-out',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: notificationsEnabled ? '24px' : '4px'
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'white',
                transition: 'all 300ms ease-out'
              }}></div>
            </button>
          </div>

          {/* Logout */}
          <div style={{
            background: theme.bgCard,
            borderRadius: '12px',
            border: `1px solid ${theme.borderColor}`,
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}>
            <button
              onClick={() => toggleSection('logout')}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'background 150ms ease-out'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = theme.bgHover}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: darkModeEnabled ? '#7f1d1d' : '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444',
                  fontSize: '16px'
                }}>
                  🚪
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme.textMain
                }}>
                  Logout
                </span>
              </div>
              <span style={{
                color: theme.textSub,
                fontSize: '18px',
                transform: expandedSection === 'logout' ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 300ms ease-out'
              }}>
                ›
              </span>
            </button>
            
            {expandedSection === 'logout' && (
              <div style={{
                padding: '16px 20px',
                borderTop: `1px solid ${theme.borderColor}`,
                background: theme.bgExpanded
              }}>
                <p style={{
                  fontSize: '13px',
                  color: theme.textSub,
                  margin: '0 0 12px 0',
                  lineHeight: '1.6'
                }}>
                  Sign out from your account. You'll need to log in again to access your profile.
                </p>
                <button
                  onClick={handleLogout}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 250ms ease-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#dc2626';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ef4444';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Confirm Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}