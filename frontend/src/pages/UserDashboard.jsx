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
import { getEvents } from '../utils/eventStore';

const UserDashboard = () => {
  const navigate = useNavigate();
  
  // State User & Tiket
  const [currentUser, setCurrentUser] = useState({ name: "Guest" });
  const [latestTicket, setLatestTicket] = useState(null);

  // State Event & Search
  const [recommendations, setRecommendations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // 1. Cek User Login
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      navigate('/login');
      return;
    }

    // 2. Cek Transaksi (Ambil milik user & status Lunas)
    const transactions = getAllTransactions();
    if (user) {
        const myTrx = transactions.filter(t => t.email === user.email && t.status === 'Lunas');
        if (myTrx.length > 0) {
            setLatestTicket(myTrx[myTrx.length - 1]); // Ambil transaksi terakhir
        }
    }

    // 3. AMBIL DATA EVENT
    const allEvents = getEvents();

    const formattedEvents = allEvents.map(ev => ({
        id: ev.id,
        title: ev.nama,
        talent: ev.talent || "", // Field talent untuk pencarian
        date: `${ev.jadwal} • ${ev.jam}`,
        location: `${ev.lokasi}, ${ev.kota}`,
        price: `Rp ${parseInt(ev.price).toLocaleString('id-ID')}`,
        image: ev.image,
        isAvailable: ev.status === 'Published',
        originalLocation: ev.kota || "" 
    }));

    setRecommendations(formattedEvents.slice(0, 3));
    setUpcomingEvents(formattedEvents);
    setFilteredEvents(formattedEvents); // Default: Tampilkan semua saat awal load

  }, [navigate]);

  // --- LOGIKA FILTER PENCARIAN ---
  useEffect(() => {
    // Jika tidak ada data event, skip
    if (!upcomingEvents || upcomingEvents.length === 0) return;

    if (searchTerm.trim() === "") {
        setFilteredEvents(upcomingEvents);
    } else {
        const lowerTerm = searchTerm.toLowerCase().trim();
        
        const results = upcomingEvents.filter(item => {
            const titleMatch = item.title && item.title.toLowerCase().includes(lowerTerm);
            const locMatch = item.location && item.location.toLowerCase().includes(lowerTerm);
            const talentMatch = item.talent && item.talent.toLowerCase().includes(lowerTerm);
            
            return titleMatch || locMatch || talentMatch;
        });
        setFilteredEvents(results);
    }
  }, [searchTerm, upcomingEvents]);


  // --- PERSIAPAN DATA KARTU TIKET ---
  const ticketDisplay = latestTicket ? {
      title: latestTicket.event,
      date: latestTicket.date,
      location: latestTicket.location,
      image: latestTicket.image || "https://placehold.co/150x150/111/F59E0B?text=EVENT",
      time: "Open Gate",
      seat: latestTicket.selectedSeats ? latestTicket.selectedSeats.join(', ') : "Reguler",
      invoiceID: latestTicket.invoiceID
  } : null;

  // --- FUNGSI LIHAT E-TICKET ---
  const handleViewTicket = () => {
    if (!latestTicket) return;

    // Bungkus ulang data agar E-Ticket bisa baca
    const payload = {
        invoiceID: latestTicket.invoiceID,
        paymentMethod: latestTicket.paymentMethod || latestTicket.method,
        eventData: {
            nama: latestTicket.event,
            jadwal: latestTicket.date,
            lokasi: latestTicket.location,
            image: latestTicket.image,
            jam: 'Open Gate'
        },
        userData: {
            fullName: latestTicket.user,
            email: latestTicket.email,
            phoneNumber: latestTicket.phoneNumber
        },
        ticketData: {
            selectedSeats: latestTicket.selectedSeats || [],
            qty: {
                early: latestTicket.qtyEarly || 0,
                presale: latestTicket.qtyPresale || 0,
                reguler: latestTicket.qtyReguler || 0
            }
        }
    };
    
    navigate('/eticket', { state: payload });
  };

  return (
    <>
      {/* Passing fungsi search ke Navbar */}
      <Navbar user={currentUser} onSearch={(text) => setSearchTerm(text)} />
      
      <div style={styles.heroBanner}></div>

      <div className="container" style={{paddingTop: '40px', paddingBottom: '60px'}}>
        
        {/* HEADER */}
        <div style={{textAlign: 'center', marginBottom: '60px'}}>
            <h1 style={{fontSize: '36px', marginBottom: '10px', color: 'white'}}>
                Halo, <span style={{color: '#F59E0B'}}>{currentUser.name || currentUser.fullName}!</span>
            </h1>
            <p style={{fontSize: '20px', color: '#9CA3AF', fontWeight: '300'}}>
                Siap tertawa lepas hari ini? Cek tiketmu di bawah.
            </p>
        </div>

        {/* REKOMENDASI */}
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

        {/* TIKET SAYA */}
        {ticketDisplay ? (
            <div style={{marginBottom: '40px'}}>
                <h3 style={styles.sectionTitle}>Tiket Aktif Saya</h3>
                <p style={{color: '#9CA3AF', marginTop: '-10px', marginBottom: '30px'}}>
                    Jangan lupa tunjukkan QR Code saat masuk.
                </p>
                <TicketCard 
                    title={ticketDisplay.title} 
                    date={ticketDisplay.date} 
                    location={ticketDisplay.location}
                    image={ticketDisplay.image} 
                    seat={ticketDisplay.seat}
                    invoiceID={ticketDisplay.invoiceID}
                    onAction={handleViewTicket} 
                />
            </div>
        ) : (
             <div style={{marginBottom: '40px', padding: '40px', background: '#1F2937', borderRadius: '12px', textAlign: 'center'}}>
                <h3 style={{color:'white'}}>Belum ada tiket aktif</h3>
                <p style={{color:'#9CA3AF'}}>Yuk beli tiket stand up comedy sekarang!</p>
             </div>
        )}
      </div> 
      
      {/* SECTION UPCOMING & HASIL SEARCH */}
      <div style={styles.yellowSection}>
        <div className="container">
            <h3 style={{...styles.sectionTitle, color: 'black'}}>
                {searchTerm ? `Hasil Pencarian: "${searchTerm}"` : "Upcoming Events"}
            </h3>
            
            {/* Tampilkan FILTERED EVENTS, bukan upcomingEvents */}
            {filteredEvents.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {filteredEvents.map(item => (
                        <EventRow key={item.id} {...item} />
                    ))}
                </div>
            ) : (
                <div style={{textAlign: 'center', padding: '20px', color: '#333'}}>
                    <p>Tidak ada event yang cocok dengan pencarianmu.</p>
                </div>
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