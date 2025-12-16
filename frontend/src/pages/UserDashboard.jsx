// src/pages/UserDashboard.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import EventRow from '../components/EventRow';
import TicketCard from '../components/TicketCard'; 
import Footer from '../components/Footer';

const UserDashboard = () => {
  // Simulasi User Login
  const currentUser = { name: "Sutejo" };

  // Data Dummy Ticket
  const myTicket = {
      id: 99,
      title: "Comedy Night with Rising Stars",
      date: "Sabtu, 28 Des 2025",
      location: "Teater Jakarta, Jakarta",
      image: "https://placehold.co/150x150/purple/white?text=Ticket"
  };

  // Data Dummy Rekomendasi
  const recommendations = [
    {
      id: 1,
      title: "Bell's Comedy Club",
      date: "Jumat, 12 Des 2025 • 20.00",
      location: "Balai Sarbini, Jakarta",
      price: "Rp 150.000",
      image: "https://placehold.co/400x300/1a1a1a/F59E0B?text=Comedy+Club"
    },
    {
      id: 2,
      title: "Open Mic Night",
      date: "Minggu, 14 Des 2025",
      location: "The Hall, Bandung",
      price: "Rp 75.000",
      image: "https://placehold.co/400x300/1a1a1a/F59E0B?text=Open+Mic"
    },
    {
        id: 3,
        title: "Comedy Kings Tour",
        date: "Sabtu, 14 Des 2025",
        location: "Grand City, Surabaya",
        price: "Rp 125.000",
        image: "https://placehold.co/400x300/1a1a1a/F59E0B?text=Comedy+Tour"
      }
  ];

  // Data Dummy Upcoming
  const upcomingEvents = [
    {
      id: 101, title: "Laugh Out Loud Fest", date: "Minggu, 21 Des 2025", location: "Sabuga, Bandung",
      price: "Rp 125.000", image: "https://placehold.co/200x150/white/black?text=LOL+Fest", isAvailable: true
    },
    {
      id: 102, title: "Weekend Comedy Club", date: "Sabtu, 27 Des 2025", location: "Plaza Surabaya",
      price: "Rp 175.000", image: "https://placehold.co/200x150/red/white?text=Weekend+Club", isAvailable: false
    },
    {
      id: 103, title: "Standup Indo Jakpus", date: "Sabtu, 27 Des 2025", location: "Usmar Ismail Hall",
      price: "Rp 175.000", image: "https://placehold.co/200x150/purple/white?text=Standup+Jakpus", isAvailable: true
    }
  ];

  return (
    <>
      <Navbar user={currentUser} />

      {/* --- 1. HERO BANNER (GAMBAR SAJA) --- */}
      <div style={styles.heroBanner}>
        {/* Kosong, hanya gambar background dekoratif */}
      </div>

      <div className="container" style={{paddingTop: '40px', paddingBottom: '60px'}}>
        
        {/* --- 2. SAPAAN USER (DIPINDAH KESINI) --- */}
        <div style={{textAlign: 'center', marginBottom: '60px'}}>
            <h1 style={{fontSize: '36px', marginBottom: '10px', color: 'white'}}>
                Halo, <span style={{color: '#F59E0B'}}>{currentUser.name}!</span>
            </h1>
            <p style={{fontSize: '20px', color: '#9CA3AF', fontWeight: '300'}}>
                Siap tertawa lepas hari ini? Cek tiketmu di bawah.
            </p>
        </div>

        {/* Section: Rekomendasi */}
        <div style={{marginBottom: '80px'}}>
            <div style={styles.headerRow}>
                <h3 style={styles.sectionTitle}>Rekomendasi Untukmu</h3>
                <a href="#" style={styles.link}>View All →</a>
            </div>
            <p style={{color: '#9CA3AF', marginTop: '-10px', marginBottom: '30px'}}>Check out this week's hottest performances!</p>
            
            <div style={styles.grid}>
                {recommendations.map(item => (
                    <EventCard key={item.id} {...item} />
                ))}
            </div>
        </div>

        {/* Section: Tiket Saya */}
        <div style={{marginBottom: '40px'}}>
             <h3 style={styles.sectionTitle}>Tiket Saya</h3>
             <p style={{color: '#9CA3AF', marginTop: '-10px', marginBottom: '30px'}}>
                Kamu Punya 1 Tiket Event yang Akan Mendatang
             </p>
             <TicketCard {...myTicket} />
        </div>

      </div> 

      {/* Section Upcoming (Full Width Kuning) */}
      <div style={styles.yellowSection}>
        <div className="container">
            <h3 style={{...styles.sectionTitle, color: 'black'}}>Upcoming Events</h3>
            <p style={{color: '#333', marginTop: '-10px', marginBottom: '30px'}}>Secure Your Seat for Laughs</p>

            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                {upcomingEvents.map(item => (
                    <EventRow key={item.id} {...item} />
                ))}
            </div>

            <div style={{textAlign: 'center', marginTop: '40px'}}>
                <button className="btn btn-blue" style={{padding: '12px 30px'}}>
                    Explore More Events &gt;
                </button>
            </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

const styles = {
  // HERO BANNER STYLE (Diupdate: Tinggi dikurangi sedikit biar proporsional)
  heroBanner: {
    width: '100%',
    height: '250px', // Sedikit lebih pendek karena teksnya sudah turun
    backgroundImage: 'linear-gradient(to bottom, rgba(11, 17, 32, 0.2), #0B1120), url(https://placehold.co/1200x400/222/F59E0B?text=Dashboard+Banner)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderBottom: '1px solid #1f2937'
  },

  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '15px' },
  link: { color: '#F59E0B', textDecoration: 'none', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' },
  
  yellowSection: {
      backgroundColor: '#F59E0B', 
      width: '100%',
      padding: '60px 0',
      color: 'black'
  }
};

export default UserDashboard;