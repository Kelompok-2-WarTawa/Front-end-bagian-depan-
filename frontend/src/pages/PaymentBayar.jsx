// src/pages/PaymentBayar.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const PaymentBayar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { invoiceID, totalAmount, paymentMethod } = location.state || {};
    const [loading, setLoading] = useState(false);

    const handleCompletePayment = async () => {
        setLoading(true);
        try {
            // Call API Pay
            await apiRequest(`/bookings/${invoiceID}/pay`, 'POST', {
                amount: parseFloat(totalAmount),
                method: paymentMethod || "Virtual Account"
            });

            alert("Pembayaran Berhasil! Tiket diterbitkan.");

            // Redirect ke Dashboard untuk lihat tiket
            navigate('/dashboard');

        } catch (error) {
            alert("Gagal Bayar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!invoiceID) return <div>Invalid Data</div>;

    return (
        <div style={{ backgroundColor: '#0B1120', minHeight: '100vh', color: 'white', textAlign: 'center' }}>
            <Navbar user={{ name: "User" }} />
            <div className="container" style={{ paddingTop: '60px', maxWidth: '500px', margin: '0 auto' }}>

                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', color: 'black' }}>
                    <h2 style={{ color: '#0E3695' }}>Menunggu Pembayaran</h2>
                    <p style={{ fontSize: '14px', color: '#666' }}>Kode Booking</p>
                    <h1 style={{ fontSize: '32px', margin: '5px 0' }}>{invoiceID}</h1>

                    <div style={{ margin: '30px 0', borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc', padding: '20px 0' }}>
                        <p>Total Tagihan</p>
                        <h2 style={{ color: '#F59E0B' }}>Rp {parseInt(totalAmount).toLocaleString('id-ID')}</h2>
                    </div>

                    <button
                        onClick={handleCompletePayment}
                        disabled={loading}
                        style={{ width: '100%', padding: '15px', backgroundColor: '#0E3695', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        {loading ? 'Memproses...' : 'Simulasi Bayar Sekarang'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PaymentBayar;
