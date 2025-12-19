import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        
        {/* Kolom 1: Brand & Deskripsi */}
        <div style={styles.brandColumn}>
          <h2 style={styles.logo}>
            <span style={{color: '#F59E0B'}}>War</span>Tawa
          </h2>
          <p style={styles.description}>
            Platform tiket event komedi terpercaya. <br/>
            Temukan tawa di setiap sudut kota.
          </p>
          <p style={styles.copyright}>© 2025 WarTawa Group. All rights reserved.</p>
        </div>

        {/* Kolom 2: Quick Links */}
        <div style={styles.linkColumn}>
          <h3 style={styles.heading}>Explore</h3>
          <ul style={styles.list}>
            <li><a href="#" style={styles.link}>Home</a></li>
            <li><a href="#" style={styles.link}>Browse Events</a></li>
            <li><a href="#" style={styles.link}>My Tickets</a></li>
          </ul>
        </div>

        {/* Kolom 3: Contact / Socials */}
        <div style={styles.linkColumn}>
          <h3 style={styles.heading}>Connect</h3>
          <ul style={styles.list}>
            <li><a href="#" style={styles.link}>Instagram</a></li>
            <li><a href="#" style={styles.link}>Twitter / X</a></li>
            <li><a href="#" style={styles.link}>support@wartawa.id</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
};

// Styles Khusus Footer
const styles = {
  footer: {
    backgroundColor: '#050a14', 
    borderTop: '1px solid #1f2937',
    padding: '60px 0 30px 0',
    marginTop: 'auto' 
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '40px'
  },
  brandColumn: {
    flex: '2', 
    minWidth: '250px'
  },
  linkColumn: {
    flex: '1',
    minWidth: '150px'
  },
  logo: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 0 15px 0'
  },
  description: {
    color: '#9CA3AF',
    lineHeight: '1.6',
    marginBottom: '20px'
  },
  copyright: {
    color: '#6B7280',
    fontSize: '13px',
    marginTop: '20px'
  },
  heading: {
    color: 'white',
    fontSize: '18px',
    marginBottom: '20px'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  link: {
    color: '#9CA3AF',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '10px',
    transition: '0.3s'
  }
};

export default Footer;