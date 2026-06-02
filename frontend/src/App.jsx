import React from 'react';
import LoginScreen from './components/LoginScreen';
import './App.css';
import CreatePasswordScreen from './components/CreatePassword';

function App() {
  return (
    <div className="app-container">
      {/* <LoginScreen /> */}
      <CreatePasswordScreen/>
    </div>
  );
}

export default App;