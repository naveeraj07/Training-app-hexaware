import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import CreatePasswordScreen from './components/CreatePassword';
import SignUp from './components/SignUp';
import LoginScreen from './components/LoginScreen';
import RegisterCourse from './components/RegisterCourse';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import StudyNotes from './components/StudyNotes';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>

          {/* Default Route */}
          <Route path="/" element={<LoginScreen />} />

          {/* Auth Pages */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-password" element={<CreatePasswordScreen />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Course Registration */}
          <Route path="/register-course" element={<RegisterCourse />} />

          {/* Study Notes */}
          <Route path="/study-notes" element={<StudyNotes />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;