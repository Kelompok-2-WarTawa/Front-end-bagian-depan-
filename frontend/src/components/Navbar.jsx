import React from 'react';

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        {/* LOGO */}
        <div style={styles.logo}>
          <span style={{color: '#F59E0B'}}>War</span>Tawa
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
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    cursor: 'pointer'
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