import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ id, title, date, location, price, image }) => {
    const navigate = useNavigate();

    const handleDetail = () => {
        // Navigasi menggunakan URL Parameter ID
        navigate(`/event/${id}`);
    };

    return (
        <div style={styles.card}>
            <img src={image} alt={title} style={styles.image} />

            <div style={styles.content}>
                <p style={styles.date}>📅 {date}</p>
                <h3 style={styles.title}>{title}</h3>
                <p style={styles.location}>📍 {location}</p>

                <div style={styles.footer}>
                    <span style={styles.price}>{price}</span>

                    <button
                        onClick={handleDetail}
                        className="btn btn-gold"
                        style={{
                            padding: '8px 16px',
                            fontSize: '13px',
                            background: '#F59E0B',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: 'black'
                        }}
                    >
                        Lihat Detail
                    </button>

                </div>
            </div>
        </div>
    );
};

const styles = {
    card: { backgroundColor: '#22282E', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2D3748', display: 'flex', flexDirection: 'column' },
    image: { width: '100%', height: '180px', objectFit: 'cover' },
    content: { padding: '15px', display: 'flex', flexDirection: 'column', flex: 1 },
    date: { fontSize: '12px', color: '#9CA3AF', marginBottom: '5px' },
    title: { fontSize: '18px', color: 'white', margin: '5px 0 10px 0' },
    location: { fontSize: '13px', color: '#9CA3AF', marginBottom: '15px' },
    footer: { marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    price: { color: '#F59E0B', fontWeight: 'bold' }
};

export default EventCard;
