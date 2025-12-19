import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import EventRow from '../components/EventRow';
import Footer from '../components/Footer';
import { apiRequest } from '../utils/api';

const Home = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // State Data
    const [allEvents, setAllEvents] = useState([]);
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        // 1. Cek Session User
        const sessionString = localStorage.getItem('warTawaSession');
        if (sessionString) setCurrentUser(JSON.parse(sessionString));

        const fetchEvents = async () => {
            try {
                // 2. GET Data dari Backend
                const data = await apiRequest('/events');
                console.log("RAW DATA EVENTS:", data); // Cek di Console Browser (F12)

                // Format Data agar sesuai UI
                const formatted = data
                    // PERBAIKAN: Filter lebih aman (case insensitive)
                    .filter(ev => ev.status && ev.status.toLowerCase() === 'published')
                    .map(ev => ({
                        id: ev.id,
                        title: ev.name,
                        // Safety check tanggal
                        date: ev.date ? new Date(ev.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBA',
                        location: ev.venue,
                        // Ambil harga dari fase pertama
                        price: (ev.phases && ev.phases.length > 0)
                            ? `Rp ${parseInt(ev.phases[0].price).toLocaleString('id-ID')}`
                            : 'TBA',
                        image: ev.image_url || "https://placehold.co/400x300/1a1a1a/F59E0B?text=Event",
                        description: ev.description || "",
                        totalSeats: ev.total_capacity,
                        status: ev.status,
                        isAvailable: true
                    }));

                setAllEvents(formatted);

                // Jika ada event, ambil 3 teratas. Jika kosong, array kosong.
                setFeaturedEvents(formatted.slice(0, 3));
                setFilteredEvents(formatted);

                // Cek Query Params Search
                const query = searchParams.get('q');
                if (query) handleSearch(query, formatted);

            } catch (error) {
                console.error("Gagal load events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [searchParams]);

    // Logika Search Frontend
    const handleSearch = (keyword, sourceData = allEvents) => {
        if (!keyword || keyword.trim() === '') {
            setFilteredEvents(sourceData);
        } else {
            const lowerKey = keyword.toLowerCase();
            const results = sourceData.filter(ev =>
                ev.title.toLowerCase().includes(lowerKey) ||
                ev.location.toLowerCase().includes(lowerKey)
            );
            setFilteredEvents(results);
        }

        if (keyword) {
            setTimeout(() => {
                document.getElementById('event-list')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    // --- DATA UNTUK HERO SECTION ---
    // Ambil event pertama sebagai Hero. Jika tidak ada, null.
    const heroEvent = featuredEvents.length > 0 ? featuredEvents[0] : null;

    return (
        <>
            <Navbar user={currentUser} onSearch={handleSearch} />

            {/* HERO SECTION DINAMIS */}
            <div style={{
                ...styles.hero,
                // Gunakan gambar event sebagai background, atau fallback default
                backgroundImage: heroEvent
                    ? `linear-gradient(to bottom, rgba(11,17,32,0.7), #0B1120), url(${heroEvent.image})`
                    : styles.hero.backgroundImage
            }}>
                <div className="container" style={{ textAlign: 'center', paddingTop: '60px' }}>

                    {loading ? (
                        <p style={{ color: '#9CA3AF' }}>Memuat Event...</p>
                    ) : heroEvent ? (
                        // --- KONDISI 1: ADA EVENT DI DATABASE ---
                        <>
                            <div style={{ marginBottom: '20px' }}>
                                <span style={styles.badgeFeatured}>FEATURED EVENT</span>
                            </div>

                            <h1 style={styles.heroTitle}>
                                {heroEvent.title.toUpperCase()}
                            </h1>

                            <p style={styles.heroDesc}>
                                {heroEvent.description.length > 120
                                    ? heroEvent.description.substring(0, 120) + '...'
                                    : heroEvent.description}
                            </p>

                            {/* TOMBOL DINAMIS */}
                            <div style={styles.buttonGroup}>
                                <button
                                    onClick={() => navigate(`/event/${heroEvent.id}`)}
                                    className="btn btn-gold"
                                    style={{ padding: '12px 30px', fontSize: '16px' }}
                                >
                                    Lihat Detail Event
                                </button>

                                {currentUser ? (
                                    <button onClick={() => navigate('/dashboard')} style={styles.btnOutlineHero}>
                                        Ke Dashboard Saya ➔
                                    </button>
                                ) : (
                                    <button onClick={() => navigate('/register')} style={styles.btnOutlineHero}>
                                        Daftar Sekarang
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        // --- KONDISI 2: DATABASE KOSONG (FALLBACK) ---
                        <>
                            <h1 style={styles.heroTitle}>WarTawa</h1>
                            <p style={styles.heroDesc}>Platform Tiket Komedi Terpercaya</p>

                            {/* TETAP TAMPILKAN TOMBOL NAVIGASI MESKI TIDAK ADA EVENT */}
                            <div style={styles.buttonGroup}>
                                {currentUser ? (
                                    <button onClick={() => navigate('/dashboard')} className="btn btn-gold">
                                        Ke Dashboard Saya ➔
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <button onClick={() => navigate('/login')} className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>
                                            Login
                                        </button>
                                        <button onClick={() => navigate('/register')} className="btn btn-gold">
                                            Daftar Sekarang
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                </div>
            </div>

            <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>

                {/* TOP EVENTS */}
                <div style={styles.sectionHeader}>
                    <div>
                        <h2 style={{ fontSize: '28px', margin: 0, fontWeight: 'bold' }}>🔥 Top Events</h2>
                        <p style={{ color: '#9CA3AF', margin: '5px 0', fontSize: '14px' }}>Event komedi terpanas minggu ini!</p>
                    </div>
                </div>

                {loading ? <p style={{ color: 'white' }}>Memuat event...</p> : (
                    <div style={styles.grid}>
                        {featuredEvents.length > 0 ? featuredEvents.map(item => (
                            <EventCard key={item.id} {...item} />
                        )) : (
                            <div style={{ color: '#666' }}>Belum ada event yang dipublikasikan.</div>
                        )}
                    </div>
                )}

                {/* ALL UPCOMING EVENTS / SEARCH RESULTS */}
                <div id="event-list" style={{ marginTop: '80px' }}>
                    <div style={styles.sectionHeader}>
                        <div>
                            <h2 style={{ fontSize: '28px', color: '#F59E0B', margin: '0', fontWeight: 'bold' }}>
                                {filteredEvents.length === allEvents.length ? "📅 Upcoming Events" : `🔍 Hasil Pencarian (${filteredEvents.length})`}
                            </h2>
                            <p style={{ color: '#9CA3AF', margin: '5px 0', fontSize: '14px' }}>
                                Jangan sampai kehabisan tiketnya!
                            </p>
                        </div>
                    </div>

                    <div style={styles.list}>
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map(item => (
                                <EventRow key={item.id} {...item} />
                            ))
                        ) : (
                            !loading && <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF', background: '#1F2937', borderRadius: '12px', border: '1px dashed #374151' }}>
                                <div style={{ fontSize: '30px', marginBottom: '10px' }}>😕</div>
                                Tidak ditemukan event dengan kata kunci tersebut.
                            </div>
                        )}
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
};

const styles = {
    hero: {
        height: '550px',
        backgroundColor: '#050a14',
        // Default Fallback Image
        backgroundImage: 'linear-gradient(to bottom, rgba(11,17,32,0.3), #0B1120), url(https://placehold.co/1200x600/111/333?text=WarTawa)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #1F2937'
    },
    heroTitle: {
        fontSize: '48px',
        color: 'white',
        margin: 0,
        fontWeight: '800',
        textShadow: '0 4px 10px rgba(0,0,0,0.8)',
        lineHeight: '1.2'
    },
    heroDesc: {
        color: '#D1D5DB',
        fontSize: '18px',
        maxWidth: '700px',
        margin: '15px auto',
        lineHeight: '1.6',
        textShadow: '0 2px 5px rgba(0,0,0,0.8)'
    },
    badgeFeatured: {
        backgroundColor: '#F59E0B',
        color: 'black',
        padding: '5px 12px',
        borderRadius: '20px',
        fontWeight: 'bold',
        fontSize: '12px',
        letterSpacing: '1px'
    },
    buttonGroup: {
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        marginTop: '30px',
        flexWrap: 'wrap'
    },
    btnOutlineHero: {
        padding: '12px 30px',
        fontSize: '16px',
        backgroundColor: 'transparent',
        color: 'white',
        border: '2px solid white',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: '0.3s all'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'end',
        marginBottom: '25px',
        borderBottom: '1px solid #1F2937',
        paddingBottom: '15px'
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' },
    list: { display: 'flex', flexDirection: 'column', gap: '15px' }
};

export default Home;
