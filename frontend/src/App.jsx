import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import halaman User
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

// --- IMPORT ADMIN ---
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';
import ManajemenEvent from './pages/admin/ManajementEvent';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- ROUTE PUBLIK & USER --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Halaman Dashboard (Tiket Saya) - User Biasa */}
        <Route path="/dashboard" element={<UserDashboard />} />
        
        {/* Halaman Profil (Informasi Dasar) */}
        <Route path="/profile" element={<UserProfile />} />

        {/* Route untuk Payment */}
        <Route path="/payment/select" element={<PaymentSelect />} />
        <Route path="/payment/info" element={<PaymentInfo />} />
        <Route path="/payment/confirmation" element={<PaymentConfirmation />} />
        <Route path="/payment/checkout" element={<PaymentCheckout />} />
        <Route path="/payment/bayar" element={<PaymentBayar />} />

<<<<<<< HEAD
        {/* --- ROUTE ADMIN --- */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Panel Admin (Sidebar & Layout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          {/* Rute Manajemen Event */}
          <Route path="events" element={<ManajemenEvent />} />
          
        </Route>

=======
        <Route path="/event/detail" element={<EventDetail />} />
>>>>>>> 5cb271cd29585aab8fda263793e6be24337f63a3
      </Routes>
    </Router>
  );
}

export default App;