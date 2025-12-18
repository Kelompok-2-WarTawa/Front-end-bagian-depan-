import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import halaman User
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import EventDetail from './pages/EventDetail';
import PaymentSelect from './pages/PaymentSelect';
import PaymentInfo from './pages/PaymentInfo';
import PaymentConfirmation from './pages/PaymentConfirmation';
import PaymentCheckout from './pages/PaymentCheckout';
import PaymentBayar from './pages/PaymentBayar';
import ETicket from './pages/ETicket';

// --- IMPORT ADMIN ---
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';
import ManajemenEvent from './pages/admin/ManajementEvent';
import KategoriTiket from './pages/admin/KategoriTiket.jsx';
import Transaksi from './pages/admin/Transaksi.jsx';
import ValidasiTiket from './pages/admin/ValidasiTiket.jsx';
import EksporData from './pages/admin/EksporData.jsx';

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

        {/* Detail Event */}  
        <Route path="/event/:id" element={<EventDetail />} />

        {/* Detail ETicket */}
        <Route path="/eticket" element={<ETicket />} />

        {/* Route untuk Payment */}
        <Route path="/payment/select" element={<PaymentSelect />} />
        <Route path="/payment/info" element={<PaymentInfo />} />
        <Route path="/payment/confirmation" element={<PaymentConfirmation />} />
        <Route path="/payment/checkout" element={<PaymentCheckout />} />
        <Route path="/payment/bayar" element={<PaymentBayar />} />

        {/* --- ROUTE ADMIN --- */}
        <Route path="/admin/login" element={<AdminLogin />} />

  {/* Panel Admin (Hanya untuk halaman yang butuh Sidebar) */}
          <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="login" element={<AdminLogin />} />
          <Route path="events" element={<ManajemenEvent />} />
          <Route path="tickets" element={<KategoriTiket />} />    
          <Route path="transactions" element={<Transaksi />} />
          <Route path="validation" element={<ValidasiTiket />} />
          <Route path="export" element={<EksporData />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;