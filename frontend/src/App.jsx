import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import CreatePasswordScreen from './components/CreatePassword';
import SignUp from './components/SignUp';
import LoginScreen from './components/LoginScreen';
import RegisterCourse from './components/RegisterCourse';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Default route (Base URL) loads the Login screen */}
          <Route path="/" element={<LoginScreen />} />
          
          {/* Specific paths for each of your screens */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-password" element={<CreatePasswordScreen />} />
          <Route path="/register-course" element={<RegisterCourse />} />
          
          {/* Catch-all route to redirect unknown URLs back to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;