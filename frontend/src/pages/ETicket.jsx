// src/pages/ETicket.jsx
import React, { useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { getCurrentUser } from '../utils/authStore';

const ETicket = () => {
  const location = useLocation();
  const ticketRef = useRef();
  const currentUser = getCurrentUser(); 

  // --- LOGIKA CERDAS DETEKSI DATA ---
  const state = location.state || {};

  // 1. Cek apakah data datang dari Dashboard (Flat) atau Checkout (Nested)
  const rawEvent = state.eventData || state; 
  
  // 2. Normalisasi Data Event (Agar seragam)
  const eventInfo = {
      nama: rawEvent.nama || rawEvent.title || rawEvent.event || "Nama Event Tidak Ditemukan",
      jadwal: rawEvent.jadwal || rawEvent.date || "-",
      lokasi: rawEvent.lokasi || rawEvent.location || "-",
      kota: rawEvent.kota || "-",
      jam: rawEvent.jam || rawEvent.time || "Open Gate",
      image: rawEvent.image // Bisa undefined
  };

  // 3. Normalisasi Data User
  const userInfo = {
      nama: state.userData?.fullName || state.user || currentUser?.fullName || "Guest",
      email: state.userData?.email || state.email || currentUser?.email || "-"
  };

  // 4. Normalisasi Data Tiket/Kursi
  const seatInfo = state.ticketData?.selectedSeats?.join(', ') 
                   || state.seat 
                   || state.selectedSeats 
                   || "-";

  const invoiceID = state.invoiceID || state.qrData || "INV-UNKNOWN";

  // --- END LOGIKA ---

  const handleDownloadPDF = async () => {
    const element = ticketRef.current;
    if(!element) return;
    
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`E-Ticket-${invoiceID}.pdf`);
  };

  if (!invoiceID || invoiceID === "INV-UNKNOWN") {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'white', background: '#0B1120', minHeight: '100vh' }}>
        <h2>Data Tiket Tidak Ditemukan</h2>
        <p>Silakan akses dari Dashboard.</p>
        <Link to="/dashboard" style={{ color: '#F59E0B' }}>Kembali ke Dashboard</Link>
      </div>
    );
  }

  return (
    <>
      <Navbar user={currentUser} />
      <div style={{ backgroundColor: '#0B1120', minHeight: '100vh', padding: '40px 20px', color: 'white' }}>
        
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#10B981', margin: 0 }}>E-TICKET</h1>
            <p style={{ color: '#9CA3AF' }}>Tunjukkan QR Code ini saat masuk.</p>
          </div>

          {/* KARTU TIKET */}
          <div 
            ref={ticketRef} 
            style={{ 
              backgroundColor: 'white', 
              color: '#111827', 
              borderRadius: '16px', 
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
          >
            {/* Header Kuning */}
            <div style={{ backgroundColor: '#F59E0B', padding: '20px', textAlign: 'center', borderBottom: '2px dashed #000' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '1px' }}>TIKET MASUK</h2>
              <p style={{ margin: '5px 0 0', fontWeight: 'bold', fontSize: '14px' }}>{invoiceID}</p>
            </div>

            {/* Isi Tiket */}
            <div style={{ padding: '30px' }}>
              
              {/* Nama Event */}
              <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Event</p>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0', color:'#111827' }}>
                    {eventInfo.nama}
                </h2>
                <p style={{ color: '#4B5563', margin: 0, fontSize:'14px' }}>
                    WarTawa Live Experience
                </p>
              </div>

              {/* Grid Info Tanggal & Lokasi */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px', borderBottom:'1px solid #eee', paddingBottom:'20px' }}>
                <div>
                  <p style={styles.label}>Tanggal</p>
                  <p style={styles.value}>{eventInfo.jadwal}</p>
                </div>
                <div>
                  <p style={styles.label}>Waktu</p>
                  <p style={styles.value}>{eventInfo.jam}</p>
                </div>
                <div>
                  <p style={styles.label}>Lokasi</p>
                  <p style={styles.value}>{eventInfo.lokasi}</p>
                </div>
                <div>
                  <p style={styles.label}>Kota</p>
                  <p style={styles.value}>{eventInfo.kota}</p>
                </div>
              </div>

              {/* Info Pemilik */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                 <div>
                    <p style={styles.label}>Nama Pengunjung</p>
                    <p style={{...styles.value, fontSize:'16px'}}>{userInfo.nama}</p>
                    <p style={{fontSize: '12px', color: '#666'}}>{userInfo.email}</p>
                 </div>
                 <div style={{textAlign:'right'}}>
                    <p style={styles.label}>Kursi</p>
                    <p style={{...styles.value, fontSize:'18px', color:'#F59E0B'}}>{seatInfo}</p>
                 </div>
              </div>

              {/* QR Code */}
              <div style={{ marginTop: '20px', textAlign: 'center', background:'#F9FAFB', padding:'20px', borderRadius:'12px' }}>
                 <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${invoiceID}`} 
                    alt="QR Code" 
                    style={{ width: '130px', height: '130px', mixBlendMode:'multiply' }}
                 />
                 <p style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '10px' }}>Scan validasi di pintu masuk</p>
              </div>

            </div>
          </div>

          <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
             <button onClick={handleDownloadPDF} style={styles.btnPrimary}>
                ⬇ Simpan PDF
             </button>
             <Link to="/dashboard" style={styles.btnSecondary}>
                Kembali
             </Link>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
    label: { fontSize: '12px', color: '#6B7280', marginBottom: '4px', textTransform:'uppercase' },
    value: { fontSize: '14px', fontWeight: 'bold', color: '#111827', margin: 0 },
    btnPrimary: { flex: 1, padding: '15px', background: '#F59E0B', border: 'none', borderRadius: '8px', color: 'black', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
    btnSecondary: { flex: 1, padding: '15px', background: '#374151', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', textDecoration: 'none', textAlign: 'center' }
};

export default ETicket;