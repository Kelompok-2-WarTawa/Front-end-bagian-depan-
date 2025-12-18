// src/pages/PaymentInfo.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = { name: "Sutejo" };

  // --- 1. AMBIL DATA DARI HALAMAN SEBELUMNYA (UPDATE 3 KATEGORI) ---
  const { 
    qtyEarly = 0,    // Baru
    qtyPresale = 0,  // Baru
    qtyReguler = 0, 
    totalHarga = 0 
  } = location.state || {};

  // State untuk menyimpan input user
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    phoneNumber: '', // Sesuai revisi sebelumnya (No HP)
    email: '',
    agreed: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckbox = (e) => {
    setFormData({ ...formData, agreed: e.target.checked });
  };

  // --- 2. LOGIC TOMBOL NEXT (UPDATE KIRIM 3 DATA) ---
  const handleNext = () => {
    if (!formData.agreed) {
      alert("Harap setujui Syarat & Ketentuan terlebih dahulu!");
      return;
    }
    
    // Kirim SEMUA data ke halaman Konfirmasi
    navigate('/payment/confirmation', {
      state: {
        qtyEarly,    // Kirim
        qtyPresale,  // Kirim
        qtyReguler,  // Kirim
        totalHarga, 
        ...formData 
      }
    });
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  return (
    <>
      <Navbar user={currentUser} />

      <div className="container" style={{ padding: '40px 20px' }}>
        
        {/* Step Indicator */}
        <div style={styles.stepBar}>
          <div style={styles.stepItem}><span style={styles.stepCircleDone}>✓</span> Select Category</div>
          <span style={styles.separator}>›</span>
          <div style={{...styles.stepItem, fontWeight: 'bold', color: 'black'}}>
            <span style={styles.stepCircleActive}>2</span> Personal Information
          </div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}><span style={styles.stepCircle}>3</span> Confirmation</div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}><span style={styles.stepCircle}>4</span> Checkout</div>
        </div>

        {/* Main Card */}
        <div style={styles.mainCard}>
          <h2 style={styles.pageTitle}>Personal Information</h2>

          <div style={styles.formContainer}>
            <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input 
                    type="text" name="fullName" style={styles.input}
                    value={formData.fullName} onChange={handleChange}
                    placeholder="Sesuai KTP"
                />
            </div>
            <div style={styles.inputGroup}>
                <label style={styles.label}>ID Number (KTP/Driving License)</label>
                <input 
                    type="text" name="idNumber" style={styles.input}
                    value={formData.idNumber} onChange={handleChange}
                    placeholder="Contoh: 3201..."
                />
            </div>
            <div style={styles.inputGroup}>
                <label style={styles.label}>Phone Number</label>
                <input 
                    type="text" name="phoneNumber" style={styles.input}
                    value={formData.phoneNumber} onChange={handleChange}
                    placeholder="Contoh: 0812..."
                />
            </div>
            <div style={styles.inputGroup}>
                <label style={styles.label}>E-mail</label>
                <input 
                    type="email" name="email" style={styles.input}
                    value={formData.email} onChange={handleChange}
                    placeholder="email@example.com"
                />
            </div>

            {/* Checkbox */}
            <div style={styles.checkboxGroup}>
                <input 
                    type="checkbox" id="agreed"
                    checked={formData.agreed} onChange={handleCheckbox}
                    style={{width: '20px', height: '20px', cursor: 'pointer'}}
                />
                <label htmlFor="agreed" style={{marginLeft: '10px', fontSize: '14px', color: '#333'}}>
                    Dengan mengklik "Lanjut", kamu menyetujui Syarat & Ketentuan dan Kebijakan yang berlaku
                </label>
            </div>
          </div>

          <div style={styles.buttonRow}>
            <button onClick={() => navigate('/payment/select')} style={styles.btnBack}>Back</button>
            <button onClick={handleNext} style={styles.btnNext}>Next</button>
          </div>
        </div>

        {/* --- 3. RINCIAN TICKET (SUDAH DIPERBAIKI UTK 3 KATEGORI) --- */}
        <div style={styles.summaryBoxOuter}>
             <h3 style={{marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px'}}>
                Rincian Ticket
             </h3>
             
             {qtyEarly > 0 && (
               <div style={styles.summaryRow}>
                  <span>Early Bird</span>
                  <span>{qtyEarly} x</span>
               </div>
             )}

             {qtyPresale > 0 && (
               <div style={styles.summaryRow}>
                  <span>Presale</span>
                  <span>{qtyPresale} x</span>
               </div>
             )}
             
             {qtyReguler > 0 && (
               <div style={styles.summaryRow}>
                  <span>Reguler</span>
                  <span>{qtyReguler} x</span>
               </div>
             )}

             <hr style={{border: 'none', borderTop: '1px solid #ccc', margin: '15px 0'}}/>
             
             <div style={styles.summaryRow}>
                <span>TOTAL</span>
                <span>{formatRupiah(totalHarga)}</span>
             </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

// --- STYLING (Tetap sama) ---
const styles = {
  stepBar: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F59E0B', padding: '15px', borderRadius: '50px', marginBottom: '30px', color: '#553C00', flexWrap: 'wrap', maxWidth: '800px', width: '100%', margin: '0 auto 30px', gap: '15px' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
  separator: { fontSize: '24px', fontWeight: 'bold', color: '#553C00', marginTop: '-4px' },
  stepCircleActive: { width: '28px', height: '28px', backgroundColor: 'black', color: '#F59E0B', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  stepCircleDone: { width: '28px', height: '28px', backgroundColor: 'black', color: '#F59E0B', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  stepCircle: { width: '26px', height: '26px', border: '2px solid #553C00', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  mainCard: { backgroundColor: '#F59E0B', borderRadius: '16px', padding: '30px', maxWidth: '800px', margin: '0 auto', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
  pageTitle: { textAlign: 'center', color: 'white', fontSize: '28px', marginBottom: '20px', marginTop: 0 },
  formContainer: { backgroundColor: '#FFFBEB', borderRadius: '12px', padding: '30px', marginBottom: '20px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#000' },
  input: { width: '100%', padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#1F2937', color: 'white', fontSize: '16px' },
  checkboxGroup: { display: 'flex', alignItems: 'start', marginTop: '20px' },
  buttonRow: { display: 'flex', justifyContent: 'space-between', gap: '20px' },
  btnBack: { flex: 1, padding: '15px', backgroundColor: '#1F2937', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
  btnNext: { flex: 1, padding: '15px', backgroundColor: '#1F2937', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
  summaryBoxOuter: { backgroundColor: '#D1D5DB', borderRadius: '12px', padding: '20px', maxWidth: '500px', margin: '30px auto 0', color: '#000', fontWeight: 'bold' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }
};

export default PaymentInfo;