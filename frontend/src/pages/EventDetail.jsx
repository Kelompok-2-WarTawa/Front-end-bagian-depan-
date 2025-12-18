// src/pages/DetailEvent.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../utils/authStore'; 
import { getTicketConfigByEvent } from '../utils/ticketStore';

const EventDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser() || { name: "Guest" };
  const eventDataFromState = location.state || {};
  const [ticketConfig, setTicketConfig] = useState(null);

  useEffect(() => {
    if (eventDataFromState.id) {
        const config = getTicketConfigByEvent(eventDataFromState.id);
        setTicketConfig(config);
    } else {
        navigate('/dashboard');
    }
  }, [eventDataFromState.id, navigate]);

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

  // --- MAPPING LABEL KATEGORI (Perbaikan di sini) ---
  const categoryLabels = {
    early: 'Early Bird',
    presale: 'Presale',
    reguler: 'Reguler'
  };

  // --- LOGIKA CEK STATUS BERDASARKAN TANGGAL & KUOTA ---
  const getStatus = (item) => {
    const now = new Date();
    now.setHours(0,0,0,0);
    
    const start = new Date(item.start);
    const end = new Date(item.end);

    // 1. Cek Tanggal
    if (now < start) return { label: 'Coming Soon', color: '#3B82F6', canBuy: false }; // Biru
    if (now > end)   return { label: 'Closed', color: '#6B7280', canBuy: false };      // Abu
    
    // 2. Cek Kuota
    if (item.quota <= 0) return { label: 'Sold Out', color: '#EF4444', canBuy: false }; // Merah

    // 3. Available
    return { label: 'Available', color: '#10B981', canBuy: true }; // Hijau
  };

  const handleBuyTicket = () => {
    navigate('/payment/select', { state: { eventData: eventDataFromState } });
  };

  const terms = [
      "Acara ini hanya untuk penonton usia 17 tahun ke atas.",
      "Nama harus sesuai dengan kartu identitas yang sah (KTP/SIM/Paspor).",
      "Tiket yang sudah dibeli tidak dapat dikembalikan/ditukar."
  ];

  if (!ticketConfig) return <div style={{background:'#0B1120', minHeight:'100vh', color:'white', padding:'50px'}}>Loading...</div>;

  return (
    <>
      <Navbar user={currentUser} />

      <div style={styles.heroBanner}>
        <img src={eventDataFromState.image} alt="Event Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={styles.heroOverlay}></div>
      </div>

      <div style={styles.mainContainer}>
        <div className="container" style={styles.contentWrapper}>
            
          {/* SECTION 1: DESKRIPSI */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>💬 Description</div>
            <div style={styles.cardBody}>
                <div style={{fontWeight: 'bold', fontSize: '24px'}}>{eventDataFromState.title}</div>
                <p style={{lineHeight: '1.6'}}>{eventDataFromState.description || "Deskripsi event..."}</p>
                <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>📅 {eventDataFromState.date}</div>
                    <div style={styles.infoItem}>📍 {eventDataFromState.location}</div>
                </div>
            </div>
          </div>

          {/* SECTION 2: TICKET */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>🎫 Ticket Information</div>
            <div style={styles.cardBody}>
                <div style={styles.ticketDropdownHeader}>Available Ticket Categories</div>

                {['early', 'presale', 'reguler'].map((type) => {
                    const item = ticketConfig[type];
                    const status = getStatus(item); 

                    return (
                        <div key={type} style={styles.ticketRow}>
                            <div style={{fontWeight: 'bold', fontSize: '18px', width: '130px', color: '#0E3695'}}>
                                {formatRupiah(item.price)}
                            </div>
                            <div style={{flex: 1, paddingLeft: '20px'}}>
                                {/* GUNAKAN MAPPING LABEL DI SINI */}
                                <div style={{fontWeight: 'bold', fontSize: '18px'}}>
                                    {categoryLabels[type]}
                                </div>
                                
                                <div style={{fontSize: '12px', color: '#666'}}>
                                    {status.label === 'Coming Soon' && `Opens: ${item.start}`}
                                    {status.label === 'Closed' && `Ended: ${item.end}`}
                                    {status.label === 'Sold Out' && 'Fully Booked'}
                                    {status.label === 'Available' && `Quota: ${item.quota} Seats`}
                                </div>
                            </div>
                            <div style={{...styles.badge, backgroundColor: status.color}}>
                                {status.label}
                            </div>
                        </div>
                    );
                })}
                
                <button onClick={handleBuyTicket} style={styles.buyButton}>
                    Select Seat ➔
                </button>
            </div>
          </div>

          {/* SECTION 3: TERMS */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>📄 Terms and Condition</div>
            <div style={styles.cardBody}>
                <ol style={{paddingLeft: '20px', margin: 0}}>
                    {terms.map((t, i) => <li key={i} style={{marginBottom:'5px'}}>{t}</li>)}
                </ol>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

// Styles (Tetap sama)
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