import React, { useState } from 'react';
import './LoginScreen.css';

export default function LoginScreen() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login/authentication logic here
    console.log('Submitted email:', email);
  };

  return (
    <div className="login-container">

      <div className="login-content">
        {/* Left Side: Branding */}
        <div className="brand-section">
          <h1 className="brand-logo">Hexaware</h1>
          <p className="brand-tagline">Learn, build, and grow with every login.</p>
        </div>

        {/* Right Side: Card Form */}
        <div className="card-section">
          <div className="login-card">
            <h2 className="card-title">Welcome to Hexaware</h2>
            <h3 className="card-heading">Let's Get Started</h3>
            <p className="card-subheading">Enter your email address to continue</p>

            <form onSubmit={handleSubmit} className="login-form">
              <label htmlFor="email" className="input-label">EMAIL ADDRESS</label>
              <div className="input-field-wrapper">
                {/* SVG Mail Icon */}
                <svg className="mail-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615m19.5 0A2.25 2.25 0 0 0 19.5 4.5" />
                </svg>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="submit-button">Continue</button>
            </form>

            <p className="terms-text">
              By continuing, you agree to our <br />
              <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}