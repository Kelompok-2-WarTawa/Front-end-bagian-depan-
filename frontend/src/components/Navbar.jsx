// src/components/Navbar.jsx
import React from 'react';
import logoImg from '../assets/logo.png'; 

// Menerima props 'user'
const Navbar = ({ user }) => {
  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        
        {/* LOGO */}
        <div style={styles.logo}>
          <img src={logoImg} alt="WarTawa" style={styles.logoImage} />
          <span><span style={{color: '#F59E0B'}}>War</span>Tawa</span>
        </div>

        {/* SEARCH BAR */}
        <div style={styles.searchBox}>
          <input type="text" placeholder="Search event..." style={styles.input} />
        </div>

        {/* LOGIC LOGIN/PROFILE */}
        <div style={styles.menuRight}>
          {user ? (
            // JIKA SUDAH LOGIN (Tampil Profil)
            <div style={styles.profileArea}>
                <div style={{textAlign: 'right', marginRight: '12px'}}>
                    <div style={{fontSize: '14px', fontWeight: 'bold'}}>Halo, {user.name}</div>
                    <div style={{fontSize: '11px', color: '#9CA3AF'}}>Attendee</div>
                </div>
                <div style={styles.avatar}>
                    {user.name.charAt(0)}
                </div>
            </div>
          ) : (
            // JIKA BELUM LOGIN (Tampil Tombol)
            <>
              <button className="btn btn-outline" style={{marginRight: '10px'}}>Login</button>
              <button className="btn btn-gold">Register</button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#0B1120',
    padding: '15px 0',
    borderBottom: '1px solid #1f2937',
    position: 'sticky', top: 0, zIndex: 100
  },
  container: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { display: 'flex', alignItems: 'center', fontSize: '24px', fontWeight: 'bold', color: 'white', gap: '10px' },
  logoImage: { height: '25px', width: 'auto' },
  searchBox: { flex: 1, display: 'flex', justifyContent: 'center' },
  input: { width: '400px', padding: '10px 15px', borderRadius: '20px', border: 'none', outline: 'none' },

  // STYLE BARU
  menuRight: { display: 'flex', alignItems: 'center' },
  profileArea: { display: 'flex', alignItems: 'center', color: 'white', cursor: 'pointer' },
  avatar: {
      width: '40px', height: '40px',
      backgroundColor: '#F59E0B', color: 'black',
      borderRadius: '50%',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      fontWeight: 'bold', fontSize: '18px'
  }
};

export default Navbar;