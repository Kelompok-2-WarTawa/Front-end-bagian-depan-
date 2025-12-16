import React from 'react';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        {/* 2. BAGIAN LOGO DIPERBARUI */}
        <div style={styles.logo}>
          <img 
            src={logoImg} 
            alt="WarTawa Logo" 
            style={styles.logoImage}
          />
          <span>
            <span style={{color: '#F59E0B'}}>War</span>Tawa
          </span>
        </div>

        {/* SEARCH BAR */}
        <div style={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Search event..." 
            style={styles.input} 
          />
        </div>

        {/* BUTTONS */}
        <div>
          <button className="btn btn-gold" style={{marginRight: '10px'}}>Login</button>
          <button className="btn btn-gold">Register</button>
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
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoImage: {            
    height: '60px', 
    width: 'auto'
  },
  searchBox: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  input: {
    width: '400px',
    padding: '10px 15px',
    borderRadius: '20px',
    border: 'none',
    outline: 'none'
  }
};

export default Navbar;