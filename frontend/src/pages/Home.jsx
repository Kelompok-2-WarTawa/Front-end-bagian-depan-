import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import EventRow from '../components/EventRow';
import Footer from '../components/Footer';
import { apiRequest } from '../utils/api'; // Integrasi API

const Home = () => {
    const navigate = useNavigate();
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cek Session
        const sessionString = localStorage.getItem('warTawaSession');
        if (sessionString) setCurrentUser(JSON.parse(sessionString));

        const fetchEvents = async () => {
            try {
                // GET /api/events
                const data = await apiRequest('/events');

                // Filter hanya yang Published
                const publishedEvents = data.filter(ev => ev.status === 'published');

                // Format Data untuk UI
                const formatted = publishedEvents.map(ev => ({
                    id: ev.id,
                    title: ev.name,
                    date: new Date(ev.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                    location: ev.venue,
                    // Ambil harga dari fase pertama jika ada
                    price: ev.phases[0] ? `Rp ${parseInt(ev.phases[0].price).toLocaleString('id-ID')}` : 'TBA',
                    image: ev.image_url || "https://placehold.co/400x300/1a1a1a/F59E0B?text=Event",
                    description: ev.description,
                    totalSeats: ev.total_capacity,
                    isAvailable: true
                }));

                // Pisahkan untuk UI (Logic sederhana: 3 pertama jadi Top Events)
                setFeaturedEvents(formatted.slice(0, 3));
                setUpcomingEvents(formatted);

            } catch (error) {
                console.error("Gagal load events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <>
            <Navbar user={currentUser} />

            {/* HERO SECTION */}
            <div style={styles.hero}>
                <div className="container" style={{ textAlign: 'center', paddingTop: '80px' }}>
                    <p style={{ letterSpacing: '5px', marginBottom: '10px' }}>EKRESA</p>
                    <h1 style={styles.heroTitle}>CERITA ANEHKU</h1>
                    <p>Sebuah pertunjukan komedi oleh Raditya Dika</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn btn-gold"
                        style={{ marginTop: '20px' }}
                    >
                        Lihat Detail
                    </button>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>

                {/* SECTION 1: TOP EVENTS */}
                <div style={styles.sectionHeader}>
                    <div>
                        <h2 style={{ fontSize: '24px', margin: 0 }}>Top Events</h2>
                        <p style={{ color: '#9CA3AF', margin: '5px 0' }}>Event komedi terpanas minggu ini!</p>
                    </div>
                </div>

                {loading ? <p style={{ color: 'white' }}>Memuat event...</p> : (
                    <div style={styles.grid}>
                        {featuredEvents.map(item => (
                            <EventCard key={item.id} {...item} />
                        ))}
                    </div>
                )}

                {/* SECTION 2: UPCOMING EVENTS */}
                <div style={{ marginTop: '60px' }}>
                    <h2 style={{ fontSize: '24px', color: '#F59E0B', marginBottom: '20px' }}>Upcoming Events</h2>
                    <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>Amankan kursimu sekarang!</p>

                    <div style={styles.list}>
                        {upcomingEvents.map(item => (
                            <EventRow key={item.id} {...item} />
                        ))}
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
};

const styles = {
    hero: {
        height: '400px',
        backgroundColor: '#050a14',
        backgroundImage: 'linear-gradient(to bottom, rgba(11,17,32,0.3), #0B1120), url(https://placehold.co/1200x600/111/333?text=Hero+Banner)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white'
    },
    heroTitle: {
        fontSize: '64px',
        color: '#F59E0B',
        margin: 0,
        fontWeight: '800'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'end',
        marginBottom: '20px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    }
};

export default Home;
