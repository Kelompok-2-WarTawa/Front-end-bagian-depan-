// src/pages/PaymentSelect.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCurrentUser } from '../utils/authStore';
import { getTicketConfigByEvent } from '../utils/ticketStore';
import { getEvents } from '../utils/eventStore';

const PaymentSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Data awal
  const initialEventData = location.state?.eventData || {}; 
  const currentUser = getCurrentUser() || { name: "Guest" };

  // --- KONFIGURASI LAYOUT ---
  const seatsPerRow = 10; 

  const [currentEvent, setCurrentEvent] = useState(initialEventData);
  const [ticketConfig, setTicketConfig] = useState(null);
  const [activeCategory, setActiveCategory] = useState(''); 
  const [selectedSeats, setSelectedSeats] = useState([]); 

  const categoryLabels = {
    early: 'Early Bird',
    presale: 'Presale',
    reguler: 'Reguler'
  };

  // Helper Validasi
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
    if (initialEventData?.id) {
        const allEvents = getEvents();
        const freshEventData = allEvents.find(e => e.id === initialEventData.id);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (freshEventData) setCurrentEvent(freshEventData);

        const config = getTicketConfigByEvent(initialEventData.id);
        setTicketConfig(config);
        
        if (config && isCategoryAvailable(config.early).isBuyable) setActiveCategory('early');
        else if (config && isCategoryAvailable(config.presale).isBuyable) setActiveCategory('presale');
        else if (config && isCategoryAvailable(config.reguler).isBuyable) setActiveCategory('reguler');
        else setActiveCategory(''); 
    } else {
        navigate('/dashboard');
    }
  }, [initialEventData, navigate]);

  // Label A1, A2... B1...
  const getSeatLabel = (index) => {
    const rowChar = String.fromCharCode(65 + Math.floor(index / seatsPerRow)); 
    const colNum = (index % seatsPerRow) + 1; 
    return `${rowChar}${colNum}`;
  };

  const handleSeatClick = (seatId) => {
    if (!activeCategory) return alert("Pilih kategori tiket terlebih dahulu!");

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
      return;
    }

    const currentCategoryQuota = ticketConfig[activeCategory].quota;
    if (selectedSeats.length >= currentCategoryQuota) {
        alert(`Maksimal pembelian untuk kategori ${categoryLabels[activeCategory]} adalah ${currentCategoryQuota} tiket.`);
        return;
    }

    setSelectedSeats([...selectedSeats, seatId]);
  };

  const pricePerTicket = (ticketConfig && activeCategory) ? ticketConfig[activeCategory].price : 0;
  const totalBayar = selectedSeats.length * pricePerTicket;
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);

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
            eventData: currentEvent,
            ticketData: { qty, selectedSeats, totalBasePrice: totalBayar, priceSnapshot: ticketConfig } 
        } 
    });
  };

  if (!ticketConfig) return <div style={{padding:'50px', textAlign:'center', color:'white', background:'#0B1120', minHeight:'100vh'}}>Loading...</div>;

  const totalCapacity = (currentEvent && currentEvent.totalSeats) ? parseInt(currentEvent.totalSeats) : 100;
  const seatMap = Array.from({ length: totalCapacity }, (_, i) => getSeatLabel(i));

  return (
    <div style={{ backgroundColor: '#0B1120', minHeight: '100vh', color: 'white', paddingBottom: '40px' }}>
      <Navbar user={currentUser} />
      
      <div className="container" style={{ paddingTop: '40px' }}>
        
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
            
            {/* Grid Kursi */}
            <div style={styles.leftPanel}>
                <h2 style={{color: '#111827', margin: '0 0 5px 0', textAlign: 'center'}}>
                    {activeCategory ? `Pilih Kursi (${categoryLabels[activeCategory]})` : 'Tiket Tidak Tersedia'}
                </h2>
                <p style={{fontSize: '13px', color: '#6B7280', marginBottom: '30px', textAlign: 'center'}}>
                   Kapasitas Gedung: <b>{totalCapacity} Kursi</b>
                </p>
                
                {/* Visual Layar */}
                <div style={styles.screenContainer}>
                    <div style={styles.screen}>SCREEN</div>
                </div>

                {activeCategory ? (
                    <div style={{
                        ...styles.seatGrid,
                        display: 'grid', 
                        gridTemplateColumns: `repeat(${seatsPerRow}, 1fr)`, 
                    }}>
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
                                        border: isSelected ? '1px solid #D97706' : '1px solid #059669',
                                        boxShadow: isSelected ? '0 0 8px rgba(245, 158, 11, 0.6)' : 'none'
                                    }}
                                    title={`Kursi ${seatId}`}
                                >
                                    {seatId}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{textAlign:'center', color: '#EF4444', padding: '20px', background: '#FEF2F2', borderRadius: '8px'}}>
                        Maaf, tidak ada kategori tiket yang dibuka pada tanggal ini.
                    </div>
                )}

                {/* LEGEND (KETERANGAN) */}
                <div style={styles.legend}>
                    <div style={styles.legendItem}>
                        <div style={{...styles.seatBox, background: '#10B981', border: '1px solid #059669'}}></div> 
                        <span>Tersedia</span>
                    </div>
                    <div style={styles.legendItem}>
                        <div style={{...styles.seatBox, background: '#F59E0B', border: '1px solid #D97706'}}></div> 
                        <span>Dipilih</span>
                    </div>
                    <div style={styles.legendItem}>
                        <div style={{...styles.seatBox, background: '#E5E7EB', border: '1px solid #9CA3AF'}}></div> 
                        <span style={{color: '#9CA3AF'}}>Tidak Tersedia</span>
                    </div>
                </div>
            </div>

            {/* PANEL KANAN (Harga) */}
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
                                onClick={() => isBuyable && (setActiveCategory(cat), setSelectedSeats([]))}
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
                                    <span style={{fontSize:'10px', background: statusColor, padding:'2px 6px', borderRadius:'4px', alignSelf:'center'}}>
                                        {statusLabel}
                                    </span>
                                </div>
                                <div style={{color: '#F59E0B', fontWeight: 'bold', margin:'5px 0'}}>{formatRupiah(info.price)}</div>
                                <div style={{fontSize: '11px', color: '#9CA3AF'}}>
                                    {isDateValid ? `Sisa Kuota: ${info.quota}` : `Buka: ${info.start}`}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div style={styles.summaryBox}>
                    <h3 style={{margin: '0 0 15px 0', borderBottom: '1px solid #374151', paddingBottom: '10px'}}>Ringkasan</h3>
                    <div style={styles.summaryRow}>
                        <span style={{color: '#9CA3AF'}}>Kursi</span>
                        <span style={{fontWeight: 'bold', color: '#F59E0B', textAlign: 'right', fontSize: '13px', maxWidth:'120px', wordBreak:'break-word'}}>
                            {selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}
                        </span>
                    </div>
                    <div style={{...styles.summaryRow, marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #374151', fontSize: '18px'}}>
                        <span>Total</span>
                        <span style={{color: '#F59E0B', fontWeight: 'bold'}}>{formatRupiah(totalBayar)}</span>
                    </div>
                    <button 
                        onClick={handleNext} 
                        disabled={selectedSeats.length === 0}
                        style={selectedSeats.length === 0 ? styles.btnDisabled : styles.btnNext}
                    >
                        Lanjut Bayar ➔
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
    leftPanel: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', minHeight: '550px', display: 'flex', flexDirection: 'column' },
    rightPanel: { display: 'flex', flexDirection: 'column', gap: '20px' },
    
    // VISUAL LAYAR (SCREEN)
    screenContainer: { display: 'flex', justifyContent: 'center', marginBottom: '30px' },
    screen: { 
        backgroundColor: '#374151', 
        color: '#9CA3AF', 
        padding: '10px 0', 
        textAlign: 'center',
        fontWeight: 'bold', 
        letterSpacing: '4px', 
        width: '80%', 
        borderRadius: '8px',
        boxShadow: '0 8px 15px -5px rgba(0,0,0,0.2)',
        borderBottom: '4px solid #F59E0B' 
    },
    
    // GRID KURSI
    seatGrid: { 
        gap: '10px', 
        justifyContent: 'center', 
        maxHeight: '400px', 
        overflowY: 'auto', 
        padding: '10px 20px',
        marginBottom: '20px',
        margin: '0 auto' // Center grid
    },
    
    // VISUAL KURSI 
    seat: { 
        height: '40px', 
        borderRadius: '8px 8px 4px 4px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        fontSize: '11px', 
        fontWeight: 'bold', 
        cursor: 'pointer', 
        userSelect: 'none', 
        transition: 'all 0.2s ease',
        minWidth: '35px'
    },
    
    // LEGEND (KETERANGAN)
    legend: { 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '25px', 
        marginTop: 'auto', 
        paddingTop: '20px',
        borderTop: '1px solid #E5E7EB'
    },
    legendItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151', fontWeight: '500' },
    seatBox: { width: '20px', height: '20px', borderRadius: '4px' },
    
    categoryCard: { padding: '15px', borderRadius: '8px', color: 'white', transition: '0.2s' },
    summaryBox: { backgroundColor: '#111827', borderRadius: '12px', padding: '20px', color: 'white' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' },
    btnNext: { width: '100%', padding: '15px', background: '#F59E0B', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '20px', color: 'black', transition: '0.2s hover' },
    btnDisabled: { width: '100%', padding: '15px', background: '#374151', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'not-allowed', marginTop: '20px', color: '#6B7280' }
};

export default PaymentSelect;