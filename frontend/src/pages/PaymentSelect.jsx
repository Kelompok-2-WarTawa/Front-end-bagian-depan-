// src/pages/PaymentSelect.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiRequest } from '../utils/api';

const PaymentSelect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialEventData = location.state?.eventData || {};

    const [currentUser, setCurrentUser] = useState(null);
    const [eventDetail, setEventDetail] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [activePhaseId, setActivePhaseId] = useState(null);

    useEffect(() => {
        const initData = async () => {
            // 1. Cek Sesi User
            const sessionString = localStorage.getItem('warTawaSession');
            if (!sessionString) return navigate('/login');
            setCurrentUser(JSON.parse(sessionString));

            if (!initialEventData.id) return navigate('/dashboard');

            try {
                // 2. Get Detail Event (Cari fase aktif)
                const eventRes = await apiRequest(`/events/${initialEventData.id}`);
                setEventDetail(eventRes);

                // Cari fase yang sedang aktif (is_active = true)
                const activePhase = eventRes.phases.find(p => p.is_active);
                if (activePhase) {
                    setActivePhaseId(activePhase.id);
                } else {
                    // Fallback: Jika tidak ada flag is_active, ambil fase pertama
                    if (eventRes.phases.length > 0) setActivePhaseId(eventRes.phases[0].id);
                }

                // 3. Get Seats
                const seatRes = await apiRequest(`/events/${initialEventData.id}/seats`);
                // Backend returns: [{id: 1, label: "A1", is_booked: false}, ...]
                // Jika backend tidak kirim ID, kita harus mapping index atau pakai label sebagai key
                // Asumsi backend kirim 'id' untuk kursi. Jika tidak, pakai index.
                const formattedSeats = seatRes.map((s, idx) => ({
                    id: s.id || (idx + 1), // Fallback ID jika backend lupa kirim
                    label: s.label,
                    is_booked: s.is_booked
                }));
                setSeats(formattedSeats);

            } catch (error) {
                console.error("Error init:", error);
                alert("Gagal memuat data event.");
                navigate('/dashboard');
            }
        };
        initData();
    }, [initialEventData.id, navigate]);

    const handleSeatClick = (seatObj) => {
        if (!activePhaseId) return alert("Penjualan tiket belum dibuka.");
        if (seatObj.is_booked) return; 

        // Toggle Selection
        const isSelected = selectedSeats.some(s => s.id === seatObj.id);

        if (isSelected) {
            // Unselect
            setSelectedSeats(selectedSeats.filter(s => s.id !== seatObj.id));
        } else {
            // Select (Max 3)
            if (selectedSeats.length >= 3) return alert("Maksimal 3 tiket per transaksi.");
            setSelectedSeats([...selectedSeats, seatObj]);
        }
    };

    const handleNext = () => {
        if (selectedSeats.length === 0) return alert("Pilih minimal 1 kursi!");

        // Ambil info harga dari fase aktif
        const selectedPhaseObj = eventDetail.phases.find(p => p.id === activePhaseId);

        navigate('/payment/info', {
            state: {
                eventData: eventDetail,
                ticketData: {
                    phaseId: activePhaseId,
                    phaseName: selectedPhaseObj?.name || "Regular",
                    pricePerSeat: selectedPhaseObj?.price || 0,
                    selectedSeats: selectedSeats // Kirim array object kursi lengkap
                }
            }
        });
    };

    if (!eventDetail) return <div style={{ padding: '50px', color: 'white', textAlign: 'center' }}>Loading Data...</div>;

    return (
        <div style={{ backgroundColor: '#0B1120', minHeight: '100vh', color: 'white' }}>
            <Navbar user={currentUser} />
            <div className="container" style={{ paddingTop: '40px' }}>

                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2>{eventDetail.name}</h2>
                    {activePhaseId ? (
                        <div style={{ color: '#10B981', fontWeight: 'bold' }}>
                            Harga: Rp {parseInt(eventDetail.phases.find(p => p.id === activePhaseId)?.price || 0).toLocaleString('id-ID')}
                        </div>
                    ) : (
                        <div style={{ color: '#EF4444' }}>Tiket tidak tersedia (Habis/Belum Dibuka).</div>
                    )}
                </div>

                {/* LAYAR */}
                <div style={styles.screen}>SCREEN</div>

                {/* GRID KURSI */}
                <div style={styles.seatGrid}>
                    {seats.map((seat) => {
                        const isSelected = selectedSeats.some(s => s.id === seat.id);
                        // Warna: Abu (Booked), Kuning (Selected), Hijau (Available)
                        let bgColor = seat.is_booked ? '#374151' : (isSelected ? '#F59E0B' : '#10B981');
                        let cursor = seat.is_booked ? 'not-allowed' : 'pointer';

                        return (
                            <div
                                key={seat.id}
                                onClick={() => handleSeatClick(seat)}
                                style={{ ...styles.seat, backgroundColor: bgColor, cursor: cursor }}
                            >
                                {seat.label}
                            </div>
                        );
                    })}
                </div>

                {/* FOOTER TOTAL */}
                <div style={styles.footerPanel}>
                    <div>
                        <p>Kursi: {selectedSeats.map(s => s.label).join(', ')}</p>
                        <h3>Total: Rp {selectedSeats.length > 0 && activePhaseId
                            ? (selectedSeats.length * (eventDetail.phases.find(p => p.id === activePhaseId)?.price || 0)).toLocaleString('id-ID')
                            : 0}
                        </h3>
                    </div>
                    <button onClick={handleNext} style={styles.btnNext} disabled={!activePhaseId || selectedSeats.length === 0}>
                        Lanjut Isi Data ➔
                    </button>
                </div>

            </div>
        </div>
    );
};

const styles = {
    screen: { backgroundColor: '#374151', color: '#9CA3AF', padding: '10px', textAlign: 'center', marginBottom: '30px', borderRadius: '50px 50px 0 0' },
    seatGrid: { display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '10px', maxWidth: '600px', margin: '0 auto', paddingBottom: '100px' },
    seat: { height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white' },
    footerPanel: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1F2937', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #374151', zIndex: 100 },
    btnNext: { padding: '15px 30px', backgroundColor: '#F59E0B', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', color: 'black' }
};

export default PaymentSelect;
