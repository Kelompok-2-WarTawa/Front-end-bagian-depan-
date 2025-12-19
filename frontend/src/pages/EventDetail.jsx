import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from '../utils/api'; // Integrasi API

const EventDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const eventId = location.state?.id;

    const [eventData, setEventData] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cek Session
        const sessionString = localStorage.getItem('warTawaSession');
        if (sessionString) setCurrentUser(JSON.parse(sessionString));

        if (!eventId) {
            navigate('/dashboard');
            return;
        }

        const fetchDetail = async () => {
            try {
                // GET /api/events/{id}
                const data = await apiRequest(`/events/${eventId}`);

                // Format ulang agar sesuai UI
                setEventData({
                    id: data.id,
                    title: data.name,
                    description: data.description,
                    date: new Date(data.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                    location: data.venue,
                    image: data.image_url || "https://placehold.co/400x300",
                    phases: data.phases // Array fase tiket langsung dari DB
                });

            } catch (error) {
                console.error("Error fetch detail:", error);
                alert("Gagal memuat detail event.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [eventId, navigate]);

    const handleBuyTicket = () => {
        if (!currentUser) return navigate('/login');
        // Bawa data event yang sudah lengkap ke PaymentSelect
        navigate('/payment/select', { state: { eventData: eventData } });
    };

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

    if (loading) return <div style={{ padding: '50px', color: 'white', textAlign: 'center' }}>Loading Event Detail...</div>;
    if (!eventData) return null;

    return (
        <>
            <Navbar user={currentUser} />

            <div style={styles.heroBanner}>
                <img src={eventData.image} alt="Event Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={styles.heroOverlay}></div>
            </div>

            <div style={styles.mainContainer}>
                <div className="container" style={styles.contentWrapper}>

                    {/* DESKRIPSI */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>💬 Description</div>
                        <div style={styles.cardBody}>
                            <div style={{ fontWeight: 'bold', fontSize: '24px' }}>{eventData.title}</div>
                            <p style={{ lineHeight: '1.6' }}>{eventData.description || "Tidak ada deskripsi."}</p>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoItem}>📅 {eventData.date}</div>
                                <div style={styles.infoItem}>📍 {eventData.location}</div>
                            </div>
                        </div>
                    </div>

                    {/* TIKET INFO */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>🎫 Ticket Information</div>
                        <div style={styles.cardBody}>
                            <div style={styles.ticketDropdownHeader}>Available Categories</div>

                            {/* Render Fase Tiket dari Backend */}
                            {eventData.phases && eventData.phases.map((phase) => (
                                <div key={phase.id} style={styles.ticketRow}>
                                    <div style={{ fontWeight: 'bold', fontSize: '18px', width: '130px', color: '#0E3695' }}>
                                        {formatRupiah(phase.price)}
                                    </div>
                                    <div style={{ flex: 1, paddingLeft: '20px' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                                            {phase.name}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            Quota: {phase.quota} | Ends: {new Date(phase.end_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{ ...styles.badge, backgroundColor: phase.is_active ? '#10B981' : '#6B7280' }}>
                                        {phase.is_active ? 'Active' : 'Closed'}
                                    </div>
                                </div>
                            ))}

                            <button onClick={handleBuyTicket} style={styles.buyButton}>
                                Select Seat ➔
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
};

const styles = {
    heroBanner: { width: '100%', height: '350px', position: 'relative', backgroundColor: '#000' },
    heroOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent, #F59E0B)' },
    mainContainer: { backgroundColor: '#F59E0B', minHeight: '100vh', padding: '0 20px 60px 20px', marginTop: '-50px', position: 'relative', zIndex: 10 },
    contentWrapper: { maxWidth: '800px', margin: '0 auto' },
    card: { borderRadius: '12px', overflow: 'hidden', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
    cardHeader: { backgroundColor: '#1F2937', color: 'white', padding: '15px 25px', fontSize: '20px', fontWeight: 'bold' },
    cardBody: { backgroundColor: '#FFFBEB', padding: '25px', color: '#333' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px', color: '#555' },
    infoItem: { fontWeight: '500' },
    ticketDropdownHeader: { borderBottom: '1px solid #ddd', paddingBottom: '15px', marginBottom: '15px', fontWeight: 'bold' },
    ticketRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px dashed #ccc' },
    badge: { color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    buyButton: { width: '100%', padding: '15px', marginTop: '20px', backgroundColor: '#1F2937', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }
};

export default EventDetail;
