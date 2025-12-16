// src/pages/PaymentCheckout.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = { name: "Sutejo" };

  // --- 1. AMBIL SEMUA DATA DARI TAHAP SEBELUMNYA ---
  const allData = location.state || {};
  const { 
    qtyReguler = 0, 
    qtyVVIP = 0, 
    totalHarga = 0, 
    fullName = '-', 
    idNumber = '-', 
    dob = '-', 
    email = '-', 
    paymentMethod = '-' 
  } = allData;

  // Format Rupiah Helper
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  // Logic Bayar
  const handlePayNow = () => {
    // Arahkan ke halaman Bayar, bawa semua data
    navigate('/payment/bayar', {
      state: { ...allData } 
    });
  };

  return (
    <>
      <Navbar user={currentUser} />

      <div className="container" style={{ padding: '40px 20px' }}>
        
        {/* --- STEP INDICATOR (Step 4 Active) --- */}
        <div style={styles.stepBar}>
          <div style={styles.stepItem}><span style={styles.stepCircleDone}>✓</span> Select Category</div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}><span style={styles.stepCircleDone}>✓</span> Personal Information</div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}><span style={styles.stepCircleDone}>✓</span> Confirmation</div>
          <span style={styles.separator}>›</span>
          <div style={{...styles.stepItem, fontWeight: 'bold', color: 'black'}}>
            <span style={styles.stepCircleActive}>4</span> Checkout
          </div>
        </div>

        {/* --- MAIN CARD (KUNING) --- */}
        <div style={styles.mainCard}>
          <h2 style={styles.pageTitle}>Checkout</h2>

          {/* 1. EVENT INFO CARD */}
          <div style={styles.whiteCard}>
            <div style={styles.eventLayout}>
                <img 
                    src="https://placehold.co/300x150/111/F59E0B?text=EVENT+IMG" 
                    alt="Event" 
                    style={styles.eventImg}
                />
                <div style={styles.eventDetails}>
                    <h3 style={{margin: '0 0 10px 0', fontSize: '22px'}}>Cerita Anehku</h3>
                    <p style={styles.eventText}>📍 Sabuga ITB, Bandung</p>
                    <p style={styles.eventText}>🕒 19.30 WIB</p>
                    <p style={styles.eventText}>👤 150 Kursi Tersedia</p>
                </div>
            </div>
          </div>

          {/* 2. PERSONAL INFORMATION SUMMARY */}
          <div style={styles.whiteCard}>
            <h3 style={styles.sectionHeader}>Personal Information</h3>
            <div style={styles.infoRow}>
                <span style={styles.label}>Full Name</span>
                <span style={styles.value}>: {fullName}</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.label}>ID Number</span>
                <span style={styles.value}>: {idNumber}</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.label}>Date of Birth</span>
                <span style={styles.value}>: {dob}</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.label}>E-mail</span>
                <span style={styles.value}>: {email}</span>
            </div>
          </div>

          {/* 3. PAYMENT METHOD SUMMARY */}
          <div style={styles.whiteCard}>
            <h3 style={styles.sectionHeader}>Payment Method</h3>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px'}}>
                <div style={styles.paymentIcon}>💳</div>
                <div style={{fontWeight: 'bold', fontSize: '18px', color: '#0E3695'}}>
                    {paymentMethod}
                </div>
            </div>
            <p style={{fontSize: '13px', color: '#666', marginTop: '5px'}}>
                Next you will be taken to the payment page to complete your payment.
            </p>
          </div>

          {/* 4. PAYMENT DETAILS (TOTAL) */}
          <div style={styles.summaryBox}>
             <h3 style={{margin: '0 0 15px 0'}}>Payment details</h3>
             
             {qtyVVIP > 0 && (
                <div style={styles.summaryRow}><span>VVIP</span><span>{qtyVVIP} x</span></div>
             )}
             {qtyReguler > 0 && (
                <div style={styles.summaryRow}><span>Reguler</span><span>{qtyReguler} x</span></div>
             )}

             <hr style={{border: 'none', borderTop: '1px solid #ccc', margin: '15px 0'}}/>
             
             <div style={{...styles.summaryRow, fontSize: '18px', fontWeight: 'bold'}}>
                <span>TOTAL</span>
                <span>{formatRupiah(totalHarga)}</span>
             </div>

             <button onClick={handlePayNow} style={styles.payButton}>
                Pay Now
             </button>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

// --- STYLING ---
const styles = {
  // Step Bar
  stepBar: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#F59E0B', padding: '15px', borderRadius: '50px',
    marginBottom: '30px', color: '#553C00', flexWrap: 'wrap',
    maxWidth: '800px', width: '100%', margin: '0 auto 30px', gap: '15px'
  },
  stepItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
  separator: { fontSize: '24px', fontWeight: 'bold', color: '#553C00', marginTop: '-4px' },
  stepCircleActive: { width: '28px', height: '28px', backgroundColor: 'black', color: '#F59E0B', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  stepCircleDone: { width: '28px', height: '28px', backgroundColor: 'black', color: '#F59E0B', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },

  // Main Container
  mainCard: {
    backgroundColor: '#F59E0B', borderRadius: '16px', padding: '30px',
    maxWidth: '800px', margin: '0 auto', boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
  },
  pageTitle: { textAlign: 'center', color: 'white', fontSize: '28px', marginBottom: '20px', marginTop: 0 },

  // Kartu Putih (Reusable)
  whiteCard: {
    backgroundColor: '#FFFBEB', borderRadius: '12px', padding: '25px', marginBottom: '20px', color: '#333'
  },
  sectionHeader: { margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '10px' },

  // Event Info
  eventLayout: { display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' },
  eventImg: { width: '150px', height: '100px', borderRadius: '8px', objectFit: 'cover' },
  eventText: { margin: '5px 0', color: '#555', fontSize: '14px' },

  // Personal Info Rows
  infoRow: { display: 'flex', marginBottom: '8px', fontSize: '15px' },
  label: { width: '140px', fontWeight: '600', color: '#444' },
  value: { flex: 1, color: '#000' },

  // Payment Icon
  paymentIcon: { 
    width: '40px', height: '40px', backgroundColor: '#E0F2FE', 
    borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px'
  },

  // Bottom Summary Box
  summaryBox: {
    backgroundColor: '#FFFBEB', borderRadius: '12px', padding: '25px', marginTop: '10px', color: '#333'
  },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  
  // Pay Button
  payButton: {
    width: '100%', padding: '15px', backgroundColor: '#1F2937', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '20px', fontWeight: 'bold',
    cursor: 'pointer', marginTop: '20px', transition: '0.3s'
  }
};

export default PaymentCheckout;