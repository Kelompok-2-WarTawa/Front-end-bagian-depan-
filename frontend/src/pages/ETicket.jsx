// src/pages/ETicket.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';

const ETicket = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = { name: "Sutejo" };

  // Data Tiket (Default jika akses langsung)
  const ticketData = location.state || {
    title: "Event Name", date: "-", time: "-", location: "-", qrData: "0000",
    invoiceID: "-", amount: "-", method: "-",
    user: "-", email: "-", phoneNumber: "-", idNumber: "-"
  };

  return (
    <>
      <Navbar user={currentUser} />
      
      <div style={{ backgroundColor: '#0B1120', minHeight: '100vh', padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        <div style={styles.ticketContainer}>
            
            {/* 1. HEADER (GAMBAR) */}
            <div style={styles.ticketHeader}>
                <img 
                    src="https://placehold.co/600x200/111/F59E0B?text=EKRESA+CERITA+ANEHKU" 
                    alt="Banner" 
                    style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                />
                <div style={styles.overlay}>
                    <h2 style={{color: 'white', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>{ticketData.title}</h2>
                    <span style={styles.statusBadge}>LUNAS</span>
                </div>
            </div>

            {/* 2. BODY (INFORMASI TIKET & DATA DIRI LENGKAP) */}
            <div style={styles.ticketBody}>
                
                {/* Baris 1: Nama & No. ID */}
                <div style={styles.row}>
                    <div style={{flex: 1}}>
                        <p style={styles.label}>Nama Lengkap</p>
                        <p style={styles.value}>{ticketData.user}</p>
                    </div>
                </div>

                <hr style={{border: 'none', borderTop: '1px solid #ddd', margin: '15px 0'}} />

                {/* Baris 3: Jadwal Event */}
                <div style={styles.row}>
                    <div>
                        <p style={styles.label}>Tanggal</p>
                        <p style={styles.value}>{ticketData.date}</p>
                    </div>
                    <div style={{textAlign: 'right'}}>
                        <p style={styles.label}>Jam</p>
                        <p style={styles.value}>{ticketData.time}</p>
                    </div>
                </div>

                <div style={{marginTop: '10px'}}>
                    <p style={styles.label}>Lokasi</p>
                    <p style={styles.value}>{ticketData.location}</p>
                </div>
            </div>

            {/* 3. GARIS SOBEKAN */}
            <div style={styles.ripLine}>
                <div style={styles.circleLeft}></div>
                <div style={styles.dashedLine}></div>
                <div style={styles.circleRight}></div>
            </div>

            {/* 4. RINCIAN PEMBAYARAN */}
            <div style={{padding: '20px 25px', backgroundColor: '#FFFBEB'}}>
                <h4 style={{margin: '0 0 15px 0', borderBottom: '1px solid #ccc', paddingBottom: '5px', fontSize: '14px', color: '#555'}}>Rincian Pembayaran</h4>
                
                <div style={styles.rowSmall}>
                    <span>No. Invoice</span>
                    <span style={{fontWeight: 'bold', fontFamily: 'monospace'}}>{ticketData.invoiceID}</span>
                </div>
                <div style={styles.rowSmall}>
                    <span>Metode Bayar</span>
                    <span>{ticketData.method}</span>
                </div>
                <div style={{...styles.rowSmall, marginTop: '10px', fontSize: '16px', color: '#0E3695', fontWeight: 'bold'}}>
                    <span>Total Bayar</span>
                    <span>{ticketData.amount}</span>
                </div>
            </div>

            {/* 5. FOOTER (QR CODE) */}
            <div style={styles.ticketFooter}>
                <div style={{background: 'white', padding: '10px', borderRadius: '8px', display: 'inline-block', border: '1px solid #ddd'}}>
                     <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketData.qrData}`} 
                        alt="QR Code" 
                    />
                </div>
                <p style={{textAlign: 'center', fontSize: '12px', color: '#666', marginTop: '10px'}}>
                    Scan QR Code ini di pintu masuk
                </p>

                <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
                    &larr; Kembali ke Dashboard
                </button>
            </div>

        </div>
      </div>
    </>
  );
};

const styles = {
  ticketContainer: {
    backgroundColor: '#FFFBEB', width: '100%', maxWidth: '400px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
  },
  ticketHeader: { height: '150px', position: 'relative' },
  overlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', justifyContent: 'space-between', alignItems: 'end'
  },
  statusBadge: { backgroundColor: '#10B981', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' },
  
  ticketBody: { padding: '25px', color: '#333' },
  
  row: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
  rowSmall: { display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px', color: '#333' },
  
  label: { fontSize: '12px', color: '#888', marginBottom: '2px' },
  value: { fontSize: '15px', fontWeight: 'bold', color: '#000', margin: 0 },
  
  // Styles Sobekan
  ripLine: { position: 'relative', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  circleLeft: { position: 'absolute', left: '-10px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#0B1120' },
  circleRight: { position: 'absolute', right: '-10px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#0B1120' },
  dashedLine: { width: '100%', borderTop: '2px dashed #ccc', margin: '0 20px' },

  ticketFooter: { padding: '20px', textAlign: 'center', backgroundColor: '#F3F4F6' },
  backButton: { marginTop: '10px', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }
};

export default ETicket;