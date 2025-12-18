// src/pages/payment/PaymentStep2.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../utils/authStore';

const PaymentInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Ambil Data dari Step Sebelumnya (Estafet)
  const { eventData, ticketData } = location.state || {};
  const currentUser = getCurrentUser() || { name: "Guest", email: "", phone: "" };

  // 2. State Form
  const [formData, setFormData] = useState({
    fullName: currentUser.name !== "Guest" ? currentUser.name : '', 
    idNumber: '', 
    phoneNumber: currentUser.phone || '', 
    email: currentUser.email || '', 
    agreed: false
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCheckbox = (e) => setFormData({ ...formData, agreed: e.target.checked });

  // 3. Handle Next Step
  const handleNext = () => {
    if (!formData.fullName || !formData.idNumber || !formData.phoneNumber || !formData.email) {
        alert("Mohon lengkapi semua data diri!");
        return;
    }
    if (!formData.agreed) {
      alert("Harap setujui Syarat & Ketentuan terlebih dahulu!");
      return;
    }
    
    // ESTAFET 3: Kirim data ke Step 3 (Confirmation)
    navigate('/payment/confirmation', {
      state: {
        eventData,
        ticketData,
        userData: formData // Kirim data diri yg baru diisi
      }
    });
  };

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

  // Jika data hilang (refresh), kembalikan ke dashboard
  if (!eventData || !ticketData) {
      navigate('/dashboard');
      return null;
  }

  return (
    <>
      <Navbar user={currentUser} />
      
      <div className="container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* STEPPER */}
        <div style={styles.stepBar}>
          <div style={styles.stepItem}><span style={styles.stepCircleDone}>✓</span> Select Seat</div>
          <span style={styles.separator}>›</span>
          <div style={{...styles.stepItem, fontWeight: 'bold', color: 'black'}}><span style={styles.stepCircleActive}>2</span> Personal Info</div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}><span style={styles.stepCircle}>3</span> Confirmation</div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}><span style={styles.stepCircle}>4</span> Checkout</div>
        </div>

        {/* FORM DATA DIRI */}
        <div style={styles.mainCard}>
          <h2 style={styles.pageTitle}>Personal Information</h2>
          <div style={styles.formContainer}>
            <div style={styles.inputGroup}><label style={styles.label}>Full Name</label><input type="text" name="fullName" style={styles.input} value={formData.fullName} onChange={handleChange} placeholder="Sesuai KTP"/></div>
            <div style={styles.inputGroup}><label style={styles.label}>ID Number</label><input type="text" name="idNumber" style={styles.input} value={formData.idNumber} onChange={handleChange} placeholder="NIK / SIM"/></div>
            <div style={styles.inputGroup}><label style={styles.label}>Phone Number</label><input type="text" name="phoneNumber" style={styles.input} value={formData.phoneNumber} onChange={handleChange} placeholder="0812..."/></div>
            <div style={styles.inputGroup}><label style={styles.label}>E-mail</label><input type="email" name="email" style={styles.input} value={formData.email} onChange={handleChange} placeholder="email@example.com"/></div>
            <div style={styles.checkboxGroup}>
                <input type="checkbox" id="agreed" checked={formData.agreed} onChange={handleCheckbox} style={{width: '20px', height: '20px', cursor: 'pointer'}}/>
                <label htmlFor="agreed" style={{marginLeft: '10px', fontSize: '14px', color: '#333'}}>Saya menyetujui Syarat & Ketentuan.</label>
            </div>
          </div>
          
          {/* TOMBOL NAVIGASI */}
          <div style={styles.buttonRow}>
            <button onClick={() => navigate(-1)} style={styles.btnBack}>Back</button>
            <button onClick={handleNext} style={styles.btnNext}>Next</button>
          </div>
        </div>

        {/* RINGKASAN PESANAN DI BAWAH */}
        <div style={styles.summaryBoxOuter}>
             <h3 style={{marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px'}}>Rincian Tiket</h3>
             
             {/* Tampilkan detail per kategori */}
             {['early', 'presale', 'reguler'].map(type => (
                 ticketData.qty[type] > 0 && (
                     <div key={type} style={styles.summaryRow}>
                        <span style={{textTransform:'capitalize'}}>{type} Bird</span>
                        <span>{ticketData.qty[type]} x</span>
                     </div>
                 )
             ))}

             {/* Tampilkan Kursi yang Dipilih */}
             <div style={{...styles.summaryRow, fontSize:'13px', color:'#555', marginTop:'10px', marginBottom:'15px'}}>
                <span>Kursi:</span>
                <span style={{textAlign:'right', maxWidth:'200px', wordBreak: 'break-word'}}>
                    {ticketData.selectedSeats?.length > 0 ? ticketData.selectedSeats.join(', ') : '-'}
                </span>
             </div>

             <hr style={{border: 'none', borderTop: '1px solid #ccc', margin: '15px 0'}}/>
             <div style={{...styles.summaryRow, fontSize: '18px'}}>
                <span>TOTAL</span>
                <span style={{color: '#0E3695'}}>{formatRupiah(ticketData.totalBasePrice)}</span>
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
  stepCircle: { width: '26px', height: '26px', border: '2px solid #553C00', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  
  mainCard: { backgroundColor: '#F59E0B', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
  pageTitle: { textAlign: 'center', color: 'white', fontSize: '28px', marginBottom: '20px', marginTop: 0 },
  formContainer: { backgroundColor: '#FFFBEB', borderRadius: '12px', padding: '30px', marginBottom: '20px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#000' },
  input: { width: '100%', padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#1F2937', color: 'white', fontSize: '16px', boxSizing: 'border-box' },
  checkboxGroup: { display: 'flex', alignItems: 'start', marginTop: '20px' },
  
  buttonRow: { display: 'flex', justifyContent: 'space-between', gap: '20px' },
  btnBack: { flex: 1, padding: '15px', backgroundColor: '#1F2937', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
  btnNext: { flex: 1, padding: '15px', backgroundColor: '#1F2937', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
  
  summaryBoxOuter: { backgroundColor: '#D1D5DB', borderRadius: '12px', padding: '20px', maxWidth: '500px', margin: '30px auto 0', color: '#000', fontWeight: 'bold' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }
};

export default PaymentInfo;