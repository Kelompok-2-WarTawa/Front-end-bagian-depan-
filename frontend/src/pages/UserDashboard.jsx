import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import TicketCard from '../components/TicketCard';
import Footer from '../components/Footer';
import { apiRequest } from '../utils/api';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({ name: "Guest" });

    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [activeTickets, setActiveTickets] = useState([]); // Tiket Lunas
    const [pendingTickets, setPendingTickets] = useState([]); // Belum Bayar

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sessionString = localStorage.getItem('warTawaSession');
                if (!sessionString) return navigate('/login');
                const user = JSON.parse(sessionString);
                setCurrentUser(user);

                // --- 1. AMBIL EVENTS ---
                const eventsData = await apiRequest('/events');

                const mappedEvents = eventsData
                    .filter(ev => ev.status === 'published')
                    .map(ev => ({
                        id: ev.id,
                        title: ev.name,
                        date: new Date(ev.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                        location: ev.venue,
                        price: (ev.phases && ev.phases.length > 0)
                            ? `Rp ${parseInt(ev.phases[0].price).toLocaleString('id-ID')}`
                            : 'TBA',
                        image: ev.image_url || "https://placehold.co/400x300/1a1a1a/F59E0B?text=Event",
                        description: ev.description,
                        totalSeats: ev.total_capacity,
                        status: ev.status,
                        isAvailable: true
                    }));
                setUpcomingEvents(mappedEvents.slice(0, 3)); // Tampilkan 3 rekomendasi

                // --- 2. AMBIL BOOKINGS USER ---
                const bookingsData = await apiRequest(`/users/${user.id}/bookings`);

                // Pisahkan Status (Case Insensitive)
                const active = bookingsData.filter(b => {
                    const s = b.status?.toLowerCase();
                    return s === 'confirmed' || s === 'checked-in' || s === 'lunas';
                });

                const pending = bookingsData.filter(b => {
                    const s = b.status?.toLowerCase();
                    return s === 'pending';
                });

                setActiveTickets(active);
                setPendingTickets(pending);

            } catch (error) {
                console.error("Dashboard Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleViewTicket = (booking) => {
        navigate('/eticket', {
            state: {
                invoiceID: booking.booking_code,
                eventData: {
                    nama: booking.event?.name,
                    jadwal: booking.event?.date,
                    lokasi: booking.event?.venue
                },
                ticketData: { selectedSeats: booking.seat_labels || [] },
                userData: { fullName: currentUser.name, email: currentUser.email }
            }
        });
    };

    const handleContinuePayment = (booking) => {
        navigate('/payment', {
            state: {
                invoiceID: booking.booking_code,
                totalAmount: booking.total_price,
                paymentMethod: "Virtual Account",
                eventData: { image: booking.event?.image_url }
            }
        });
    };

    return (
        <div style={{ backgroundColor: '#0B1120', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <Navbar user={currentUser} />

            <div style={styles.heroBanner}></div>

            <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px', flex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Halo, <span style={{ color: '#F59E0B' }}>{currentUser.name}</span>!</h1>
                    <p style={{ color: '#9CA3AF' }}>Selamat datang di dashboard tiketmu.</p>
                </div>

                {/* LOADING INDICATOR */}
                {loading && <div style={{ textAlign: 'center', padding: '20px', color: '#9CA3AF' }}>Sedang memuat data...</div>}

                {/* 1. MENUNGGU PEMBAYARAN (PENDING) */}
                {pendingTickets.length > 0 && (
                    <div style={{ marginBottom: '50px' }}>
                        <h3 style={styles.sectionTitle}>⏳ Menunggu Pembayaran</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {pendingTickets.map(ticket => (
                                <div key={ticket.booking_code} style={styles.pendingCard}>
                                    {/* Icon / Gambar Kecil */}
                                    <div style={{ fontSize: '30px', marginRight: '20px', background: '#374151', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                                        🧾
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', color: 'white' }}>
                                            {ticket.event?.name || "Event Name"}
                                        </h4>
                                        <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#9CA3AF' }}>
                                            <span>Kode: <span style={{ fontFamily: 'monospace', color: '#D1D5DB' }}>{ticket.booking_code}</span></span>
                                            <span>•</span>
                                            <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                        <p style={{ margin: '0 0 8px 0', color: '#F59E0B', fontWeight: 'bold', fontSize: '16px' }}>
                                            Rp {parseInt(ticket.total_price).toLocaleString('id-ID')}
                                        </p>
                                        <button
                                            onClick={() => handleContinuePayment(ticket)}
                                            className="btn btn-gold"
                                            style={{ fontSize: '12px', padding: '8px 16px' }}
                                        >
                                            Bayar Sekarang
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. TIKET SAYA (CONFIRMED) */}
                <div style={{ marginBottom: '60px' }}>
                    <h3 style={styles.sectionTitle}>🎫 Tiket Aktif Saya</h3>
                    {activeTickets.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {activeTickets.map(ticket => (
                                <TicketCard
                                    key={ticket.booking_code}
                                    title={ticket.event?.name}
                                    date={ticket.event?.date ? new Date(ticket.event.date).toLocaleDateString() : '-'}
                                    location={ticket.event?.venue}
                                    image={ticket.event?.image_url || "https://placehold.co/150x150"}
                                    onAction={() => handleViewTicket(ticket)}
                                />
                            ))}
                        </div>
                    ) : (
                        !loading && (
                            <div style={{ textAlign: 'center', padding: '40px', background: '#1F2937', borderRadius: '12px', color: '#9CA3AF', border: '1px dashed #374151' }}>
                                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎫</div>
                                Belum ada tiket aktif. Yuk beli tiket sekarang!
                            </div>
                        )
                    )}
                </div>

                {/* 3. REKOMENDASI / UPCOMING */}
                <h3 style={{ ...styles.sectionTitle, borderLeftColor: '#3B82F6' }}>📅 Event Terbaru</h3>
                {upcomingEvents.length > 0 ? (
                    <div style={styles.grid}>
                        {upcomingEvents.map(item => (
                            <EventCard key={item.id} {...item} />
                        ))}
                    </div>
                ) : (
                    !loading && <div style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>Belum ada event yang tersedia.</div>
                )}
            </div>
            <Footer />
        </div>
    );
};

// Styles Diperbarui untuk Dark Mode Konsisten
const styles = {
    heroBanner: { width: '100%', height: '200px', backgroundImage: 'linear-gradient(to bottom, rgba(11, 17, 32, 0.2), #0B1120), url(https://placehold.co/1200x400/222/F59E0B?text=Welcome)', backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid #1F2937' },

    sectionTitle: { fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '20px', borderLeft: '4px solid #F59E0B', paddingLeft: '15px' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' },

    // Style Baru untuk Kartu Pending (Dark Mode)
    pendingCard: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#1F2937', // Warna kartu gelap (sama dengan TicketCard)
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #374151', // Border halus
        borderLeft: '5px solid #D97706', // Aksen Orange gelap untuk status pending
        marginBottom: '15px',
        transition: 'transform 0.2s',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }
};

export default UserDashboard;
