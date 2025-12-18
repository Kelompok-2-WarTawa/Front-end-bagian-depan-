// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import EventRow from '../components/EventRow';
import TicketCard from '../components/TicketCard'; 
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { getAllTransactions } from '../utils/transactionStore';
import { getCurrentUser } from '../utils/authStore';
import { getEvents } from '../utils/eventStore'; // Import Event Store

const UserDashboard = () => {
  const navigate = useNavigate();
  
  // State User & Tiket
  const [currentUser, setCurrentUser] = useState({ name: "Guest" });
  const [latestTicket, setLatestTicket] = useState(null);

  // State Event
  const [recommendations, setRecommendations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    // 1. Cek User Login
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      navigate('/login');
    }

    // 2. Cek Transaksi
    const transactions = getAllTransactions();
    if (transactions.length > 0) {
        setLatestTicket(transactions[0]);
    }

    // 3. AMBIL DATA EVENT DARI STORE 
    const allEvents = getEvents();

    // Format Data agar sesuai dengan props Card
    const formattedEvents = allEvents.map(ev => ({
        id: ev.id,
        title: ev.nama,          
        date: `${ev.jadwal} • ${ev.jam}`,
        location: `${ev.lokasi}, ${ev.kota}`,
        price: `Rp ${parseInt(ev.price).toLocaleString('id-ID')}`,
        image: ev.image,
        isAvailable: ev.status === 'Published'
    }));

    // REKOMENDASI: Hanya ambil 3 teratas
    setRecommendations(formattedEvents.slice(0, 3));

    // UPCOMING: Ambil SEMUA event
    setUpcomingEvents(formattedEvents);

  }, [navigate]);

  // Data Tiket Default
  const defaultTicket = {
      title: "Comedy Night with Rising Stars",
      date: "Sabtu, 28 Des 2025",
      location: "Teater Jakarta, Jakarta",
      image: "https://placehold.co/150x150/purple/white?text=Ticket",
      time: "19:00 WIB",
      seat: "Reguler - A1",
      qrData: "DUMMY-QR",
      invoiceID: "INV-DUMMY",
      amount: "Rp 0",
      method: "-",
      user: currentUser.name,
      email: "-",
      phoneNumber: "-",
      idNumber: "-"
  };

  const ticketToShow = latestTicket ? {
      title: latestTicket.event,
      date: "Minggu, 18 April 2025",
      location: "Sabuga ITB, Bandung",
      image: "https://placehold.co/150x150/111/F59E0B?text=EVENT",
      time: "19:30 WIB",
      seat: "Reguler",
      qrData: latestTicket.invoiceID,
      invoiceID: latestTicket.invoiceID,
      amount: latestTicket.amount,
      method: latestTicket.method,
      user: latestTicket.user,
      email: latestTicket.email,
      phoneNumber: latestTicket.phoneNumber,
      idNumber: latestTicket.idNumber
  } : defaultTicket;

  const handleViewTicket = () => {
    navigate('/eticket', { state: ticketToShow });
  };

  return (
    <>
      <Navbar user={currentUser} />
      <div style={styles.heroBanner}></div>

      <div className="container" style={{paddingTop: '40px', paddingBottom: '60px'}}>
        
        {/* HEADER: NAMA USER DINAMIS */}
        <div style={{textAlign: 'center', marginBottom: '60px'}}>
            <h1 style={{fontSize: '36px', marginBottom: '10px', color: 'white'}}>
                Halo, <span style={{color: '#F59E0B'}}>{currentUser.name}!</span>
            </h1>
            <p style={{fontSize: '20px', color: '#9CA3AF', fontWeight: '300'}}>
                Siap tertawa lepas hari ini? Cek tiketmu di bawah.
            </p>
        </div>

        {/* SECTION REKOMENDASI (Top 3) */}
        <div style={{marginBottom: '80px'}}>
            <div style={styles.headerRow}>
                <h3 style={styles.sectionTitle}>Rekomendasi Untukmu</h3>
                <a href="#" style={styles.link}>View All →</a>
            </div>
            
            {recommendations.length > 0 ? (
                <div style={styles.grid}>
                    {recommendations.map(item => <EventCard key={item.id} {...item} />)}
                </div>
            ) : (
                <p style={{color: '#9CA3AF'}}>Belum ada event rekomendasi.</p>
            )}
        </div>

        {/* SECTION TIKET SAYA */}
        <div style={{marginBottom: '40px'}}>
             <h3 style={styles.sectionTitle}>Tiket Saya</h3>
             {latestTicket ? (
                <>
                    <p style={{color: '#9CA3AF', marginTop: '-10px', marginBottom: '30px'}}>Kamu Punya Tiket Aktif</p>
                    <TicketCard 
                        title={ticketToShow.title} 
                        date={ticketToShow.date} 
                        location={ticketToShow.location}
                        image={ticketToShow.image} 
                        onAction={handleViewTicket} 
                    />
                </>
             ) : (
                <div style={{padding: '40px', background: '#1F2937', borderRadius: '12px', textAlign: 'center', color: '#9CA3AF'}}>
                    Belum ada tiket yang dibeli.
                </div>
             )}
        </div>
      </div> 
      
      {/* SECTION UPCOMING (Semua Event) */}
      <div style={styles.yellowSection}>
        <div className="container">
            <h3 style={{...styles.sectionTitle, color: 'black'}}>Upcoming Events</h3>
            
            {upcomingEvents.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {upcomingEvents.map(item => (
                        <EventRow key={item.id} {...item} />
                    ))}
                </div>
            ) : (
                <p style={{color: '#333'}}>Belum ada event mendatang.</p>
            )}
        </div>
      </div>
      <Footer />
    </>
  );
};

// STYLES
const styles = {
  heroBanner: { width: '100%', height: '250px', backgroundImage: 'linear-gradient(to bottom, rgba(11, 17, 32, 0.2), #0B1120), url(https://placehold.co/1200x400/222/F59E0B?text=Dashboard+Banner)', backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid #1f2937' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '15px' },
  link: { color: '#F59E0B', textDecoration: 'none', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' },
  yellowSection: { backgroundColor: '#F59E0B', width: '100%', padding: '60px 0', color: 'black' }
};

export default UserDashboard;