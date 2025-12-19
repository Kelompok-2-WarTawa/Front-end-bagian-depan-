// src/pages/PaymentCheckout.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const PaymentCheckout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { eventData, ticketData, userData, paymentMethod } = location.state || {};
    const [loading, setLoading] = useState(false);

    if (!eventData || !ticketData) {
        return <div style={{ padding: '50px' }}>Data missing. <button onClick={() => navigate('/dashboard')}>Back</button></div>;
    }

    const currentUser = JSON.parse(localStorage.getItem('warTawaSession'));
    const totalHarga = ticketData.selectedSeats.length * ticketData.pricePerSeat;

    const handlePayNow = async () => {
        setLoading(true);
        try {
            // --- REQUEST KE BACKEND ---
            // Payload: { event_id, phase_id, quantity, seat_ids: [1, 2] }
            const payload = {
                event_id: eventData.id,
                phase_id: ticketData.phaseId,
                quantity: ticketData.selectedSeats.length,
                seat_ids: ticketData.selectedSeats.map(s => s.id) // Map object kursi ke Array ID
            };

            const response = await apiRequest('/bookings', 'POST', payload);

            // Jika Sukses, Backend return Booking Code
            navigate('/payment', {
                state: {
                    invoiceID: response.booking_code,
                    totalAmount: response.total_price,
                    paymentMethod: paymentMethod,
                    bookingData: response
                }
            });

        } catch (error) {
            alert("Gagal Booking: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#0B1120', minHeight: '100vh', color: 'white' }}>
            <Navbar user={currentUser} />
            <div className="container" style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>

                <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Review Pesanan</h2>

                <div style={{ backgroundColor: '#1F2937', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                    <h3>{eventData.name}</h3>
                    <p>📅 {new Date(eventData.date).toLocaleDateString()}</p>
                    <p>📍 {eventData.venue}</p>
                    <hr style={{ borderColor: '#374151' }} />
                    <p>Tiket: {ticketData.selectedSeats.length}x {ticketData.phaseName}</p>
                    <p>Kursi: <b>{ticketData.selectedSeats.map(s => s.label).join(', ')}</b></p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
                    <span>Total Bayar</span>
                    <span style={{ color: '#F59E0B' }}>Rp {totalHarga.toLocaleString('id-ID')}</span>
                </div>

                <button
                    onClick={handlePayNow}
                    disabled={loading}
                    style={{ width: '100%', padding: '15px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    {loading ? 'Memproses...' : 'Bayar Sekarang'}
                </button>

            </div>
        </div>
    );
};

export default PaymentCheckout;
