// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import EventRow from '../components/EventRow';
import TicketCard from '../components/TicketCard'; 
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { getAllTransactions } from '../utils/transactionStore';
import { getCurrentUser } from '../utils/authStore'; // 1. IMPORT AUTH STORE

const UserDashboard = () => {
  const navigate = useNavigate();
  
  // 2. STATE UNTUK USER & TIKET
  const [currentUser, setCurrentUser] = useState({ name: "Guest" });
  const [latestTicket, setLatestTicket] = useState(null);

  // 3. EFFECT: AMBIL DATA USER & TRANSAKSI SAAT LOAD
  useEffect(() => {
    // Ambil User yang sedang login
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      // Jika belum login, tendang ke halaman login
      navigate('/login');
    }

    // Ambil Transaksi Terakhir
    const transactions = getAllTransactions();
    if (transactions.length > 0) {
        setLatestTicket(transactions[0]);
    }
  }, [navigate]);

  // Data Tiket Default (Fallback)
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

  // Persiapan Data untuk dikirim ke E-Ticket
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

  // --- Data Dummy Rekomendasi ---
  const recommendations = [
    { id: 1, title: "Bell's Comedy Club", date: "Jumat, 12 Des 2025 • 20.00", location: "Balai Sarbini, Jakarta", price: "Rp 150.000", image: "https://placehold.co/400x300/1a1a1a/F59E0B?text=Comedy+Club" },
    { id: 2, title: "Open Mic Night", date: "Minggu, 14 Des 2025", location: "The Hall, Bandung", price: "Rp 75.000", image: "https://placehold.co/400x300/1a1a1a/F59E0B?text=Open+Mic" },
    { id: 3, title: "Comedy Kings Tour", date: "Sabtu, 14 Des 2025", location: "Grand City, Surabaya", price: "Rp 125.000", image: "https://placehold.co/400x300/1a1a1a/F59E0B?text=Comedy+Tour" }
  ];

  const upcomingEvents = [
    { id: 101, title: "Laugh Out Loud Fest", date: "Minggu, 21 Des 2025", location: "Sabuga, Bandung", price: "Rp 125.000", image: "https://placehold.co/200x150/white/black?text=LOL+Fest", isAvailable: true },
    { id: 102, title: "Weekend Comedy Club", date: "Sabtu, 27 Des 2025", location: "Plaza Surabaya", price: "Rp 175.000", image: "https://placehold.co/200x150/red/white?text=Weekend+Club", isAvailable: false },
    { id: 103, title: "Standup Indo Jakpus", date: "Sabtu, 27 Des 2025", location: "Usmar Ismail Hall", price: "Rp 175.000", image: "https://placehold.co/200x150/purple/white?text=Standup+Jakpus", isAvailable: true }
  ];

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

        {/* SECTION REKOMENDASI */}
        <div style={{marginBottom: '80px'}}>
            <div style={styles.headerRow}>
                <h3 style={styles.sectionTitle}>Rekomendasi Untukmu</h3>
                <a href="#" style={styles.link}>View All →</a>
            </div>
            <div style={styles.grid}>
                {recommendations.map(item => <EventCard key={item.id} {...item} />)}
            </div>
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
      
      {/* SECTION UPCOMING */}
      <div style={styles.yellowSection}>
        <div className="container">
            <h3 style={{...styles.sectionTitle, color: 'black'}}>Upcoming Events</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                {upcomingEvents.map(item => <EventRow key={item.id} {...item} />)}
            </div>
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