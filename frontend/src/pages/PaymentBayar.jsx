// src/pages/PaymentBayar.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const PaymentBayar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { invoiceID, totalAmount, paymentMethod, eventData } = location.state || {};
    const [loading, setLoading] = useState(false);

    // Fungsi Batalkan Pesanan
    const handleCancelBooking = async () => {
        if (!window.confirm("Yakin ingin membatalkan pesanan ini?")) return;

        setLoading(true);
        try {
            // POST /api/bookings/{code}/cancel
            await apiRequest(`/bookings/${invoiceID}/cancel`, 'POST');
            alert("Pesanan berhasil dibatalkan.");
            navigate('/dashboard');
        } catch (error) {
            alert("Gagal membatalkan: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCompletePayment = async () => {
        setLoading(true);
        try {
            await apiRequest(`/bookings/${invoiceID}/pay`, 'POST', {
                amount: parseFloat(totalAmount),
                method: paymentMethod || "Virtual Account"
            });

            alert("Pembayaran Berhasil! Tiket diterbitkan.");
            navigate('/dashboard');

        } catch (error) {
            alert("Gagal Bayar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!invoiceID) return <div style={{ padding: '50px', color: 'white' }}>Invalid Data. <button onClick={() => navigate('/dashboard')}>Back</button></div>;

    return (
        <div style={{ backgroundColor: '#0B1120', minHeight: '100vh', color: 'white', textAlign: 'center' }}>
            <Navbar user={{ name: "User" }} />

            {/* Banner Kecil (Opsional) */}
            {eventData?.image && (
                <div style={{ width: '100%', height: '150px', overflow: 'hidden', opacity: 0.6 }}>
                    <img src={eventData.image} alt="Event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}

            <div className="container" style={{ paddingTop: '40px', maxWidth: '500px', margin: '0 auto' }}>

                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', color: 'black', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                    <h2 style={{ color: '#0E3695', margin: 0 }}>Menunggu Pembayaran</h2>
                    <div style={{ fontSize: '40px', margin: '20px 0' }}>⏳</div>

                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Kode Booking</p>
                    <h1 style={{ fontSize: '28px', margin: '0', fontFamily: 'monospace', letterSpacing: '2px' }}>{invoiceID}</h1>

                    <div style={{ margin: '30px 0', borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc', padding: '20px 0' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total Tagihan</p>
                        <h2 style={{ color: '#F59E0B', margin: '5px 0', fontSize: '32px' }}>
                            Rp {parseInt(totalAmount).toLocaleString('id-ID')}
                        </h2>
                        <p style={{ fontSize: '12px', marginTop: '10px' }}>Metode: {paymentMethod}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button
                            onClick={handleCompletePayment}
                            disabled={loading}
                            style={{ width: '100%', padding: '15px', backgroundColor: '#0E3695', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            {loading ? 'Memproses...' : 'Simulasi Bayar Sekarang'}
                        </button>

                        <button
                            onClick={handleCancelBooking}
                            disabled={loading}
                            style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#EF4444', border: '1px solid #EF4444', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Batalkan Pesanan
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PaymentBayar;
