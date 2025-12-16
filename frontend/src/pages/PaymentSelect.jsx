// src/pages/PaymentSelect.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom'; // 1. IMPORT WAJIB

const PaymentSelect = () => {
  const navigate = useNavigate(); // 2. INISIALISASI NAVIGASI
  const currentUser = { name: "Sutejo" };

  // STATE
  const [qtyReguler, setQtyReguler] = useState(0);
  const [qtyVVIP, setQtyVVIP] = useState(0);

  // CONSTANT
  const PRICE_REGULER = 100000;
  const PRICE_VVIP = 500000;

  // Handler
  const handleQtyChange = (type, action) => {
    if (type === 'reguler') {
      if (action === 'inc') setQtyReguler(qtyReguler + 1);
      if (action === 'dec' && qtyReguler > 0) setQtyReguler(qtyReguler - 1);
    } else {
      if (action === 'inc') setQtyVVIP(qtyVVIP + 1);
      if (action === 'dec' && qtyVVIP > 0) setQtyVVIP(qtyVVIP - 1);
    }
  };

  const totalBayar = (qtyReguler * PRICE_REGULER) + (qtyVVIP * PRICE_VVIP);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  return (
    <>
      <Navbar user={currentUser} />

      <div className="container" style={{ padding: '40px 20px' }}>
        
        {/* STEP INDICATOR */}
        <div style={styles.stepBar}>
          <div style={{...styles.stepItem, fontWeight: 'bold', color: 'black'}}>
            <span style={styles.stepCircleActive}>1</span> Select Category
          </div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}>
            <span style={styles.stepCircle}>2</span> Personal Information
          </div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}>
            <span style={styles.stepCircle}>3</span> Confirmation
          </div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}>
            <span style={styles.stepCircle}>4</span> Checkout
          </div>
        </div>

        {/* MAIN CARD */}
        <div style={styles.mainCard}>
          <div style={styles.eventBanner}>
             <img 
               src="https://placehold.co/800x300/111/F59E0B?text=EKRESA+CERITA+ANEHKU" 
               alt="Event Banner" 
               style={{width: '100%', height: '100%', objectFit: 'cover'}} 
             />
          </div>

          <h2 style={styles.pageTitle}>Select Category</h2>

          {/* REGULER */}
          <div style={styles.ticketCard}>
            <div style={{marginBottom: '15px'}}>
              <h3 style={styles.ticketName}>Reguler</h3>
              <ul style={styles.ticketBenefits}>
                <li>Harga belum termasuk Pajak Hiburan 15% dan Admin Fee.</li>
                <li>Numbered Seating: Nomor kursi otomatis.</li>
              </ul>
            </div>
            <div style={styles.priceRow}>
              <div style={styles.priceTag}>{formatRupiah(PRICE_REGULER)}</div>
              <div style={styles.counterBox}>
                <button onClick={() => handleQtyChange('reguler', 'dec')} style={styles.counterBtn}>-</button>
                <span style={styles.counterNum}>{qtyReguler}</span>
                <button onClick={() => handleQtyChange('reguler', 'inc')} style={styles.counterBtn}>+</button>
              </div>
            </div>
          </div>

          {/* VVIP */}
          <div style={styles.ticketCard}>
            <div style={{marginBottom: '15px'}}>
              <h3 style={styles.ticketName}>VVIP</h3>
              <ul style={styles.ticketBenefits}>
                <li>Harga All-In (Termasuk Pajak & Admin).</li>
                <li>Akses Fast Track & Merchandise.</li>
              </ul>
            </div>
            <div style={styles.priceRow}>
              <div style={styles.priceTag}>{formatRupiah(PRICE_VVIP)}</div>
              <div style={styles.counterBox}>
                <button onClick={() => handleQtyChange('vvip', 'dec')} style={styles.counterBtn}>-</button>
                <span style={styles.counterNum}>{qtyVVIP}</span>
                <button onClick={() => handleQtyChange('vvip', 'inc')} style={styles.counterBtn}>+</button>
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div style={styles.summaryBox}>
            <h3 style={{marginTop: 0, borderBottom: '1px solid #ccc', paddingBottom: '10px'}}>Rincian Ticket</h3>
            {qtyReguler > 0 && (
              <div style={styles.summaryRow}>
                <span>Reguler x {qtyReguler}</span>
                <span>{formatRupiah(qtyReguler * PRICE_REGULER)}</span>
              </div>
            )}
            {qtyVVIP > 0 && (
              <div style={styles.summaryRow}>
                <span>VVIP x {qtyVVIP}</span>
                <span>{formatRupiah(qtyVVIP * PRICE_VVIP)}</span>
              </div>
            )}
            <div style={{...styles.summaryRow, marginTop: '15px', fontWeight: 'bold', fontSize: '18px'}}>
              <span>TOTAL</span>
              <span>{formatRupiah(totalBayar)}</span>
            </div>

            {/* 3. TOMBOL ORDER DENGAN NAVIGASI */}
            <button 
              style={totalBayar === 0 ? styles.orderButtonDisabled : styles.orderButton} 
              disabled={totalBayar === 0}
              onClick={() => navigate('/payment/info', { 
                state: { 
                    qtyReguler: qtyReguler, 
                    qtyVVIP: qtyVVIP, 
                    totalHarga: totalBayar 
                }
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

const styles = {
  // Styles Step Bar
  stepBar: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#F59E0B', padding: '15px', borderRadius: '50px',
    marginBottom: '30px', color: '#553C00', flexWrap: 'wrap',
    maxWidth: '800px', width: '100%', margin: '0 auto 30px', gap: '15px'
  },
  stepItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
  separator: { fontSize: '24px', fontWeight: 'bold', color: '#553C00', marginTop: '-4px' },
  stepCircleActive: { width: '28px', height: '28px', backgroundColor: 'black', color: '#F59E0B', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '14px' },
  stepCircle: { width: '26px', height: '26px', border: '2px solid #553C00', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '14px' },

  // Styles Main Card
  mainCard: { backgroundColor: '#F59E0B', borderRadius: '16px', padding: '20px', maxWidth: '800px', margin: '0 auto', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
  eventBanner: { height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' },
  pageTitle: { textAlign: 'center', color: 'black', fontSize: '28px', marginBottom: '20px' },
  ticketCard: { backgroundColor: '#FFFBEB', borderRadius: '12px', padding: '20px', marginBottom: '20px', color: '#333' },
  ticketName: { margin: '0 0 10px 0', fontSize: '22px', fontWeight: 'bold' },
  ticketBenefits: { paddingLeft: '20px', lineHeight: '1.6', fontSize: '14px', color: '#555' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', backgroundColor: '#1F2937', padding: '10px', borderRadius: '8px' },
  priceTag: { color: 'white', fontWeight: 'bold', fontSize: '18px' },
  counterBox: { display: 'flex', alignItems: 'center', backgroundColor: '#E5E7EB', borderRadius: '6px' },
  counterBtn: { width: '50px', height: '50px', border: 'none', backgroundColor: 'transparent', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', color: 'black' },
  counterNum: { width: '30px', textAlign: 'center', fontWeight: 'bold', color: 'black' },
  summaryBox: { backgroundColor: '#FFFBEB', borderRadius: '12px', padding: '20px', marginTop: '30px', color: '#333' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  
  // Styles Button
  orderButton: { width: '100%', padding: '15px', backgroundColor: '#1F2937', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', transition: '0.3s' },
  orderButtonDisabled: { width: '100%', padding: '15px', backgroundColor: '#6B7280', color: '#D1D5DB', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'not-allowed', marginTop: '20px' }
};

export default PaymentSelect;