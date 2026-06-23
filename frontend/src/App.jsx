import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import CreatePasswordScreen from './pages/CreatePassword';
import SignUp from './pages/SignUp';
import LoginScreen from './pages/LoginScreen';
import RegisterCourse from './pages/RegisterCourse';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DashBoard from './pages/DashBoard';
function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-password" element={<CreatePasswordScreen />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register-course" element={<RegisterCourse />} />
          <Route path="/dashboard" element={<DashBoard/>}/>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;