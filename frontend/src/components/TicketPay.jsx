import React from 'react';

const TicketPay = ({ data, onShowQR }) => {
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return '#10B981'; 
      case 'PENDING': return '#F59E0B'; 
      case 'CANCELLED': return '#EF4444'; 
      default: return '#6B7280'; 
    }
  };

  return (
    <div style={styles.card}>
      {/* BAGIAN KIRI */}
      <div style={styles.leftSection}>
        <img src={data.image} alt={data.eventName} style={styles.image} />
        
        <div style={styles.info}>
          <div style={styles.headerInfo}>
            <span style={{...styles.badge, backgroundColor: getStatusColor(data.status)}}>
              {data.status}
            </span>
            <span style={styles.orderId}>Order ID: #{data.bookingCode}</span>
          </div>

          <h3 style={styles.title}>{data.eventName}</h3>
          
          <div style={styles.detailsGrid}>
            <div>
              <p style={styles.label}>Tanggal</p>
              <p style={styles.value}>{data.date}</p>
            </div>
            <div>
              <p style={styles.label}>Waktu</p>
              <p style={styles.value}>{data.time}</p>
            </div>
            <div>
              <p style={styles.label}>Lokasi</p>
              <p style={styles.value}>{data.location}</p>
            </div>
            <div>
              <p style={styles.label}>Tiket</p>
              <p style={styles.value}>{data.qty}x ({data.type})</p>
            </div>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div style={styles.divider}>
        <div style={styles.circleTop}></div>
        <div style={styles.line}></div>
        <div style={styles.circleBottom}></div>
      </div>

      {/* BAGIAN KANAN */}
      <div style={styles.rightSection}>
        <div>
          <p style={styles.label}>Total Harga</p>
          <h2 style={styles.price}>Rp {data.totalPrice.toLocaleString('id-ID')}</h2>
        </div>

        {data.status === 'PAID' ? (
          <button 
            className="btn btn-outline" 
            style={{width: '100%', fontSize: '12px'}}
            onClick={() => onShowQR(data)}
          >
            Lihat E-Ticket (QR)
          </button>
        ) : (
          <button className="btn btn-gold" style={{width: '100%', fontSize: '12px'}}>
            Bayar Sekarang
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    backgroundColor: '#1F2937',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #374151',
    marginBottom: '20px',
    position: 'relative',
    minHeight: '200px'
  },
  leftSection: {
    flex: 2, padding: '20px', display: 'flex', gap: '20px', alignItems: 'center'
  },
  image: {
    width: '120px', height: '120px', borderRadius: '10px', objectFit: 'cover'
  },
  info: { flex: 1 },
  headerInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', color: 'black' },
  orderId: { color: '#9CA3AF', fontSize: '12px' },
  title: { margin: '0 0 15px 0', fontSize: '20px', color: 'white' },
  detailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  label: { fontSize: '11px', color: '#9CA3AF', marginBottom: '2px', marginTop: 0 },
  value: { fontSize: '13px', color: 'white', fontWeight: '500', margin: 0 },
  
  divider: {
    width: '20px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1F2937'
  },
  line: { height: '80%', borderLeft: '2px dashed #374151' },
  circleTop: { position: 'absolute', top: '-10px', width: '20px', height: '20px', backgroundColor: '#0B1120', borderRadius: '50%' },
  circleBottom: { position: 'absolute', bottom: '-10px', width: '20px', height: '20px', backgroundColor: '#0B1120', borderRadius: '50%' },

  rightSection: {
    flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'right', borderLeft: '1px solid #374151'
  },
  price: { color: '#F59E0B', fontSize: '22px', margin: '5px 0 0 0' }
};

export default TicketPay;