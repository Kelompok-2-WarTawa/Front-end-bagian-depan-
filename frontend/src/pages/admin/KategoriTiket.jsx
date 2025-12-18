// src/pages/admin/KategoriTiket.jsx
import React, { useState, useEffect } from 'react';
import { getTicketConfig, saveTicketConfig } from '../../utils/ticketStore'; // Import Database

const KategoriTiket = () => {
  // State untuk menampung data tiket
  const [config, setConfig] = useState(null);

  // Load data saat halaman dibuka
  useEffect(() => {
    const data = getTicketConfig();
    setConfig(data);
  }, []);

  // Handle Perubahan Input
  const handleChange = (type, field, value) => {
    setConfig(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  // Handle Simpan
  const handleSave = () => {
    saveTicketConfig(config);
  };

  if (!config) return <div>Loading...</div>;

  // Mapping agar mudah di-render (Object to Array)
  const categories = [
    { key: 'early', label: 'Early Bird', color: '#4ADE80' },
    { key: 'presale', label: 'Presale', color: '#A855F7' },
    { key: 'reguler', label: 'Reguler', color: '#EC4899' },
  ];

  return (
    <div style={{ color: '#111827' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Kelola Kategori Tiket</h1>
        <p style={{ color: '#6B7280' }}>Edit harga dan jadwal tiket. Perubahan akan langsung tampil di halaman User.</p>
      </header>

      {/* Tombol Simpan Utama */}
      <div style={{textAlign: 'right', marginBottom: '20px'}}>
        <button 
            onClick={handleSave}
            style={{ 
                background: '#0B3996', color: 'white', border: 'none', 
                padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' 
            }}
        >
            💾 Simpan Semua Perubahan
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {categories.map((cat) => (
          <div key={cat.key} style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
            
            {/* Header Card */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: cat.color }}></div>
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{cat.label}</span>
              </div>
            </div>
            
            {/* Form Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              
              {/* Input Harga */}
              <div>
                <label style={styles.label}>Harga (Rp)</label>
                <input 
                    type="number" 
                    value={config[cat.key].price} 
                    onChange={(e) => handleChange(cat.key, 'price', parseInt(e.target.value))}
                    style={styles.input} 
                />
              </div>

              {/* Input Kuota */}
              <div>
                <label style={styles.label}>Kuota</label>
                <input 
                    type="number" 
                    value={config[cat.key].quota} 
                    onChange={(e) => handleChange(cat.key, 'quota', parseInt(e.target.value))}
                    style={styles.input} 
                />
              </div>

              {/* Input Mulai Jual */}
              <div>
                <label style={styles.label}>Mulai Jual (YYYY-MM-DD)</label>
                <input 
                    type="date" 
                    value={config[cat.key].start} 
                    onChange={(e) => handleChange(cat.key, 'start', e.target.value)}
                    style={styles.input} 
                />
              </div>

              {/* Input Akhir Jual */}
              <div>
                <label style={styles.label}>Akhir Jual (YYYY-MM-DD)</label>
                <input 
                    type="date" 
                    value={config[cat.key].end} 
                    onChange={(e) => handleChange(cat.key, 'end', e.target.value)}
                    style={styles.input} 
                />
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
    label: { fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '5px', fontWeight: 'bold' },
    input: { border: '1px solid #E5E7EB', borderRadius: '6px', padding: '10px', width: '100%', fontSize: '14px' }
};

export default KategoriTiket;