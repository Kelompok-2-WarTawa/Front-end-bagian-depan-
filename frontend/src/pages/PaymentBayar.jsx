// src/pages/PaymentBayar.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateTransactionStatus } from '../utils/transactionStore'; 
import { getCurrentUser } from '../utils/authStore';

const PaymentBayar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Ambil User
  const currentUser = getCurrentUser() || { name: "Guest", email: "guest@example.com" };

  // 2. AMBIL DATA DARI PAGE SEBELUMNYA
  const { 
    eventData, 
    ticketData, 
    userData, 
    paymentMethod, 
    invoiceID, 
    savedTransaction // <-- INI PENTING: Total harga yang benar ada di sini
  } = location.state || {};

  // Jika data hilang (refresh page sembarangan), kembalikan ke dashboard
  if (!invoiceID || !savedTransaction) {
      return (
        <div style={{textAlign:'center', padding:'50px', background:'#0B1120', color:'white', minHeight:'100vh'}}>
           <h2>Data Transaksi Tidak Ditemukan</h2>
           <button onClick={() => navigate('/dashboard')} style={{padding:'10px', marginTop:'20px'}}>Kembali ke Dashboard</button>
        </div>
      );
  }

  // --- DEFINISI VARIABEL UI (Agar sesuai dengan kode UI Anda) ---
  const isVirtualAccount = paymentMethod.toLowerCase().includes('virtual account');
  
  // Generate VA Dummy (Atau ambil dari savedTransaction jika ada)
  const [nomorVA] = useState("880" + Math.floor(1000000000 + Math.random() * 9000000000));

  // Extract Data Tiket untuk Rincian (Fallback ke 0 jika undefined)
  const qtyEarly = ticketData?.qty?.early || 0;
  const qtyPresale = ticketData?.qty?.presale || 0;
  const qtyReguler = ticketData?.qty?.reguler || 0;
  const priceSnapshot = ticketData?.priceSnapshot || { early:{price:0}, presale:{price:0}, reguler:{price:0} };

  // Hitung Biaya Tambahan (Hanya untuk display rincian)
  const adminFee = 20000;
  const platformFee = 29000; 
  const totalBasePrice = ticketData?.totalBasePrice || 0;
  const tax = totalBasePrice * 0.11;

  // --- LOGIKA TIMER ---
  const [timeLeft, setTimeLeft] = useState(3600);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  const deadline = new Date();
  deadline.setHours(deadline.getHours() + 1);
  const deadlineString = deadline.toLocaleString('id-ID', { 
    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  // --- LOGIKA PENYELESAIAN ---
  const handleCompletePayment = () => {
    // 1. Update status jadi LUNAS di database
    updateTransactionStatus(invoiceID, 'Lunas');
    
    // 2. Pindah ke E-Ticket membawa semua data
    alert("Pembayaran Berhasil! Data telah masuk ke sistem.");
    navigate('/eticket', { 
        state: { eventData, ticketData, userData, invoiceID, paymentMethod } 
    });
  };

  return (
    <>
      <Navbar user={currentUser} />

      <div style={{backgroundColor: '#0B1120', minHeight: '100vh', paddingBottom: '50px'}}>
        
        <div style={styles.mainCard}>
            <div style={styles.bannerContainer}>
                <img 
                    // Gunakan gambar dari eventData, fallback ke placeholder jika kosong
                    src={eventData?.image || "https://placehold.co/800x200/111/F59E0B?text=EVENT"} 
                    alt="Event" 
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
            </div>

            <div style={{textAlign: 'center', padding: '20px'}}>
                {timeLeft > 0 ? (
                    <>
                        <p style={{color: '#000000ff', marginBottom: '5px'}}>Sisa waktu untuk menyelesaikan pembayaran</p>
                        <h1 style={{fontSize: '40px', margin: '10px 0', color: 'black', fontWeight: 'bold'}}>
                            {formatTime(timeLeft)}
                        </h1>
                        <div style={{display: 'flex', justifyContent: 'center', gap: '30px', fontSize: '12px', color: '#000000ff'}}>
                            <span>Jam</span><span>Menit</span><span>Detik</span>
                        </div>
                        
                        <p style={{marginTop: '20px', fontSize: '14px', color: '#000000ff'}}>
                            Batas Pembayaran: <b>{deadlineString}</b> <br/>
                            Jika kamu melewati batas pembayaran, pesanan tiketmu akan secara otomatis dibatalkan
                        </p>
                    </>
                ) : (
                    <div style={{padding: '20px', backgroundColor: '#FECACA', color: '#991B1B', borderRadius: '8px'}}>
                        <h3>Waktu Pembayaran Habis!</h3>
                        <p>Silakan lakukan pemesanan ulang.</p>
                    </div>
                )}
            </div>

            {/* PAYMENT METHOD DISPLAY */}
            <div style={{textAlign: 'center', marginTop: '10px', marginBottom: '30px', padding: '0 20px'}}>
                <h3 style={{color: '#0E3695', marginBottom: '20px'}}>
                    Selesaikan pembayaran dengan {paymentMethod}
                </h3>

                {isVirtualAccount ? (
                    <div style={{backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                        <p style={{color: '#666', marginBottom: '5px'}}>Nomor Virtual Account</p>
                        <h2 style={{color: '#0E3695', fontSize: '32px', margin: '10px 0', letterSpacing: '2px', wordBreak: 'break-all'}}>
                            {nomorVA}
                        </h2>
                        <button 
                            onClick={() => alert('Nomor VA berhasil disalin!')}
                            style={styles.actionButton}
                        >
                            Salin Nomor VA
                        </button>
                    </div>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div style={{backgroundColor: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${invoiceID}`} 
                                alt="QR Code" 
                            />
                        </div>
                        <p style={{margin: '15px 0', fontWeight: 'bold', color: '#333'}}>Pindai Kode QR di atas</p>
                        <button 
                            onClick={() => alert('QR Code berhasil diunduh!')}
                            style={styles.actionButton}
                        >
                            Unduh Kode QR
                        </button>
                    </div>
                )}
            </div>

            {/* INVOICE CARD */}
            <div style={styles.invoiceCard}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px'}}>
                    <span style={{fontWeight: 'bold', fontSize: '18px'}}>{paymentMethod}</span>
                </div>

                <div style={{marginBottom: '20px'}}>
                    <p style={{fontSize: '12px', color: '#666', margin: 0}}>Kode Invoice</p>
                    <p style={{fontWeight: 'bold', fontSize: '16px', margin: '5px 0'}}>{invoiceID}</p>
                    
                    <p style={{fontSize: '12px', color: '#666', margin: '15px 0 0 0'}}>Total Pembayaran</p>
                    <p style={{fontWeight: 'bold', fontSize: '20px', margin: '5px 0', color: '#059669'}}>
                        {savedTransaction?.amount}
                    </p>
                </div>

                <hr style={{border: 'none', borderTop: '1px solid #eee', margin: '15px 0'}}/>

                {qtyEarly > 0 && (
                    <div style={styles.row}>
                        <span>Early Bird ({qtyEarly})</span>
                        <span>{formatRupiah(qtyEarly * priceSnapshot.early.price)}</span>
                    </div>
                )}
                {qtyPresale > 0 && (
                    <div style={styles.row}>
                        <span>Presale ({qtyPresale})</span>
                        <span>{formatRupiah(qtyPresale * priceSnapshot.presale.price)}</span>
                    </div>
                )}
                {qtyReguler > 0 && (
                    <div style={styles.row}>
                        <span>Reguler ({qtyReguler})</span>
                        <span>{formatRupiah(qtyReguler * priceSnapshot.reguler.price)}</span>
                    </div>
                )}
                
                <div style={styles.row}><span>Local Tax (11%)</span><span>{formatRupiah(tax)}</span></div>
                <div style={styles.row}><span>Biaya Admin</span><span>{formatRupiah(adminFee)}</span></div>
                <div style={styles.row}><span>Biaya Platform</span><span>{formatRupiah(platformFee)}</span></div>

            </div>

            <div style={{textAlign: 'center', marginTop: '30px', padding: '0 20px'}}>
                 <button 
                    onClick={handleCompletePayment}
                    style={{
                        backgroundColor: '#10B981', color: 'white', border: 'none', 
                        padding: '15px', width: '100%', borderRadius: '8px', 
                        fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', marginBottom: '15px'
                    }}
                 >
                    Check Status Pesanan
                 </button>

                 <button onClick={() => navigate('/dashboard')} style={{background: 'none', border: 'none', color: 'white', textDecoration: 'underline', cursor: 'pointer'}}>
                    Batalkan Pesanan
                 </button>
            </div>

        </div>
      </div>
    </>
  );
};


const styles = {
  mainCard: { backgroundColor: '#F59E0B', borderRadius: '12px', maxWidth: '600px', margin: '0 auto', minHeight: '100vh', paddingBottom: '40px', boxShadow: '0 0 20px rgba(0,0,0,0.5)', position: 'relative' },
  bannerContainer: { width: '100%', height: '180px', overflow: 'hidden', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' },
  actionButton: { backgroundColor: '#0E3695', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  invoiceCard: { backgroundColor: '#FFFBEB', borderRadius: '12px', padding: '25px', margin: '0 20px', color: '#333' },
  row: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', fontWeight: '500' }
};

export default PaymentBayar;