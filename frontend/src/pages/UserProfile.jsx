import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();

  // Data Dummy User
  const user = {
    name: "Sutejo",
    email: "sutejo@example.com",
    phone: "0812-3456-7890",
    joinDate: "10 Januari 2025",
    avatar: "https://placehold.co/150x150/F59E0B/white?text=S"
  };

  const handleLogout = () => {
    // Logika logout (hapus token, dll) bisa ditaruh di sini
    console.log("User logged out");
    navigate('/login'); // Kembali ke login
  };

  return (
    <div style={{ backgroundColor: '#0B1120', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div className="container" style={{ flex: 1, paddingTop: '60px', paddingBottom: '60px' }}>
        
        {/* JUDUL HALAMAN */}
        <h1 style={{ color: 'white', marginBottom: '40px', borderBottom: '1px solid #374151', paddingBottom: '20px' }}>
          My Profile
        </h1>

        <div style={styles.profileContainer}>
          
          {/* KOLOM KIRI: FOTO & NAMA */}
          <div style={styles.leftCard}>
            <img src={user.avatar} alt="Profile" style={styles.avatar} />
            <h2 style={{ color: 'white', marginTop: '20px', marginBottom: '5px' }}>{user.name}</h2>
            <p style={{ color: '#F59E0B', margin: 0 }}>Member WarTawa</p>
            
            <button 
              onClick={handleLogout} 
              style={styles.btnLogout}
            >
              Logout
            </button>
          </div>

          {/* KOLOM KANAN: FORM DATA DIRI */}
          <div style={styles.rightCard}>
            <h3 style={{ color: 'white', marginBottom: '30px' }}>Personal Information</h3>
            
            <form>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input type="text" value={user.name} style={styles.input} readOnly />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input type="email" value={user.email} style={styles.input} readOnly />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone Number</label>
                <input type="text" value={user.phone} style={styles.input} readOnly />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Joined Since</label>
                <div style={{...styles.input, backgroundColor: 'transparent', paddingLeft: 0, color: '#9CA3AF'}}>
                   {user.joinDate}
                </div>
              </div>

              {/* Tombol Edit Dummy */}
              <button type="button" className="btn btn-gold" style={{ marginTop: '20px' }}>
                Edit Profile
              </button>
            </form>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  profileContainer: {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap' // Supaya responsif di HP
  },
  leftCard: {
    backgroundColor: '#1F2937',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    flex: '1 1 300px', // Lebar fleksibel
    height: 'fit-content'
  },
  rightCard: {
    backgroundColor: '#1F2937',
    padding: '40px',
    borderRadius: '12px',
    flex: '2 1 400px' // Lebih lebar dari kiri
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '4px solid #F59E0B',
    objectFit: 'cover'
  },
  btnLogout: {
    marginTop: '30px',
    padding: '10px 30px',
    backgroundColor: 'transparent',
    border: '1px solid #EF4444',
    color: '#EF4444',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    color: '#9CA3AF',
    marginBottom: '8px',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    backgroundColor: '#111827',
    border: '1px solid #374151',
    borderRadius: '8px',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box' // Penting agar padding tidak melebarkan input
  }
};

export default UserProfile;