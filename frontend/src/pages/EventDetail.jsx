// src/pages/EventDetail.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const EventDetail = () => {
  const navigate = useNavigate();
  const currentUser = { name: "Sutejo" };

  // Data Dummy Event (Sesuai Gambar)
  const eventData = {
    title: "Cerita Anehku",
    performer: "Raditya Dika",
    date: "Minggu, 18 April 2025",
    time: "19.30 WIB",
    location: "Sabuga ITB, Bandung",
    seats: "150 Kursi Tersedia",
    description: "Cerita Anehku adalah sebuah pertunjukan standup comedy oleh Raditya Dika dilanjutkan dengan interaksi bersama penonton.",
    image: "https://placehold.co/1200x400/111/F59E0B?text=BANNER+RADITYA+DIKA", // Ganti dengan URL gambar asli jika ada
    tickets: [
      { type: "Reguler", price: 100000, status: "Available" },
      { type: "VVIP", price: 500000, status: "Available" }
    ],
    terms: [
      "Acara ini hanya untuk penonton usia 17 tahun ke atas karena mengandung kata-kata kasar dan tema sensitif.",
      "Nama harus sesuai dengan kartu identitas yang sah (KTP/SIM/Paspor) pada saat pembelian tiket.",
      "Wajib menunjukkan kartu identitas yang sah saat penukaran tiket.",
      "Bagi yang membeli lebih dari 1 tiket, wajib mengisi data diri masing-masing pemilik tiket.",
      "Tiket harus ditukar oleh pemilik tiket secara langsung. Penukaran tidak dapat diwakilkan.",
      "Dilarang membawa makanan/minuman dari luar.",
      "Dilarang membawa kamera profesional atau perekam suara.",
      "Tiket yang sudah dibeli tidak dapat dikembalikan/ditukar."
    ]
  };

  // Fungsi Helper Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  return (
    <>
      <Navbar user={currentUser} />

      {/* HERO BANNER */}
      <div style={styles.heroBanner}>
        <img 
          src={eventData.image} 
          alt="Event Banner" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={styles.heroOverlay}></div>
      </div>

      {/* CONTAINER KUNING UTAMA */}
      <div style={styles.mainContainer}>
        <div className="container" style={styles.contentWrapper}>
            
          {/* SECTION 1: DESCRIPTION */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
                <span style={{fontSize: '20px', marginRight: '10px'}}>💬</span> 
                Description
            </div>
            <div style={styles.cardBody}>
                <div style={{marginTop: '1px', fontWeight: 'bold', fontSize: '24px'}}>
                    {eventData.title}
                </div>
                <p style={{fontSize: '16px', lineHeight: '1.6', marginBottom: '20px'}}>
                    {eventData.description}
                </p>
                
                <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>📅 {eventData.date}</div>
                    <div style={styles.infoItem}>📍 {eventData.location}</div>
                    <div style={styles.infoItem}>🕒 {eventData.time}</div>
                    <div style={styles.infoItem}>🪑 {eventData.seats}</div>
                </div>

            </div>
          </div>

          {/* SECTION 2: TERMS AND CONDITION */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
                <span style={{fontSize: '20px', marginRight: '10px'}}>📄</span> 
                Terms and Condition
            </div>
            <div style={styles.cardBody}>
                <ol style={{paddingLeft: '20px', margin: 0}}>
                    {eventData.terms.map((term, index) => (
                        <li key={index} style={{marginBottom: '8px', fontSize: '14px', lineHeight: '1.5'}}>
                            {term}
                        </li>
                    ))}
                </ol>
            </div>
          </div>

          {/* SECTION 3: TICKET */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
                <span style={{fontSize: '20px', marginRight: '10px'}}>🎫</span> 
                Ticket
            </div>
            <div style={styles.cardBody}>
                <div style={styles.ticketDropdownHeader}>
                    2 Ticket Category - Price Starting From Rp 100.000
                </div>

                {eventData.tickets.map((ticket, index) => (
                    <div key={index} style={styles.ticketRow}>
                        <div style={{fontWeight: 'bold', fontSize: '18px'}}>
                            {formatRupiah(ticket.price)}
                        </div>
                        <div style={{flex: 1, paddingLeft: '20px'}}>
                            <div style={{fontWeight: 'bold', fontSize: '18px'}}>{ticket.type}</div>
                            <div style={{fontSize: '12px', color: '#666'}}>Sale ends soon</div>
                        </div>
                        <div style={styles.badge}>{ticket.status}</div>
                    </div>
                ))}
                
                {/* Tombol Beli Langsung di Sini */}
                <button 
                    onClick={() => navigate('/payment/select')} 
                    style={styles.buyButton}
                >
                    Buy Ticket Now
                </button>
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </>
  );
};

// --- STYLING ---
const styles = {
  heroBanner: {
    width: '100%', height: '350px', position: 'relative', backgroundColor: '#000'
  },
  heroOverlay: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    background: 'linear-gradient(to bottom, transparent, #F59E0B)' // Efek memudar ke kuning
  },
  
  // Container Kuning Besar
  mainContainer: {
    backgroundColor: '#F59E0B', 
    minHeight: '100vh', 
    padding: '0 20px 60px 20px',
    marginTop: '-50px', // Supaya container naik menutupi sedikit banner
    position: 'relative',
    zIndex: 10
  },
  contentWrapper: {
    maxWidth: '800px', margin: '0 auto'
  },

  // Style Kartu Umum
  card: {
    borderRadius: '12px', overflow: 'hidden', marginBottom: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  },
  cardHeader: {
    backgroundColor: '#1F2937', color: 'white', padding: '15px 25px',
    fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center'
  },
  cardBody: {
    backgroundColor: '#FFFBEB', padding: '25px', color: '#333'
  },

  // Grid Info (Desc)
  infoGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px',
    color: '#555', fontSize: '14px'
  },
  infoItem: { fontWeight: '500' },

  // Ticket Section
  ticketDropdownHeader: {
    borderBottom: '1px solid #ddd', paddingBottom: '15px', marginBottom: '15px',
    fontWeight: 'bold', fontSize: '16px'
  },
  ticketRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '15px 0', borderBottom: '1px dashed #ccc'
  },
  badge: {
    backgroundColor: '#10B981', color: 'white', padding: '5px 12px',
    borderRadius: '20px', fontSize: '12px', fontWeight: 'bold'
  },
  buyButton: {
    width: '100%', padding: '15px', marginTop: '20px',
    backgroundColor: '#1F2937', color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '18px', fontWeight: 'bold', cursor: 'pointer'
  }
};

export default EventDetail;