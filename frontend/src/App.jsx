import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import halaman-halaman
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile'; // <--- 1. Import ini

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        
        {/* 2. Tambahkan Route Profile */}
        <Route path="/profile" element={<UserProfile />} /> 
      </Routes>
    </Router>
  );
}

export default App;