// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png'; 
import '../App.css'; 
import { logoutUser } from '../utils/authStore'; 

const Navbar = ({ user, onSearch }) => { 
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logoutUser(); 
    setIsOpen(false);
    navigate('/login'); 
    window.location.reload(); 
  };

  const handleGoToSettings = () => {
    setIsOpen(false);
    navigate('/profile', { state: { defaultTab: 'settings' } });
  };

  const handleGoToProfile = () => {
    setIsOpen(false);
    navigate('/profile', { state: { defaultTab: 'profile' } });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        
        {/* LOGO */}
        <div style={styles.logo} onClick={() => navigate('/')}>
          <img src={logoImg} alt="WarTawa" style={styles.logoImage} />
          <span><span style={{color: '#F59E0B'}}>War</span>Tawa</span>
        </div>

        {/* SEARCH BAR (INTEGRATED) */}
        <div style={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Cari event, artis, atau kota..." 
            style={styles.input} 
            // INI KUNCINYA: Kirim teks ke parent (UserDashboard)
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>

        {/* MENU KANAN */}
        <div style={styles.menuRight}>
          {user ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
                <div style={styles.profileArea} onClick={toggleDropdown}>
                    <div style={{textAlign: 'right', marginRight: '12px'}}>
                        <div style={{fontSize: '14px', fontWeight: 'bold'}}>Halo, {user.name || user.fullName}</div>
                        <div style={{fontSize: '11px', color: '#9CA3AF'}}>Attendee</div>
                    </div>
                    <div style={styles.avatar}>{(user.name || user.fullName || "G").charAt(0).toUpperCase()}</div>
                </div>

                {isOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={handleGoToProfile}>
                      📄 Informasi Dasar
                    </div>
                    <div className="dropdown-item" onClick={handleGoToSettings}>
                      ⚙️ Pengaturan
                    </div>
                    <div style={{height: '1px', background: '#374151', margin: '4px 0'}}></div>
                    <div className="dropdown-item" onClick={handleLogout} style={{color: '#EF4444'}}>
                      🚪 Keluar
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div style={{display: 'flex', gap: '10px'}}>
              <button className="btn btn-outline" onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="btn btn-gold" onClick={() => navigate('/register')}>
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: { backgroundColor: '#0B1120', padding: '15px 0', borderBottom: '1px solid #1f2937', position: 'sticky', top: 0, zIndex: 100 },
  container: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { display: 'flex', alignItems: 'center', fontSize: '24px', fontWeight: 'bold', color: 'white', gap: '10px', cursor: 'pointer' },
  logoImage: { height: '25px', width: 'auto' },
  searchBox: { flex: 1, display: 'flex', justifyContent: 'center' },
  input: { width: '100%', maxWidth: '400px', padding: '10px 20px', borderRadius: '20px', border: 'none', outline: 'none', fontSize: '14px' },
  menuRight: { display: 'flex', alignItems: 'center' },
  profileArea: { display: 'flex', alignItems: 'center', color: 'white', cursor: 'pointer', userSelect: 'none' },
  avatar: { width: '40px', height: '40px', backgroundColor: '#F59E0B', color: 'black', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px' }
};

export default Navbar;