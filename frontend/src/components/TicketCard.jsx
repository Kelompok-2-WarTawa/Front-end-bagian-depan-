// src/components/TicketCard.jsx
import React from 'react';

const TicketCard = ({ title, date, location, image }) => {
  return (
    <div style={styles.card}>
      {/* Gambar Kecil di Kiri */}
      <img src={image} alt={title} style={styles.image} />
      
      {/* Info di Tengah */}
      <div style={styles.info}>
        <div style={styles.dateRow}>📅 {date}</div>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.location}>📍 {location}</p>
      </div>

      {/* Tombol di Kanan */}
      <div style={styles.action}>
         <button className="btn btn-gold" style={{fontSize: '12px', padding: '8px 15px'}}>
            Lihat E-Ticket
         </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    backgroundColor: '#151E32', 
    border: '1px solid #2D3748',
    borderRadius: '12px',
    padding: '30px',
    alignItems: 'center',
    gap: '20px',
    maxWidth: '1090px',
    width: '100%'
  },
  image: {
    width: '120px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover'
  },
  info: {
    flex: 1
  },
  dateRow: {
    color: 'white', 
    fontSize: '12px', 
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  title: {
    margin: '0 0 8px 0', 
    color: 'white', 
    fontSize: '20px'
  },
  location: {
    margin: 0, 
    color: '#9CA3AF', 
    fontSize: '14px'
  },
  action: {
    display: 'flex', 
    alignItems: 'center'
  }
};

export default TicketCard;