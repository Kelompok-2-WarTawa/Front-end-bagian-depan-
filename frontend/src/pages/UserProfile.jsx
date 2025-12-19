import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
// Import fungsi changePassword yang baru dibuat
import { getCurrentUser, logoutUser, updateUser, changePassword } from '../utils/authStore';

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [currentUser, setCurrentUser] = useState(null);
  
  // State untuk Edit Profil (Nama & Telepon)
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  // State untuk Ganti Password
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // --- EFEK: AMBIL DATA USER ---
  useEffect(() => {
    const user = getCurrentUser();
    
    if (!user) {
      navigate('/login'); 
    } else {
      const userData = {
        ...user,
        phone: user.phone || "-",
        role: user.role || "Member",
        joinDate: user.joinDate || "Member Setia",
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=F59E0B&color=000`
      };
      
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentUser(userData);
      setFormData({
        name: userData.name,
        phone: userData.phone
      });
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state && location.state.defaultTab) {
      if (location.state.defaultTab !== 'tickets') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveTab(location.state.defaultTab);
      }
    }
  }, [location]);

  // --- HANDLE EDIT PROFIL ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    if (!currentUser) return;
    const updatedData = { ...currentUser, name: formData.name, phone: formData.phone };
    updateUser(updatedData);
    setCurrentUser(updatedData);
    alert('Profil berhasil diperbarui!');
  };

  // --- HANDLE GANTI PASSWORD ---
  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  const handleSavePassword = () => {
    // Validasi input
    if (!passData.currentPassword || !passData.newPassword || !passData.confirmPassword) {
      alert('Harap isi semua kolom password!');
      return;
    }

    if (passData.newPassword !== passData.confirmPassword) {
      alert('Konfirmasi password baru tidak cocok!');
      return;
    }

    // Panggil fungsi dari authStore
    const result = changePassword(currentUser.email, passData.currentPassword, passData.newPassword);

    if (result.success) {
      alert(result.message);
      // Reset form password setelah berhasil
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      // Tampilkan pesan error (misal: Password lama salah)
      alert(result.message); 
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  if (!currentUser) return null; 

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div style={styles.rightCard}>
            <h3 style={styles.cardTitle}>Ubah Informasi Dasar</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Username</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email</label>
                  <input type="email" value={currentUser.email} disabled style={{ ...styles.input, backgroundColor: '#374151', color: '#9CA3AF', cursor: 'not-allowed' }} />
                  <small style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>*Email tidak dapat diubah</small>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nomor Telepon</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={styles.input} />
                </div>
              </div>
              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" onClick={handleSaveProfile} className="btn btn-gold" style={{ padding: '12px 40px', cursor: 'pointer', background: '#F59E0B', border: 'none', borderRadius: '8px', color: 'black', fontWeight: 'bold' }}>
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        );

      case 'settings':
        return (
          <div style={styles.rightCard}>
            <h3 style={styles.cardTitle}>Pengaturan Akun</h3>
            
            {/* Ganti Password */}
            <div>
              <h4 style={{ color: '#F59E0B', marginBottom: '20px' }}>Ganti Password</h4>
              <form onSubmit={(e) => e.preventDefault()}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Password Saat Ini</label>
                    <input 
                      type="password" 
                      name="currentPassword" 
                      value={passData.currentPassword}
                      onChange={handlePassChange}
                      placeholder="Masukan password lama..." 
                      style={styles.input} 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Password Baru</label>
                      <input 
                        type="password" 
                        name="newPassword" 
                        value={passData.newPassword}
                        onChange={handlePassChange}
                        placeholder="Password baru..." 
                        style={styles.input} 
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Konfirmasi Password</label>
                      <input 
                        type="password" 
                        name="confirmPassword" 
                        value={passData.confirmPassword}
                        onChange={handlePassChange}
                        placeholder="Ulangi password baru..." 
                        style={styles.input} 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                     <button 
                       type="button" 
                       onClick={handleSavePassword}
                       className="btn btn-outline" 
                       style={{ padding: '10px 30px', background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                       Update Password
                     </button>
                  </div>
                </div>
              </form>
            </div>
            
            {/* BAGIAN NOTIFIKASI SUDAH DIHAPUS */}

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
            <h1 style={{ fontSize: '32px', margin: 0, color: 'white' }}>Profil Saya</h1>
          </div>
          <div style={styles.layoutGrid}>
            <div style={styles.leftCard}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img src={currentUser.avatar} alt="Profile" style={styles.avatarBig} />
                <h2 style={{ fontSize: '20px', margin: '10px 0 5px', color: 'white' }}>{currentUser.name}</h2>
                <p style={{color: '#9CA3AF', fontSize: '14px', margin: 0}}>{currentUser.email}</p>
              </div>
              <div style={styles.menuList}>
                <div style={activeTab === 'profile' ? styles.menuItemActive : styles.menuItem} onClick={() => setActiveTab('profile')}>👤 Informasi Dasar</div>
                <div style={activeTab === 'settings' ? styles.menuItemActive : styles.menuItem} onClick={() => setActiveTab('settings')}>⚙️ Pengaturan</div>
              </div>
              <button onClick={handleLogout} style={styles.btnLogout}>Keluar</button>
            </div>
            <div>{renderContent()}</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  pageBackground: { backgroundColor: '#0B1120', minHeight: '80vh', padding: '40px 0', color: 'white' },
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
};

export default UserProfile;