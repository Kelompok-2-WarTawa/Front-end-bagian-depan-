import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventRow = ({ id, title, date, location, price, image, isAvailable }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.row}>
      {/* Gambar */}
      <img src={image} alt={title} style={styles.image} />

      {/* Info */}
      <div style={styles.info}>
        {isAvailable ? 
          <span style={styles.badgeAvailable}>Available</span> : 
          <span style={styles.badgeLimited}>Limited</span>
        }
        <p style={styles.date}>📅 {date}</p>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.location}>📍 {location}</p>
      </div>

      {/* Harga & Tombol */}
      <div style={styles.action}>
        <p style={styles.priceLabel}>Start From</p>
        <h3 style={styles.price}>{price}</h3>
        
        {/* Navigasi ke Halaman Detail Event */}
        <button 
          onClick={() => navigate(`/event/${id}`)} 
          className="btn btn-royal" 
          style={{padding: '10px 25px'}}
        >
          Select Ticket
        </button>
      </div>
    </div>
  );
};

const styles = {
  row: {
    display: 'flex',
    backgroundColor: '#FBBF24', 
    borderRadius: '12px',
    padding: '15px',
    marginBottom: '20px',
    alignItems: 'center',
    border: '2px solid #F59E0B'
  },
  image: {
    width: '150px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover',
    marginRight: '20px'
  },
  info: {
    flex: 1
  },
  badgeAvailable: {
    backgroundColor: '#10B981',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    marginRight: '10px'
  },
  badgeLimited: {
    backgroundColor: '#F59E0B',
    color: 'black',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    marginRight: '10px'
  },
  date: {
    display: 'inline-block',
    fontSize: '13px',
    color: '#333',
    fontWeight: 'bold'
  },
  title: {
    margin: '5px 0',
    color: '#000',
    fontSize: '20px'
  },
  location: {
    margin: 0,
    color: '#4B5563',
    fontSize: '14px'
  },
  action: {
    textAlign: 'right',
    minWidth: '150px'
  },
  priceLabel: {
    margin: 0,
    fontSize: '12px',
    color: '#4B5563'
  },
  price: {
    margin: '5px 0 10px 0',
    color: '#0E3695',
    fontSize: '22px'
  }
};

export default EventRow;