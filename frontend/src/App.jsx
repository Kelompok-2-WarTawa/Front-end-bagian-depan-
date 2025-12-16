import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import halaman
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Halaman Dashboard (Tiket Saya) */}
        <Route path="/dashboard" element={<UserDashboard />} />
        
        {/* Halaman Profil (Informasi Dasar) */}
        <Route path="/profile" element={<UserProfile />} /> {/* <--- 2. Tambah Route */}
      </Routes>
    </Router>
  );
}

export default App;