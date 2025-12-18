// src/pages/PaymentSelect.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { getTicketConfig } from '../utils/ticketStore';
import { getCurrentUser } from '../utils/authStore';

const PaymentSelect = () => {
  const navigate = useNavigate();
  
  const currentUser = getCurrentUser() || { name: "Guest" }; 

  const [config, setConfig] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]); 
  const [activeCategory, setActiveCategory] = useState('reguler');

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']; 
  const cols = Array.from({ length: 20 }, (_, i) => i + 1);       

  const bookedSeats = ['A5', 'A6', 'B10', 'C15', 'E1', 'E2', 'F20', 'J1', 'J2']; 

  useEffect(() => {
    const data = getTicketConfig();
    const parsedData = {
        early: { ...data.early, start: new Date(data.early.start), end: new Date(data.early.end) },
        presale: { ...data.presale, start: new Date(data.presale.start), end: new Date(data.presale.end) },
        reguler: { ...data.reguler, start: new Date(data.reguler.start), end: new Date(data.reguler.end) }
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConfig(parsedData);
  }, []);

  if (!config) return null;

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    const statusInfo = getTicketStatus(activeCategory);
    if (statusInfo.status !== 'active') {
      alert(`Maaf, tiket kategori ${activeCategory} belum dibuka atau sudah habis.`);
      return;
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getTicketStatus = (type) => {
    const now = new Date(); 
    const schedule = config[type];
    if (now < schedule.start) return { status: 'upcoming', label: 'Belum Dibuka' };
    if (now > schedule.end) return { status: 'ended', label: 'Sudah Berakhir' };
    return { status: 'active', label: 'Tersedia' };
  };

  const pricePerTicket = config[activeCategory].price;
  const totalBayar = selectedSeats.length * pricePerTicket;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  return (
    <>
    {/* Navbar akan menampilkan nama User asli */}
      <Navbar user={currentUser} /> 

      <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
        
        {/* Step Indicator */}
        <div style={styles.stepBar}>
          <div style={{...styles.stepItem, fontWeight: 'bold', color: 'black'}}>
            <span style={styles.stepCircleActive}>1</span> Select Seat
          </div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}><span style={styles.stepCircle}>2</span> Personal Info</div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}><span style={styles.stepCircle}>3</span> Confirmation</div>
          <span style={styles.separator}>›</span>
          <div style={styles.stepItem}><span style={styles.stepCircle}>4</span> Checkout</div>
        </div>

        <div style={styles.layoutGrid}>
          
          {/* DENAH KURSI */}
          <div style={styles.leftPanel}>
            <h2 style={{marginTop:0, marginBottom: '20px'}}>Pilih Kursi Anda</h2>
            <div style={styles.screen}>LAYAR PANGGUNG</div>

            <div style={{overflowX: 'auto', paddingBottom: '10px'}}>
              <div style={styles.seatContainer}>
                {rows.map(row => (
                  <div key={row} style={styles.seatRow}>
                    {cols.map(col => {
                      const seatId = `${row}${col}`;
                      const isBooked = bookedSeats.includes(seatId);     
                      const isSelected = selectedSeats.includes(seatId); 

                      let bgColor = '#10B981'; 
                      let textColor = 'white';
                      let borderColor = '#059669';
                      let cursor = 'pointer';

                      if (isBooked) {
                        bgColor = '#374151'; 
                        textColor = '#9CA3AF';
                        borderColor = '#1F2937';
                        cursor = 'not-allowed';
                      } else if (isSelected) {
                        bgColor = '#F59E0B';
                        textColor = 'black';
                        borderColor = '#D97706';
                      }

                      return (
                        <div 
                          key={seatId} 
                          onClick={() => handleSeatClick(seatId)}
                          title={isBooked ? `Kursi ${seatId} Tidak Tersedia` : `Pilih Kursi ${seatId}`}
                          style={{
                            ...styles.seat,
                            backgroundColor: bgColor,
                            color: textColor,
                            border: `1px solid ${borderColor}`,
                            cursor: cursor
                          }}
                        >
                          {seatId}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.legend}>
              <div style={styles.legendItem}>
                <div style={{...styles.seatBox, background: '#10B981'}}></div> Tersedia (Hijau)
              </div>
              <div style={styles.legendItem}>
                <div style={{...styles.seatBox, background: '#F59E0B'}}></div> Dipilih (Kuning)
              </div>
              <div style={styles.legendItem}>
                <div style={{...styles.seatBox, background: '#374151'}}></div> Tidak Tersedia (Hitam)
              </div>
            </div>
          </div>

          {/* KOLOM KANAN */}
          <div style={styles.rightPanel}>
            <div style={{marginBottom: '20px'}}>
              <h3 style={{marginTop: 0}}>Kategori Tiket</h3>
              <div style={styles.categoryList}>
                {['early', 'presale', 'reguler'].map(cat => {
                   const status = getTicketStatus(cat);
                   const isActive = activeCategory === cat;
                   const isAvailable = status.status === 'active';

                   return (
                     <div 
                        key={cat}
                        onClick={() => {
                          if (isAvailable) {
                            setActiveCategory(cat);
                            setSelectedSeats([]); 
                          }
                        }}
                        style={{
                          ...styles.categoryCard,
                          border: isActive ? '2px solid #F59E0B' : '1px solid #374151',
                          opacity: isAvailable ? 1 : 0.5,
                          cursor: isAvailable ? 'pointer' : 'not-allowed'
                        }}
                     >
                       <div style={{display:'flex', justifyContent:'space-between'}}>
                         <span style={{fontWeight:'bold', textTransform: 'capitalize'}}>{cat} Bird</span>
                         <span style={{fontSize:'12px', background: isAvailable ? '#10B981' : '#EF4444', color:'white', padding:'2px 6px', borderRadius:'4px'}}>
                           {status.label}
                         </span>
                       </div>
                       <div style={{color: '#F59E0B', fontWeight:'bold', marginTop:'5px'}}>
                         {formatRupiah(config[cat].price)}
                       </div>
                     </div>
                   )
                })}
              </div>
            </div>

            <div style={styles.summaryBox}>
              <h3 style={{marginTop: 0, borderBottom: '1px solid #555', paddingBottom: '10px', color: 'white'}}>Rincian Pesanan</h3>
              
              <div style={styles.summaryRow}>
                <span style={{color:'#D1D5DB'}}>Kategori</span>
                <span style={{color:'white', fontWeight:'bold', textTransform:'capitalize'}}>{activeCategory}</span>
              </div>
              
              <div style={styles.summaryRow}>
                <span style={{color:'#D1D5DB'}}>Kursi ({selectedSeats.length})</span>
                <div style={{textAlign: 'right', maxWidth: '150px', color:'#F59E0B', fontWeight:'bold', fontSize: '13px', lineHeight: '1.4'}}>
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}
                </div>
              </div>

              <div style={{...styles.summaryRow, marginTop: '15px', paddingTop:'15px', borderTop:'1px dashed #555', fontSize:'18px'}}>
                <span style={{color:'white', fontWeight:'bold'}}>TOTAL</span>
                <span style={{color:'#F59E0B', fontWeight:'bold'}}>{formatRupiah(totalBayar)}</span>
              </div>

              <button 
                style={selectedSeats.length === 0 ? styles.orderButtonDisabled : styles.orderButton} 
                disabled={selectedSeats.length === 0}
                onClick={() => navigate('/payment/info', { 
                  state: { 
                    selectedCategory: activeCategory,
                    selectedSeats: selectedSeats, 
                    totalHarga: totalBayar 
                  } 
                })}
              >
                Lanjut Pembayaran
              </button>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  stepBar: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F59E0B', padding: '15px', borderRadius: '50px', marginBottom: '30px', color: '#553C00', flexWrap: 'wrap', maxWidth: '800px', width: '100%', margin: '0 auto 30px', gap: '15px' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
  separator: { fontSize: '24px', fontWeight: 'bold', color: '#553C00', marginTop: '-4px' },
  stepCircleActive: { width: '28px', height: '28px', backgroundColor: 'black', color: '#F59E0B', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '14px' },
  stepCircle: { width: '26px', height: '26px', border: '2px solid #553C00', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '14px' },
  layoutGrid: { display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '30px', alignItems: 'start' },
  leftPanel: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', textAlign: 'center' },
  screen: { backgroundColor: '#374151', color: 'white', padding: '10px', marginBottom: '40px', borderRadius: '8px', fontWeight: 'bold', letterSpacing: '2px', width: '80%', margin: '0 auto 40px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' },
  seatContainer: { display: 'inline-flex', flexDirection: 'column', gap: '8px', alignItems: 'center' },
  seatRow: { display: 'flex', gap: '8px' },
  seat: { width: '35px', height: '35px', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', fontWeight: 'bold', transition: '0.2s', userSelect: 'none' },
  legend: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666' },
  seatBox: { width: '20px', height: '20px', borderRadius: '4px' },
  rightPanel: { display: 'flex', flexDirection: 'column', gap: '20px' },
  categoryList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  categoryCard: { backgroundColor: '#1F2937', padding: '15px', borderRadius: '8px', color: 'white', transition: '0.2s' },
  summaryBox: { backgroundColor: '#111827', borderRadius: '12px', padding: '20px', color: 'white' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' },
  orderButton: { width: '100%', padding: '15px', backgroundColor: '#F59E0B', color: 'black', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', transition: '0.3s' },
  orderButtonDisabled: { width: '100%', padding: '15px', backgroundColor: '#374151', color: '#6B7280', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'not-allowed', marginTop: '20px' }
};

export default PaymentSelect;