// src/pages/payment/PaymentStep1.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCurrentUser } from '../utils/authStore';
import { getTicketConfigByEvent } from '../utils/ticketStore';

const PaymentSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventData } = location.state || {}; 
  const currentUser = getCurrentUser() || { name: "Guest" };

  const [ticketConfig, setTicketConfig] = useState(null);
  const [activeCategory, setActiveCategory] = useState(''); 
  const [selectedSeats, setSelectedSeats] = useState([]); 

  // Mapping Label Kategori
  const categoryLabels = {
    early: 'Early Bird',
    presale: 'Presale',
    reguler: 'Reguler'
  };

  // Helper Cek Validitas
  const isCategoryAvailable = (configItem) => {
      const now = new Date();
      now.setHours(0,0,0,0);
      const start = new Date(configItem.start);
      const end = new Date(configItem.end);

      const isDateValid = now >= start && now <= end;
      const hasQuota = configItem.quota > 0;
      
      return { isDateValid, hasQuota, isBuyable: isDateValid && hasQuota };
  };

  useEffect(() => {
    if (eventData?.id) {
        const config = getTicketConfigByEvent(eventData.id);
        setTicketConfig(config);
        
        if (config && isCategoryAvailable(config.early).isBuyable) setActiveCategory('early');
        else if (config && isCategoryAvailable(config.presale).isBuyable) setActiveCategory('presale');
        else if (config && isCategoryAvailable(config.reguler).isBuyable) setActiveCategory('reguler');
        else setActiveCategory(''); 
    } else {
        navigate('/dashboard');
    }
  }, [eventData, navigate]);

  // --- LOGIKA LABEL KURSI ---
  const getSeatLabel = (index) => {
    const row = String.fromCharCode(65 + Math.floor(index / 10)); // A, B, C...
    const col = (index % 10) + 1;
    return `${row}${col}`;
  };

  // --- HANDLE KLIK KURSI ---
  const handleSeatClick = (seatId) => {
    if (!activeCategory) return alert("Pilih kategori tiket terlebih dahulu!");

    // Cek Batas Kuota Kategori
    if (!selectedSeats.includes(seatId)) {
        const currentCategoryQuota = ticketConfig[activeCategory].quota;
        if (selectedSeats.length >= currentCategoryQuota) {
            alert(`Kuota untuk kategori ${categoryLabels[activeCategory]} hanya tersisa ${currentCategoryQuota} tiket.`);
            return;
        }
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const pricePerTicket = (ticketConfig && activeCategory) ? ticketConfig[activeCategory].price : 0;
  const totalBayar = selectedSeats.length * pricePerTicket;

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

  const handleNext = () => {
    if (!activeCategory) return alert("Tidak ada kategori tiket yang tersedia.");
    if (selectedSeats.length === 0) return alert("Pilih minimal 1 kursi!");
    
    const qty = {
        early: activeCategory === 'early' ? selectedSeats.length : 0,
        presale: activeCategory === 'presale' ? selectedSeats.length : 0,
        reguler: activeCategory === 'reguler' ? selectedSeats.length : 0
    };

    navigate('/payment/info', { 
        state: { 
            eventData, 
            ticketData: { 
                qty, selectedSeats, totalBasePrice: totalBayar, priceSnapshot: ticketConfig 
            } 
        } 
    });
  };

  if (!ticketConfig) return <div style={{padding:'50px', textAlign:'center', color:'white', background:'#0B1120', minHeight:'100vh'}}>Loading...</div>;

  // --- FIX: AMBIL TOTAL SEATS DARI DATA ADMIN ---
  // Pastikan ambil properti totalSeats, konversi ke integer.
  // Jika admin tidak isi (undefined/null), fallback ke 100.
  const totalCapacity = (eventData && eventData.totalSeats) ? parseInt(eventData.totalSeats) : 100;
  
  // Generate Array Kursi
  const seatMap = Array.from({ length: totalCapacity }, (_, i) => getSeatLabel(i));

  return (
    <div style={{ backgroundColor: '#0B1120', minHeight: '100vh', color: 'white', paddingBottom: '40px' }}>
      <Navbar user={currentUser} />
      
      <div className="container" style={{ paddingTop: '40px' }}>
        
        {/* STEPPER */}
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
            
            {/* KIRI: AREA PANGGUNG & KURSI */}
            <div style={styles.leftPanel}>
                <h2 style={{color: '#111827', margin: '0 0 5px 0'}}>
                    {activeCategory ? `Pilih Kursi (${categoryLabels[activeCategory]})` : 'Tiket Tidak Tersedia'}
                </h2>
                <p style={{fontSize: '13px', color: '#666', marginBottom: '20px'}}>
                   Kapasitas Gedung: <b>{totalCapacity} Kursi</b>
                </p>
                
                <div style={styles.screen}>LAYAR PANGGUNG</div>

                {activeCategory ? (
                    <div style={styles.seatGrid}>
                        {seatMap.map((seatId) => {
                            const isSelected = selectedSeats.includes(seatId);
                            return (
                                <div 
                                    key={seatId}
                                    onClick={() => handleSeatClick(seatId)}
                                    style={{
                                        ...styles.seat,
                                        backgroundColor: isSelected ? '#F59E0B' : '#10B981',
                                        color: isSelected ? 'black' : 'white',
                                        border: isSelected ? '2px solid #D97706' : '1px solid #059669'
                                    }}
                                    title={`Kursi ${seatId}`}
                                >
                                    {seatId}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{color: 'red', padding: '20px'}}>
                        Maaf, tidak ada kategori tiket yang dibuka pada tanggal ini.
                    </div>
                )}

                <div style={styles.legend}>
                    <div style={styles.legendItem}><div style={{...styles.seatBox, background: '#10B981'}}></div> Tersedia</div>
                    <div style={styles.legendItem}><div style={{...styles.seatBox, background: '#F59E0B'}}></div> Dipilih</div>
                </div>
            </div>

            {/* KANAN: PILIH KATEGORI & SUMMARY */}
            <div style={styles.rightPanel}>
                <h3 style={{marginTop: 0}}>Pilih Kategori</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    {['early', 'presale', 'reguler'].map(cat => {
                        const info = ticketConfig[cat];
                        const { isDateValid, hasQuota, isBuyable } = isCategoryAvailable(info);
                        const isActive = activeCategory === cat;

                        let statusLabel = 'Available';
                        let statusColor = '#10B981'; 

                        if (!isDateValid) {
                            const now = new Date(); now.setHours(0,0,0,0);
                            const start = new Date(info.start);
                            if (now < start) { statusLabel = 'Coming Soon'; statusColor = '#3B82F6'; } 
                            else { statusLabel = 'Closed'; statusColor = '#6B7280'; }
                        } else if (!hasQuota) {
                            statusLabel = 'Sold Out'; statusColor = '#EF4444';
                        }

                        return (
                            <div 
                                key={cat}
                                onClick={() => {
                                    if (isBuyable) {
                                        setActiveCategory(cat);
                                        setSelectedSeats([]); 
                                    }
                                }}
                                style={{
                                    ...styles.categoryCard,
                                    border: isActive ? '2px solid #F59E0B' : '1px solid #374151',
                                    opacity: isBuyable ? 1 : 0.6,
                                    cursor: isBuyable ? 'pointer' : 'not-allowed',
                                    backgroundColor: isBuyable ? '#1F2937' : '#111827'
                                }}
                            >
                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                    <span style={{fontWeight: 'bold'}}>{categoryLabels[cat]}</span>
                                    <span style={{fontSize:'12px', background: statusColor, padding:'2px 6px', borderRadius:'4px'}}>
                                        {statusLabel}
                                    </span>
                                </div>
                                <div style={{color: '#F59E0B', fontWeight: 'bold'}}>{formatRupiah(info.price)}</div>
                                <div style={{fontSize: '11px', color: '#9CA3AF'}}>
                                    {isDateValid ? `Batas Beli: ${info.quota}` : `Buka: ${info.start}`}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div style={styles.summaryBox}>
                    <h3 style={{margin: '0 0 15px 0', borderBottom: '1px solid #555', paddingBottom: '10px'}}>Ringkasan</h3>
                    <div style={styles.summaryRow}>
                        <span style={{color: '#D1D5DB'}}>Kategori</span>
                        <span style={{fontWeight: 'bold'}}>{activeCategory ? categoryLabels[activeCategory] : '-'}</span>
                    </div>
                    <div style={styles.summaryRow}>
                        <span style={{color: '#D1D5DB'}}>Kursi ({selectedSeats.length})</span>
                        <span style={{fontWeight: 'bold', color: '#F59E0B', maxWidth: '120px', textAlign: 'right', fontSize: '13px', wordBreak: 'break-word'}}>
                            {selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}
                        </span>
                    </div>
                    
                    <div style={{...styles.summaryRow, marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #555', fontSize: '18px'}}>
                        <span>Total</span>
                        <span style={{color: '#F59E0B', fontWeight: 'bold'}}>{formatRupiah(totalBayar)}</span>
                    </div>

                    <button 
                        onClick={handleNext} 
                        disabled={selectedSeats.length === 0}
                        style={selectedSeats.length === 0 ? styles.btnDisabled : styles.btnNext}
                    >
                        Lanjut ke Data Diri ➔
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

const styles = {
    stepBar: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F59E0B', padding: '15px', borderRadius: '50px', marginBottom: '40px', color: '#553C00', gap: '15px', flexWrap: 'wrap', maxWidth: '800px', margin: '0 auto 40px' },
    stepItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
    separator: { fontSize: '24px', fontWeight: 'bold', color: '#553C00', marginTop: '-4px' },
    stepCircleActive: { width: '28px', height: '28px', backgroundColor: 'black', color: '#F59E0B', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '14px' },
    stepCircle: { width: '26px', height: '26px', border: '2px solid #553C00', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '14px' },
    layoutGrid: { display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '30px', alignItems: 'start' },
    leftPanel: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center' },
    rightPanel: { display: 'flex', flexDirection: 'column', gap: '20px' },
    screen: { backgroundColor: '#374151', color: 'white', padding: '10px', marginBottom: '30px', borderRadius: '8px', fontWeight: 'bold', letterSpacing: '2px', width: '80%', margin: '0 auto 30px', boxShadow: '0 5px 10px rgba(0,0,0,0.2)' },
    seatGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxHeight: '400px', overflowY: 'auto', padding: '10px' },
    seat: { width: '40px', height: '35px', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none', transition: '0.2s' },
    legend: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' },
    legendItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333' },
    seatBox: { width: '20px', height: '20px', borderRadius: '4px' },
    categoryCard: { backgroundColor: '#1F2937', padding: '15px', borderRadius: '8px', color: 'white', transition: '0.2s' },
    summaryBox: { backgroundColor: '#111827', borderRadius: '12px', padding: '20px', color: 'white' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' },
    btnNext: { width: '100%', padding: '15px', background: '#F59E0B', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '20px', color: 'black' },
    btnDisabled: { width: '100%', padding: '15px', background: '#374151', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'not-allowed', marginTop: '20px', color: '#6B7280' }
};

export default PaymentSelect;