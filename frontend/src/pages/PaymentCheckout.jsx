// src/pages/payment/PaymentStep4.jsx (PaymentCheckout)
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../utils/authStore';
import { saveTransaction } from '../utils/transactionStore';

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser() || { name: "Guest" };

  // Ambil Data dari Halaman Sebelumnya
  const { eventData, ticketData, userData, paymentMethod } = location.state || {};

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

  // Jika data hilang, kembalikan ke dashboard
  if (!eventData || !ticketData || !userData || !paymentMethod) {
      setTimeout(() => navigate('/dashboard'), 0); 
      return null;
  }

  // --- PERBAIKAN: SAFETY CHECK HARGA (Wajib Ada) ---
  const calculateBasePrice = () => {
    // 1. Cek apakah totalBasePrice yang dikirim valid (> 0)
    let total = ticketData.totalBasePrice || 0;

    // 2. Jika 0, kita hitung paksa menggunakan data qty dan priceSnapshot
    if (total === 0 && ticketData.priceSnapshot && ticketData.qty) {
        const p = ticketData.priceSnapshot;
        const q = ticketData.qty;
        
        // Hitung manual: (Harga x Jumlah)
        const priceEarly = (p.early?.price || 0) * (q.early || 0);
        const pricePresale = (p.presale?.price || 0) * (q.presale || 0);
        const priceReguler = (p.reguler?.price || 0) * (q.reguler || 0);
        
        total = priceEarly + pricePresale + priceReguler;
    }

    return total;
  };

  // --- HITUNG FINAL ---
  const basePrice = calculateBasePrice(); 
  const tax = basePrice * 0.11; 
  const adminFee = 20000;
  const platformFee = 29000;
  const grandTotal = basePrice + tax + adminFee + platformFee;


  // --- LOGIKA BAYAR ---
  const handlePayNow = () => {
    const generatedInvoiceID = "INV-" + Math.floor(100000 + Math.random() * 900000);

    const newTransaction = {
        invoiceID: generatedInvoiceID,
        user: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        
        event: eventData.title || eventData.nama || "Event Name",
        image: eventData.image, 
        date: eventData.date || eventData.jadwal,
        location: eventData.location || eventData.lokasi,
        
        amount: formatRupiah(grandTotal),
        status: 'Pending',
        time: new Date().toLocaleString(),
        paymentMethod: paymentMethod,

        // Simpan detail tiket
        qtyEarly: ticketData.qty?.early || 0,
        qtyPresale: ticketData.qty?.presale || 0,
        qtyReguler: ticketData.qty?.reguler || 0,
        selectedSeats: ticketData.selectedSeats || []
    };

    saveTransaction(newTransaction);

    navigate('/payment', { 
        state: { 
            eventData, 
            ticketData, 
            userData, 
            paymentMethod,
            invoiceID: generatedInvoiceID,
            savedTransaction: newTransaction
        } 
    });
  };

  return (
    <>
      <Navbar user={currentUser} />
      <div className="container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* STEPPER */}
        <div style={styles.stepBar}>
          <div style={styles.stepItem}><span style={styles.stepCircleDone}>✓</span> Select Seat</div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}><span style={styles.stepCircleDone}>✓</span> Personal Info</div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}><span style={styles.stepCircleDone}>✓</span> Confirmation</div>
          <span style={styles.separator}>›</span>
          <div style={{...styles.stepItem, fontWeight: 'bold', color: 'black'}}><span style={styles.stepCircleActive}>4</span> Checkout</div>
        </div>

        <div style={styles.mainCard}>
          <h2 style={styles.pageTitle}>Review & Checkout</h2>

          {/* EVENT INFO */}
          <div style={styles.whiteCard}>
            <div style={styles.eventLayout}>
                <img src={eventData.image || "https://placehold.co/150x100"} alt="Event" style={styles.eventImg}/>
                <div style={styles.eventDetails}>
                    <h3 style={{margin: '0 0 10px 0', fontSize: '22px'}}>
                        {eventData.title || eventData.nama || "Event Name"}
                    </h3>
                    <p style={styles.eventText}>📍 {eventData.location || eventData.lokasi}</p>
                    <p style={styles.eventText}>📅 {eventData.date || eventData.jadwal}</p>
                    <p style={styles.eventText}>👤 {ticketData.selectedSeats?.length || 0} Kursi Dipilih</p>
                </div>
            </div>
          </div>

          {/* PERSONAL INFO */}
          <div style={styles.whiteCard}>
            <h3 style={styles.sectionHeader}>Personal Information</h3>
            <div style={styles.infoRow}><span style={styles.label}>Full Name</span><span style={styles.value}>: {userData.fullName}</span></div>
            <div style={styles.infoRow}><span style={styles.label}>ID Number</span><span style={styles.value}>: {userData.idNumber}</span></div>
            <div style={styles.infoRow}><span style={styles.label}>Phone</span><span style={styles.value}>: {userData.phoneNumber}</span></div>
            <div style={styles.infoRow}><span style={styles.label}>Email</span><span style={styles.value}>: {userData.email}</span></div>
          </div>

          {/* PAYMENT SUMMARY */}
          <div style={styles.whiteCard}>
            <h3 style={styles.sectionHeader}>Payment Method</h3>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px'}}>
                <div style={styles.paymentIcon}>💳</div>
                <div style={{fontWeight: 'bold', fontSize: '18px', color: '#0E3695'}}>{paymentMethod}</div>
            </div>
          </div>

          {/* PAYMENT DETAILS (TAMPILKAN HASIL HITUNG ULANG) */}
          <div style={styles.summaryBox}>
             <h3 style={{margin: '0 0 15px 0'}}>Rincian Pembayaran</h3>
             
             {/* Rincian Subtotal */}
             <div style={styles.summaryRow}>
                <span>Subtotal Tiket ({ticketData.selectedSeats?.length} kursi)</span>
                <span>{formatRupiah(basePrice)}</span>
             </div>

             <div style={styles.summaryRow}><span>Pajak (11%)</span><span>{formatRupiah(tax)}</span></div>
             <div style={styles.summaryRow}><span>Biaya Admin</span><span>{formatRupiah(adminFee)}</span></div>
             <div style={styles.summaryRow}><span>Biaya Platform</span><span>{formatRupiah(platformFee)}</span></div>

             {/* Rincian Kursi */}
             <div style={{...styles.summaryRow, color:'#555', fontSize:'13px', marginTop:'10px', marginBottom:'15px', alignItems:'flex-start'}}>
                <span>Nomor Kursi:</span>
                <span style={{maxWidth:'200px', textAlign:'right', fontWeight:'bold', wordBreak: 'break-word'}}>
                    {ticketData.selectedSeats?.join(', ')}
                </span>
             </div>

             <hr style={{border: 'none', borderTop: '1px solid #ccc', margin: '15px 0'}}/>
             
             {/* TOTAL FINAL */}
             <div style={{...styles.summaryRow, fontSize: '18px', fontWeight: 'bold', color: '#0E3695'}}>
                <span>TOTAL TAGIHAN</span>
                <span>{formatRupiah(grandTotal)}</span>
             </div>
             
             <button onClick={handlePayNow} style={styles.payButton}>Bayar Sekarang</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  stepBar: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F59E0B', padding: '15px', borderRadius: '50px', marginBottom: '30px', color: '#553C00', flexWrap: 'wrap', width: '100%', gap: '15px' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
  separator: { fontSize: '24px', fontWeight: 'bold', color: '#553C00', marginTop: '-4px' },
  stepCircleActive: { width: '28px', height: '28px', backgroundColor: 'black', color: '#F59E0B', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  stepCircleDone: { width: '28px', height: '28px', backgroundColor: 'black', color: '#F59E0B', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  mainCard: { backgroundColor: '#F59E0B', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
  pageTitle: { textAlign: 'center', color: 'white', fontSize: '28px', marginBottom: '20px', marginTop: 0 },
  whiteCard: { backgroundColor: '#FFFBEB', borderRadius: '12px', padding: '25px', marginBottom: '20px', color: '#333' },
  sectionHeader: { margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  eventLayout: { display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' },
  eventImg: { width: '150px', height: '100px', borderRadius: '8px', objectFit: 'cover' },
  eventDetails: { flex: 1 },
  eventText: { margin: '5px 0', color: '#555', fontSize: '14px' },
  infoRow: { display: 'flex', marginBottom: '8px', fontSize: '15px' },
  label: { width: '140px', fontWeight: '600', color: '#444' },
  value: { flex: 1, color: '#000' },
  paymentIcon: { width: '40px', height: '40px', backgroundColor: '#E0F2FE', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' },
  summaryBox: { backgroundColor: '#FFFBEB', borderRadius: '12px', padding: '25px', marginTop: '10px', color: '#333' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  payButton: { width: '100%', padding: '15px', backgroundColor: '#1F2937', color: 'white', border: 'none', borderRadius: '8px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', transition: '0.3s' }
};

export default PaymentCheckout;