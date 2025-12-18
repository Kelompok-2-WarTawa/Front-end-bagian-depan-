import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- IMPORT HALAMAN USER ---
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';

// Detail Event & E-Ticket
import DetailEvent from './pages/EventDetail'; // Pastikan nama file sesuai
import ETicket from './pages/ETicket';

// --- IMPORT PAYMENT STEPS (ALUR BARU) ---
import PaymentSelect from './pages/PaymentSelect'; // Select Seat
import PaymentInfo from './pages/PaymentInfo'; // Data Diri
import PaymentConfirmation from './pages/PaymentConfirmation'; // Konfirmasi
import PaymentCheckout from './pages/PaymentCheckout'; // Checkout
import PaymentBayar from './pages/PaymentBayar';         // Invoice / Countdown

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
        {/* --- ROUTE PUBLIK & AUTH --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* --- DASHBOARD & PROFILE --- */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* --- FLOW PEMBELIAN TIKET --- */}
        {/* 1. Detail Event (Klik Order Now di sini) */}
        <Route path="/event/detail" element={<DetailEvent />} />

        {/* 2. Empat Tahapan Payment */}
        <Route path="/payment/select" element={<PaymentSelect />} />
        <Route path="/payment/info" element={<PaymentInfo />} />
        <Route path="/payment/confirmation" element={<PaymentConfirmation />} />
        <Route path="/payment/checkout" element={<PaymentCheckout />} />

        {/* 3. Halaman Akhir (Invoice & Countdown) */}
        <Route path="/payment" element={<PaymentBayar />} />

        {/* --- E-TICKET (Setelah Bayar) --- */}
        <Route path="/eticket" element={<ETicket />} />
        

        {/* --- ROUTE ADMIN --- */}
        {/* Login Admin (Di luar Layout agar tidak ada Sidebar) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Panel Admin (Dilindungi Layout Sidebar) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
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