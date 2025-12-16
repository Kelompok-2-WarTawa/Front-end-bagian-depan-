import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import halaman
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import PaymentSelect from './pages/PaymentSelect';
import PaymentInfo from './pages/PaymentInfo';
import PaymentConfirmation from './pages/PaymentConfirmation';
import PaymentCheckout from './pages/PaymentCheckout';
import PaymentBayar from './pages/PaymentBayar';
import EventDetail from './pages/EventDetail';

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

        {/* Route Baru untuk Payment */}
        <Route path="/payment/select" element={<PaymentSelect />} />

        {/* Route Tahap 2 (BARU) */}
        <Route path="/payment/info" element={<PaymentInfo />} />

        <Route path="/payment/confirmation" element={<PaymentConfirmation />} />

        <Route path="/payment/checkout" element={<PaymentCheckout />} />

        <Route path="/payment/bayar" element={<PaymentBayar />} />

        <Route path="/event/detail" element={<EventDetail />} />
      </Routes>
    </Router>
  );
}

export default App;