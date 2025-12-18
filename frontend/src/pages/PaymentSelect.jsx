// src/pages/PaymentSelect.jsx
import React, { useState, useEffect } from 'react'; // Tambah useEffect
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { getTicketConfig } from '../utils/ticketStore'; // 1. Import Pengambil Data

const PaymentSelect = () => {
  const navigate = useNavigate();
  const currentUser = { name: "Sutejo" };

  const [qtyEarly, setQtyEarly] = useState(0);
  const [qtyPresale, setQtyPresale] = useState(0);
  const [qtyReguler, setQtyReguler] = useState(0);

  // --- 2. STATE UNTUK CONFIG (DEFAULT KOSONG DULU) ---
  const [config, setConfig] = useState(null);

  // --- 3. AMBIL DATA DARI DATABASE SAAT LOAD ---
  useEffect(() => {
    const data = getTicketConfig();
    
    // Konversi string tanggal dari localStorage kembali jadi Objek Date
    // Agar bisa dibandingkan ( < atau > )
    const parsedData = {
        early: { ...data.early, start: new Date(data.early.start), end: new Date(data.early.end) },
        presale: { ...data.presale, start: new Date(data.presale.start), end: new Date(data.presale.end) },
        reguler: { ...data.reguler, start: new Date(data.reguler.start), end: new Date(data.reguler.end) }
    };
    
    setConfig(parsedData);
  }, []);

  // Kalau data belum siap, jangan render dulu
  if (!config) return null; 

  // --- 4. LOGIC DI BAWAH INI SAMA PERSIS, TAPI PAKAI 'config' DARI STATE ---
  
  const getTicketStatus = (type) => {
    const now = new Date(); 
    const schedule = config[type]; // config diambil dari state

    if (now < schedule.start) return { status: 'upcoming', label: 'Belum Dibuka', color: '#3B82F6' };
    if (now > schedule.end) return { status: 'ended', label: 'Sudah Berakhir', color: '#EF4444' };
    return { status: 'active', label: 'Tersedia', color: '#10B981' };
  };

  const handleQtyChange = (type, action) => {
    const statusInfo = getTicketStatus(type);
    if (statusInfo.status !== 'active') return; 

    if (type === 'early') {
      if (action === 'inc') setQtyEarly(qtyEarly + 1);
      if (action === 'dec' && qtyEarly > 0) setQtyEarly(qtyEarly - 1);
    } 
    else if (type === 'presale') {
      if (action === 'inc') setQtyPresale(qtyPresale + 1);
      if (action === 'dec' && qtyPresale > 0) setQtyPresale(qtyPresale - 1);
    } 
    else if (type === 'reguler') {
      if (action === 'inc') setQtyReguler(qtyReguler + 1);
      if (action === 'dec' && qtyReguler > 0) setQtyReguler(qtyReguler - 1);
    }
  };

  const totalBayar = (qtyEarly * config.early.price) + (qtyPresale * config.presale.price) + (qtyReguler * config.reguler.price);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  const renderTicketCard = (type, title, description, qty) => {
    const statusInfo = getTicketStatus(type);
    const isActive = statusInfo.status === 'active';

    return (
      <div style={{...styles.ticketCard, opacity: isActive ? 1 : 0.6}}> 
        <div style={{marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
          <div>
            <h3 style={styles.ticketName}>{title}</h3>
            <p style={{fontSize:'12px', color:'#666', margin:0}}>{description}</p>
          </div>
          <span style={{
            fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px',
            backgroundColor: statusInfo.color, color: 'white'
          }}>
            {statusInfo.label}
          </span>
        </div>

        <div style={styles.priceRow}>
          <div style={styles.priceTag}>{formatRupiah(config[type].price)}</div>
          
          <div style={{...styles.counterBox, cursor: isActive ? 'default' : 'not-allowed'}}>
            <button 
              onClick={() => handleQtyChange(type, 'dec')} 
              style={{...styles.counterBtn, color: isActive ? 'black' : '#ccc'}}
              disabled={!isActive}
            >-</button>
            <span style={{...styles.counterNum, color: isActive ? 'black' : '#ccc'}}>{qty}</span>
            <button 
              onClick={() => handleQtyChange(type, 'inc')} 
              style={{...styles.counterBtn, color: isActive ? 'black' : '#ccc'}}
              disabled={!isActive}
            >+</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar user={currentUser} />

      <div className="container" style={{ padding: '40px 20px' }}>
        
        {/* Step Indicator */}
        <div style={styles.stepBar}>
          <div style={{...styles.stepItem, fontWeight: 'bold', color: 'black'}}>
            <span style={styles.stepCircleActive}>1</span> Select Category
          </div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}><span style={styles.stepCircle}>2</span> Personal Information</div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}><span style={styles.stepCircle}>3</span> Confirmation</div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}><span style={styles.stepCircle}>4</span> Checkout</div>
        </div>

        <div style={styles.mainCard}>
          <div style={styles.eventBanner}>
             <img src="https://placehold.co/800x300/111/F59E0B?text=EKRESA+CERITA+ANEHKU" alt="Event Banner" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>

          <h2 style={styles.pageTitle}>Select Category</h2>

          {/* Render Tiket dengan Data Dinamis */}
          {renderTicketCard('early', 'Early Bird', 'Kuota terbatas! Paling hemat.', qtyEarly)}
          {renderTicketCard('presale', 'Presale', 'Harga spesial sebelum harga normal.', qtyPresale)}
          {renderTicketCard('reguler', 'Reguler', 'Harga normal on the spot / H-1.', qtyReguler)}

          {/* SUMMARY */}
          <div style={styles.summaryBox}>
            <h3 style={{marginTop: 0, borderBottom: '1px solid #ccc', paddingBottom: '10px'}}>Rincian Ticket</h3>
            
            {qtyEarly > 0 && <div style={styles.summaryRow}><span>Early Bird x {qtyEarly}</span><span>{formatRupiah(qtyEarly * config.early.price)}</span></div>}
            {qtyPresale > 0 && <div style={styles.summaryRow}><span>Presale x {qtyPresale}</span><span>{formatRupiah(qtyPresale * config.presale.price)}</span></div>}
            {qtyReguler > 0 && <div style={styles.summaryRow}><span>Reguler x {qtyReguler}</span><span>{formatRupiah(qtyReguler * config.reguler.price)}</span></div>}

            <div style={{...styles.summaryRow, marginTop: '15px', fontWeight: 'bold', fontSize: '18px'}}>
              <span>TOTAL</span>
              <span>{formatRupiah(totalBayar)}</span>
            </div>

            <button 
              style={totalBayar === 0 ? styles.orderButtonDisabled : styles.orderButton} 
              disabled={totalBayar === 0}
              onClick={() => navigate('/payment/info', { 
                state: { qtyEarly, qtyPresale, qtyReguler, totalHarga: totalBayar } 
              })}
            >
              Order Now
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

// Styles (TETAP SAMA)
const styles = {
  stepBar: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F59E0B', padding: '15px', borderRadius: '50px', marginBottom: '30px', color: '#553C00', flexWrap: 'wrap', maxWidth: '800px', width: '100%', margin: '0 auto 30px', gap: '15px' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
  separator: { fontSize: '24px', fontWeight: 'bold', color: '#553C00', marginTop: '-4px' },
  stepCircleActive: { width: '28px', height: '28px', backgroundColor: 'black', color: '#F59E0B', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '14px' },
  stepCircle: { width: '26px', height: '26px', border: '2px solid #553C00', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '14px' },
  mainCard: { backgroundColor: '#F59E0B', borderRadius: '16px', padding: '20px', maxWidth: '800px', margin: '0 auto', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
  eventBanner: { height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' },
  pageTitle: { textAlign: 'center', color: 'black', fontSize: '28px', marginBottom: '20px' },
  ticketCard: { backgroundColor: '#FFFBEB', borderRadius: '12px', padding: '20px', marginBottom: '20px', color: '#333' },
  ticketName: { margin: '0 0 5px 0', fontSize: '22px', fontWeight: 'bold' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', backgroundColor: '#1F2937', padding: '10px', borderRadius: '8px' },
  priceTag: { color: 'white', fontWeight: 'bold', fontSize: '18px' },
  counterBox: { display: 'flex', alignItems: 'center', backgroundColor: '#E5E7EB', borderRadius: '6px' },
  counterBtn: { width: '50px', height: '50px', border: 'none', backgroundColor: 'transparent', fontWeight: 'bold', fontSize: '18px', color: 'black' },
  counterNum: { width: '30px', textAlign: 'center', fontWeight: 'bold', color: 'black' },
  summaryBox: { backgroundColor: '#FFFBEB', borderRadius: '12px', padding: '20px', marginTop: '30px', color: '#333' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  orderButton: { width: '100%', padding: '15px', backgroundColor: '#1F2937', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', transition: '0.3s' },
  orderButtonDisabled: { width: '100%', padding: '15px', backgroundColor: '#6B7280', color: '#D1D5DB', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'not-allowed', marginTop: '20px' }
};

export default PaymentSelect;