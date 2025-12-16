import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TicketPay from '../components/TicketPay'; 
import { useNavigate, useLocation } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedTicket, setSelectedTicket] = useState(null); 
  const [showModal, setShowModal] = useState(false);

  // --- EFEK OTOMATIS PINDAH TAB ---
  useEffect(() => {
    if (location.state && location.state.defaultTab) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(location.state.defaultTab);
    }
  }, [location]);

  // Data User Dummy
  const currentUser = {
    name: "Sutejo", email: "sutejo@example.com", phone: "0812-3456-7890", role: "Member", joinDate: "20 Januari 2025", avatar: "https://placehold.co/150x150/F59E0B/black?text=S"
  };

  // Data Tiket Dummy
  const myTickets = [
    { id: 1, bookingCode: "WT-882190", eventName: "Bell's Comedy Club Special", date: "12 Jan 2025", time: "19:00 WIB", location: "Balai Sarbini, Jakarta", qty: 2, type: "VIP", totalPrice: 300000, status: "PAID", image: "https://placehold.co/150x150/1a1a1a/F59E0B?text=Bells" },
    { id: 2, bookingCode: "WT-112344", eventName: "Open Mic Night Bandung", date: "14 Jan 2025", time: "20:00 WIB", location: "The Hall, Bandung", qty: 1, type: "Regular", totalPrice: 75000, status: "PENDING", image: "https://placehold.co/150x150/1a1a1a/F59E0B?text=Open+Mic" }
  ];

  const handleLogout = () => navigate('/login');
  const handleShowQR = (ticket) => { setSelectedTicket(ticket); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); setSelectedTicket(null); };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div style={styles.rightCard}>
            <h3 style={styles.cardTitle}>Ubah Informasi Dasar</h3>
            <form>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Username</label>
                  <input type="text" defaultValue={currentUser.name} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email</label>
                  <input type="email" defaultValue={currentUser.email} style={styles.input} disabled />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nomor Telepon</label>
                  <input type="tel" defaultValue={currentUser.phone} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Bergabung Sejak</label>
                  <div style={{...styles.input, backgroundColor: 'transparent', border: '1px solid #374151', color: '#9CA3AF'}}>
                     {currentUser.joinDate}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-gold" style={{ padding: '12px 40px' }}>Simpan Perubahan</button>
              </div>
            </form>
          </div>
        );

      case 'tickets':
        return (
          <div style={{...styles.rightCard, backgroundColor: 'transparent', border: 'none', padding: 0}}>
            <h3 style={{...styles.cardTitle, color: 'white'}}>Tiket Saya ({myTickets.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {myTickets.map(ticket => (
                <TicketPay key={ticket.id} data={ticket} onShowQR={handleShowQR} />
              ))}
            </div>
          </div>
        );

      // --- HALAMAN PENGATURAN ---
      case 'settings':
        return (
          <div style={styles.rightCard}>
            <h3 style={styles.cardTitle}>Pengaturan Akun</h3>
            
            {/* Form Ganti Password */}
            <div style={{ marginBottom: '40px' }}>
              <h4 style={{ color: '#F59E0B', marginBottom: '20px' }}>🔐 Keamanan</h4>
              <form>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Password Saat Ini</label>
                    <input type="password" placeholder="Masukan password lama..." style={styles.input} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Password Baru</label>
                      <input type="password" placeholder="Password baru..." style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Konfirmasi Password</label>
                      <input type="password" placeholder="Ulangi password baru..." style={styles.input} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                     <button type="button" className="btn btn-outline" style={{ padding: '10px 30px' }}>Update Password</button>
                  </div>
                </div>
              </form>
            </div>

            <div style={{height: '1px', background: '#374151', margin: '30px 0'}}></div>

            {/* Preferensi Notifikasi */}
            <div>
              <h4 style={{ color: '#F59E0B', marginBottom: '20px' }}>🔔 Preferensi Notifikasi</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label style={styles.checkboxLabel}>
                  <input type="checkbox" defaultChecked style={{ marginRight: '10px' }} />
                  Kirim notifikasi email untuk event mendatang
                </label>
                <label style={styles.checkboxLabel}>
                  <input type="checkbox" defaultChecked style={{ marginRight: '10px' }} />
                  Info promo dan diskon tiket
                </label>
                <label style={styles.checkboxLabel}>
                  <input type="checkbox" style={{ marginRight: '10px' }} />
                  Berita terbaru seputar Stand Up Comedy
                </label>
              </div>
            </div>

          </div>
        );

      default: return null;
    }
  };

  return (
    <>
      <Navbar user={currentUser} />
      <div style={styles.pageBackground}>
        <div className="container" style={styles.container}>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '32px', margin: 0 }}>Profil Saya</h1>
          </div>
          <div style={styles.layoutGrid}>
            
            {/* Sidebar */}
            <div style={styles.leftCard}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img src={currentUser.avatar} alt="Profile" style={styles.avatarBig} />
                <h2 style={{ fontSize: '20px', margin: '10px 0 5px' }}>{currentUser.name}</h2>
              </div>
              <div style={styles.menuList}>
                <div style={activeTab === 'profile' ? styles.menuItemActive : styles.menuItem} onClick={() => setActiveTab('profile')}>👤 Informasi Dasar</div>
                <div style={activeTab === 'tickets' ? styles.menuItemActive : styles.menuItem} onClick={() => setActiveTab('tickets')}>🎟️ Tiket Saya</div>
                <div style={activeTab === 'settings' ? styles.menuItemActive : styles.menuItem} onClick={() => setActiveTab('settings')}>⚙️ Pengaturan</div>
              </div>
              <button onClick={handleLogout} style={styles.btnLogout}>Keluar</button>
            </div>

            {/* Konten */}
            <div>{renderContent()}</div>
          </div>
        </div>
      </div>
      
      {/* Modal QR */}
      {showModal && selectedTicket && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h3 style={{margin: 0, color: 'black'}}>E-Ticket Details</h3>
              <button onClick={handleCloseModal} style={{background:'none', border:'none', fontSize:'28px', cursor:'pointer', color: '#666'}}>&times;</button>
            </div>
            <div style={{textAlign: 'center', padding: '30px 20px', backgroundColor: '#F3F4F6', borderRadius: '12px'}}>
              <h2 style={{color: 'black', margin: '0 0 10px 0', fontSize: '20px'}}>{selectedTicket.eventName}</h2>
              <div style={{margin: '20px auto', padding: '10px', background: 'white', display: 'inline-block', borderRadius: '8px'}}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${selectedTicket.bookingCode}`} alt="QR Code" style={{width: '180px', height: '180px'}} />
              </div>
              <div style={{marginTop: '10px', borderTop: '1px dashed #ccc', paddingTop: '15px'}}>
                <p style={{margin: '0 0 5px 0', fontSize: '12px', color: '#666'}}>BOOKING CODE</p>
                <p style={{margin: 0, fontSize: '24px', letterSpacing: '3px', color: '#F59E0B', fontWeight: '800'}}>{selectedTicket.bookingCode}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

const styles = {
  pageBackground: { backgroundColor: '#0B1120', minHeight: '80vh', padding: '40px 0' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
  layoutGrid: { display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px', alignItems: 'start' },
  leftCard: { backgroundColor: '#1F2937', borderRadius: '12px', padding: '30px', border: '1px solid #374151', position: 'sticky', top: '100px' },
  avatarBig: { width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #F59E0B', marginBottom: '10px', objectFit: 'cover' },
  menuList: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', marginTop: '20px' },
  menuItem: { padding: '12px', cursor: 'pointer', borderRadius: '8px', color: '#D1D5DB', transition: '0.2s', fontSize: '15px' },
  menuItemActive: { padding: '12px', cursor: 'pointer', borderRadius: '8px', backgroundColor: '#374151', color: '#F59E0B', fontWeight: 'bold', fontSize: '15px', borderLeft: '4px solid #F59E0B' },
  btnLogout: { width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #EF4444', color: '#EF4444', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  rightCard: { backgroundColor: '#1F2937', borderRadius: '12px', padding: '40px', border: '1px solid #374151', minHeight: '400px' },
  cardTitle: { borderBottom: '1px solid #374151', paddingBottom: '15px', marginBottom: '25px', fontSize: '20px', color: 'white' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '14px', color: 'white', marginBottom: '8px', fontWeight: '500' },
  input: { padding: '12px 15px', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' },
  helperText: { fontSize: '12px', color: '#6B7280', marginTop: '5px' },
  
  checkboxLabel: { color: '#D1D5DB', display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  modalContent: { backgroundColor: 'white', borderRadius: '16px', padding: '25px', width: '90%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }
};

export default UserProfile;