// src/pages/payment/PaymentStep3.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../utils/authStore';

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser() || { name: "Guest" };

  // 1. Ambil Data Estafet dari Step 2
  const { eventData, ticketData, userData } = location.state || {};
  
  // 2. State Metode Pembayaran
  const [activeDropdown, setActiveDropdown] = useState(''); 
  const [selectedPayment, setSelectedPayment] = useState(null); 

  const toggleDropdown = (id) => setActiveDropdown(activeDropdown === id ? '' : id);
  const selectMethod = (methodName) => setSelectedPayment(methodName);

  const handleNext = () => {
    if (!selectedPayment) {
      alert("Silakan pilih metode pembayaran terlebih dahulu!");
      return;
    }
    // ESTAFET 4: Kirim Semua Data ke Step 4 (Checkout)
    navigate('/payment/checkout', {
      state: { 
          eventData,
          ticketData,
          userData,
          paymentMethod: selectedPayment 
      }
    });
  };

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

  if (!eventData || !ticketData || !userData) {
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
          <div style={styles.stepItem}><span style={styles.stepCircleDone}>✓</span> Personal Info</div>
          <span style={styles.separator}>›</span>
          <div style={{...styles.stepItem, fontWeight: 'bold', color: 'black'}}><span style={styles.stepCircleActive}>3</span> Confirmation</div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}><span style={styles.stepCircle}>4</span> Checkout</div>
        </div>

        {/* UTAMA */}
        <div style={styles.mainCard}>
          <h2 style={styles.pageTitle}>Payment Confirmation</h2>
          
          <div style={styles.contentContainer}>
            
            {/* Review Data Diri */}
            <h3 style={{margin: '0 0 15px 0', borderBottom: '1px solid #ddd', paddingBottom: '10px'}}>Data Pemesan</h3>
            <div style={{marginBottom: '25px', fontSize: '15px'}}>
                <div style={styles.reviewRow}><span>Nama</span> <span style={{fontWeight:'bold'}}>{userData.fullName}</span></div>
                <div style={styles.reviewRow}><span>Email</span> <span style={{fontWeight:'bold'}}>{userData.email}</span></div>
                <div style={styles.reviewRow}><span>No. HP</span> <span style={{fontWeight:'bold'}}>{userData.phoneNumber}</span></div>
            </div>

            {/* Pilih Metode Pembayaran */}
            <h3 style={{margin: '0 0 15px 0', borderBottom: '1px solid #ddd', paddingBottom: '10px'}}>Select Payment Method</h3>
            
            {/* Dropdown VA */}
            <div style={styles.dropdownItem}>
              <div style={styles.dropdownHeader} onClick={() => toggleDropdown('va')}>
                <span style={{fontWeight: 'bold'}}>Virtual Account</span>
                <span>{activeDropdown === 'va' ? '▲' : '▼'}</span>
              </div>
              {activeDropdown === 'va' && (
                <div style={styles.dropdownBody}>
                   {['BCA Virtual Account', 'BRI Virtual Account', 'Mandiri Virtual Account'].map((bank) => (
                      <div key={bank} style={selectedPayment === bank ? styles.optionSelected : styles.optionItem} onClick={() => selectMethod(bank)}>
                        <img src={`https://placehold.co/30x20?text=Logo`} alt="icon" style={{marginRight: '10px', borderRadius:'3px'}}/>
                        {bank}
                      </div>
                   ))}
                </div>
              )}
            </div>

            {/* Dropdown E-Wallet */}
            <div style={styles.dropdownItem}>
              <div style={styles.dropdownHeader} onClick={() => toggleDropdown('wallet')}>
                <span style={{fontWeight: 'bold'}}>E-Wallet</span>
                <span>{activeDropdown === 'wallet' ? '▲' : '▼'}</span>
              </div>
              {activeDropdown === 'wallet' && (
                <div style={styles.dropdownBody}>
                   {['GoPay', 'DANA', 'OVO'].map((wallet) => (
                      <div key={wallet} style={selectedPayment === wallet ? styles.optionSelected : styles.optionItem} onClick={() => selectMethod(wallet)}>
                         <img src={`https://placehold.co/30x20?text=Logo`} alt="icon" style={{marginRight: '10px', borderRadius:'3px'}}/>
                         {wallet}
                      </div>
                   ))}
                </div>
              )}
            </div>

          </div>

          <div style={styles.buttonRow}>
            <button onClick={() => navigate(-1)} style={styles.btnBack}>Back</button>
            <button onClick={handleNext} style={styles.btnNext}>Next Step</button>
          </div>
        </div>

        {/* RINGKASAN BAWAH */}
        <div style={styles.summaryBoxOuter}>
             <h3 style={{marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px'}}>Rincian Tiket</h3>
             
             {['early', 'presale', 'reguler'].map(type => (
                 ticketData.qty[type] > 0 && (
                     <div key={type} style={styles.summaryRow}>
                        <span style={{textTransform:'capitalize'}}>{type} Bird</span>
                        <span>{ticketData.qty[type]} x</span>
                     </div>
                 )
             ))}

             <div style={{...styles.summaryRow, fontSize:'13px', color:'#555', marginBottom:'15px'}}>
                <span>Kursi:</span>
                <span style={{textAlign:'right', maxWidth:'150px'}}>{ticketData.selectedSeats?.join(', ')}</span>
             </div>
             
             <hr style={{border: 'none', borderTop: '1px solid #ccc', margin: '15px 0'}}/>
             
             <div style={styles.summaryRow}><span>TOTAL</span><span>{formatRupiah(ticketData.totalBasePrice)}</span></div>
             
             {selectedPayment && (
                <div style={{marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #999', fontSize: '14px', color: '#0E3695', fontWeight: 'bold'}}>
                    Metode: {selectedPayment}
                </div>
             )}
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
  contentContainer: { backgroundColor: '#FFFBEB', borderRadius: '12px', padding: '30px', marginBottom: '20px', color: '#333' },
  
  reviewRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px dashed #eee', paddingBottom: '4px' },

  dropdownItem: { marginBottom: '15px', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  dropdownHeader: { padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: '#fff', borderBottom: '1px solid #eee', fontSize: '16px' },
  dropdownBody: { backgroundColor: '#f9fafb', padding: '10px' },
  
  optionItem: { padding: '15px 20px', cursor: 'pointer', borderRadius: '6px', margin: '5px 0', backgroundColor: 'white', border: '1px solid #ddd', transition: '0.2s', fontSize: '15px', display: 'flex', alignItems: 'center' },
  optionSelected: { padding: '15px 20px', cursor: 'pointer', borderRadius: '6px', margin: '5px 0', backgroundColor: '#E0F2FE', border: '2px solid #0E3695', color: '#0E3695', fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center' },
  
  buttonRow: { display: 'flex', justifyContent: 'space-between', gap: '20px' },
  btnBack: { flex: 1, padding: '15px', backgroundColor: '#1F2937', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
  btnNext: { flex: 1, padding: '15px', backgroundColor: '#1F2937', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
  
  summaryBoxOuter: { backgroundColor: '#D1D5DB', borderRadius: '12px', padding: '20px', maxWidth: '500px', margin: '30px auto 0', color: '#000', fontWeight: 'bold' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }
};

export default PaymentConfirmation;