// src/pages/UserDashboard.jsx
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
    const [myTickets, setMyTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sessionString = localStorage.getItem('warTawaSession');
                if (!sessionString) return navigate('/login');
                const user = JSON.parse(sessionString);
                setCurrentUser(user);

                // 1. Load Events
                const eventsData = await apiRequest('/events');

                const mappedEvents = eventsData.map(ev => ({
                    id: ev.id,
                    title: ev.name,
                    date: new Date(ev.date).toLocaleDateString(),
                    location: ev.venue,
                    price: ev.phases && ev.phases.length > 0
                        ? `Rp ${parseInt(ev.phases[0].price).toLocaleString('id-ID')}`
                        : 'TBA',
                    image: ev.image_url || "https://placehold.co/400x300/1a1a1a/F59E0B?text=Event",
                    description: ev.description,
                    totalSeats: ev.total_capacity,
                    status: ev.status,
                    isAvailable: ev.status === 'published'
                }));
                setUpcomingEvents(mappedEvents);

                // 2. Load Bookings
                const bookingsData = await apiRequest(`/users/${user.id}/bookings`);
                const confirmedBookings = bookingsData.filter(b => b.status === 'confirmed');
                setMyTickets(confirmedBookings);

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
                eventData: { nama: booking.event.name, jadwal: booking.event.date, lokasi: booking.event.venue },
                ticketData: { selectedSeats: booking.seat_labels || [] },
                userData: { fullName: currentUser.name, email: currentUser.email }
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
                    <p style={{ color: '#9CA3AF' }}>Siap tertawa lepas hari ini?</p>
                </div>

                {/* TIKET SAYA */}
                {myTickets.length > 0 && (
                    <div style={{ marginBottom: '60px' }}>
                        <h3 style={styles.sectionTitle}>🎫 Tiket Aktif Saya</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {myTickets.map(ticket => (
                                <TicketCard
                                    key={ticket.booking_code}
                                    title={ticket.event.name}
                                    date={new Date(ticket.event.date).toLocaleDateString()}
                                    location={ticket.event.venue}
                                    image={ticket.event.image_url || "https://placehold.co/150x150"}
                                    onAction={() => handleViewTicket(ticket)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* LIST EVENT */}
                <h3 style={{ ...styles.sectionTitle, color: '#F59E0B' }}>📅 Upcoming Events</h3>
                {loading ? <p>Loading events...</p> : (
                    <div style={styles.grid}>
                        {upcomingEvents.map(item => (
                            <EventCard key={item.id} {...item} />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

const styles = {
    heroBanner: { width: '100%', height: '200px', backgroundImage: 'linear-gradient(to bottom, rgba(11, 17, 32, 0.2), #0B1120), url(https://placehold.co/1200x400/222/F59E0B?text=Welcome)', backgroundSize: 'cover', backgroundPosition: 'center' },
    sectionTitle: { fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '20px', borderLeft: '4px solid #F59E0B', paddingLeft: '15px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }
};

export default UserDashboard;
