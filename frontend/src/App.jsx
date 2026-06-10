import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import CreatePasswordScreen from './components/CreatePassword';
import SignUp from './components/SignUp';
import LoginScreen from './components/LoginScreen';
import RegisterCourse from './components/RegisterCourse';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

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
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>
          
          {/* Catch-all route to redirect unknown URLs back to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;