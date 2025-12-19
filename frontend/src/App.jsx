import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORT HALAMAN USER ---
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';

// Detail Event & E-Ticket
import DetailEvent from './pages/EventDetail';
import ETicket from './pages/ETicket';

// --- IMPORT PAYMENT STEPS ---
import PaymentSelect from './pages/PaymentSelect';
import PaymentInfo from './pages/PaymentInfo';
import PaymentConfirmation from './pages/PaymentConfirmation';
import PaymentCheckout from './pages/PaymentCheckout';
import PaymentBayar from './pages/PaymentBayar';

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

                {/* --- DASHBOARD & PROFILE USER --- */}
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/profile" element={<UserProfile />} />

                {/* --- FLOW PEMBELIAN TIKET --- */}
                {/* PENTING: Menggunakan Parameter ID (:id) */}
                <Route path="/event/:id" element={<DetailEvent />} />

                <Route path="/payment/select" element={<PaymentSelect />} />
                <Route path="/payment/info" element={<PaymentInfo />} />
                <Route path="/payment/confirmation" element={<PaymentConfirmation />} />
                <Route path="/payment/checkout" element={<PaymentCheckout />} />
                <Route path="/payment" element={<PaymentBayar />} />

                {/* --- E-TICKET --- */}
                <Route path="/eticket" element={<ETicket />} />


                {/* --- ROUTE KHUSUS ADMIN --- */}

                {/* 1. Login Admin (Tanpa Sidebar) */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* 2. Panel Admin (Dengan Sidebar) */}
                <Route path="/admin" element={<AdminLayout />}>

                    {/* A. Redirect Otomatis: /admin -> /admin/dashboard */}
                    <Route index element={<Navigate to="dashboard" replace />} />

                    {/* B. Halaman Dashboard Utama (/admin/dashboard) */}
                    <Route path="dashboard" element={<AdminDashboard />} />

                    {/* C. Menu Lainnya */}
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
