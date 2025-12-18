// src/pages/PaymentSelect.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const PaymentSelect = () => {
  const navigate = useNavigate();
  const currentUser = { name: "Sutejo" };

  // --- 1. STATE BARU (3 KATEGORI) ---
  const [qtyEarly, setQtyEarly] = useState(0);
  const [qtyPresale, setQtyPresale] = useState(0);
  const [qtyReguler, setQtyReguler] = useState(0);

  // --- 2. HARGA BARU ---
  const PRICE_EARLY = 50000;
  const PRICE_PRESALE = 75000;
  const PRICE_REGULER = 100000;

  // --- 3. LOGIC COUNTER BARU ---
  const handleQtyChange = (type, action) => {
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

  // Hitung Total Bayar
  const totalBayar = (qtyEarly * PRICE_EARLY) + (qtyPresale * PRICE_PRESALE) + (qtyReguler * PRICE_REGULER);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
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

        {/* Main Card */}
        <div style={styles.mainCard}>
          <div style={styles.eventBanner}>
             <img src="https://placehold.co/800x300/111/F59E0B?text=EKRESA+CERITA+ANEHKU" alt="Event Banner" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>

          <h2 style={styles.pageTitle}>Select Category</h2>

          {/* --- CARD 1: EARLY BIRD --- */}
          <div style={styles.ticketCard}>
            <div style={{marginBottom: '15px'}}>
              <h3 style={styles.ticketName}>Early Bird</h3>
              <p style={{fontSize:'12px', color:'#666', margin:0}}>Kuota terbatas! Paling hemat.</p>
            </div>
            <div style={styles.priceRow}>
              <div style={styles.priceTag}>{formatRupiah(PRICE_EARLY)}</div>
              <div style={styles.counterBox}>
                <button onClick={() => handleQtyChange('early', 'dec')} style={styles.counterBtn}>-</button>
                <span style={styles.counterNum}>{qtyEarly}</span>
                <button onClick={() => handleQtyChange('early', 'inc')} style={styles.counterBtn}>+</button>
              </div>
            </div>
          </div>

          {/* --- CARD 2: PRESALE --- */}
          <div style={styles.ticketCard}>
            <div style={{marginBottom: '15px'}}>
              <h3 style={styles.ticketName}>Presale</h3>
              <p style={{fontSize:'12px', color:'#666', margin:0}}>Harga spesial sebelum harga normal.</p>
            </div>
            <div style={styles.priceRow}>
              <div style={styles.priceTag}>{formatRupiah(PRICE_PRESALE)}</div>
              <div style={styles.counterBox}>
                <button onClick={() => handleQtyChange('presale', 'dec')} style={styles.counterBtn}>-</button>
                <span style={styles.counterNum}>{qtyPresale}</span>
                <button onClick={() => handleQtyChange('presale', 'inc')} style={styles.counterBtn}>+</button>
              </div>
            </div>
          </div>

          {/* --- CARD 3: REGULER --- */}
          <div style={styles.ticketCard}>
            <div style={{marginBottom: '15px'}}>
              <h3 style={styles.ticketName}>Reguler</h3>
              <p style={{fontSize:'12px', color:'#666', margin:0}}>Harga normal on the spot / H-1.</p>
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


          {/* --- SUMMARY SECTION --- */}
          <div style={styles.summaryBox}>
            <h3 style={{marginTop: 0, borderBottom: '1px solid #ccc', paddingBottom: '10px'}}>Rincian Ticket</h3>
            
            {qtyEarly > 0 && (
              <div style={styles.summaryRow}><span>Early Bird x {qtyEarly}</span><span>{formatRupiah(qtyEarly * PRICE_EARLY)}</span></div>
            )}
            {qtyPresale > 0 && (
              <div style={styles.summaryRow}><span>Presale x {qtyPresale}</span><span>{formatRupiah(qtyPresale * PRICE_PRESALE)}</span></div>
            )}
            {qtyReguler > 0 && (
              <div style={styles.summaryRow}><span>Reguler x {qtyReguler}</span><span>{formatRupiah(qtyReguler * PRICE_REGULER)}</span></div>
            )}

            <div style={{...styles.summaryRow, marginTop: '15px', fontWeight: 'bold', fontSize: '18px'}}>
              <span>TOTAL</span>
              <span>{formatRupiah(totalBayar)}</span>
            </div>

            <button 
              style={totalBayar === 0 ? styles.orderButtonDisabled : styles.orderButton} 
              disabled={totalBayar === 0}
              // --- PENTING: KIRIM 3 VARIABEL INI KE HALAMAN BERIKUTNYA ---
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

// Styles (Tetap sama)
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
  counterBtn: { width: '50px', height: '50px', border: 'none', backgroundColor: 'transparent', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', color: 'black' },
  counterNum: { width: '30px', textAlign: 'center', fontWeight: 'bold', color: 'black' },
  summaryBox: { backgroundColor: '#FFFBEB', borderRadius: '12px', padding: '20px', marginTop: '30px', color: '#333' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  orderButton: { width: '100%', padding: '15px', backgroundColor: '#1F2937', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', transition: '0.3s' },
  orderButtonDisabled: { width: '100%', padding: '15px', backgroundColor: '#6B7280', color: '#D1D5DB', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'not-allowed', marginTop: '20px' }
};

export default PaymentSelect;