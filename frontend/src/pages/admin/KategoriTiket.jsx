// src/pages/admin/KategoriTiket.jsx
import React, { useState, useEffect } from 'react';
import { getEvents } from '../../utils/eventStore'; // Import Event
import { getTicketConfigByEvent, saveTicketConfig } from '../../utils/ticketStore'; // Import Store Tiket

const KategoriTiket = () => {
  // State Data
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [config, setConfig] = useState(null);

  // 1. Load Daftar Event saat halaman dibuka
  useEffect(() => {
    setEvents(getEvents());
  }, []);

  // 2. Handle Ganti Event di Dropdown
  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);

    if (eventId) {
      // Ambil config khusus event ini
      const data = getTicketConfigByEvent(eventId);
      setConfig(data);
    } else {
      setConfig(null);
    }
  };

  // 3. Handle Perubahan Input (Harga, Kuota, Tanggal)
  const handleChange = (type, field, value) => {
    setConfig(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  // 4. Handle Simpan
  const handleSave = () => {
    if (!selectedEventId) return alert("Pilih event terlebih dahulu!");
    
    saveTicketConfig(selectedEventId, config);
    alert("Pengaturan tiket berhasil disimpan!");
  };

  // Data Mapping Kategori
  const categories = [
    { key: 'early', label: 'Early Bird', color: '#4ADE80' },
    { key: 'presale', label: 'Presale', color: '#A855F7' },
    { key: 'reguler', label: 'Reguler', color: '#EC4899' },
  ];

  return (
    <div style={{ color: '#111827', padding: '20px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Kelola Kategori Tiket</h1>
        <p style={{ color: '#6B7280', marginTop: '5px' }}>Pilih event di bawah, lalu atur harga tiketnya.</p>
      </header>

      {/* --- BAGIAN BARU: DROPDOWN PILIH EVENT --- */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', marginBottom: '30px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#374151' }}>Pilih Event:</label>
        <select 
            value={selectedEventId} 
            onChange={handleEventChange}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '16px', outline: 'none' }}
        >
            <option value="">-- Pilih Event yang ingin diatur --</option>
            {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                    {ev.nama}
                </option>
            ))}
        </select>
      </div>

      {/* --- FORM PENGATURAN (Hanya muncul jika Event dipilih) --- */}
      {selectedEventId && config ? (
        <>
            {/* Tombol Simpan Utama */}
            <div style={{textAlign: 'right', marginBottom: '20px'}}>
                <button 
                    onClick={handleSave}
                    style={{ 
                        background: '#0B3996', color: 'white', border: 'none', 
                        padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' 
                    }}
                >
                    💾 Simpan Perubahan
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
                            placeholder="0"
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
                            placeholder="0"
                        />
                    </div>

                    {/* Input Mulai Jual */}
                    <div>
                        <label style={styles.label}>Mulai Jual</label>
                        <input 
                            type="date" 
                            value={config[cat.key].start} 
                            onChange={(e) => handleChange(cat.key, 'start', e.target.value)}
                            style={styles.input} 
                        />
                    </div>

                    {/* Input Akhir Jual */}
                    <div>
                        <label style={styles.label}>Akhir Jual</label>
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
        </>
      ) : (
        /* Tampilan saat belum pilih event */
        <div style={{textAlign: 'center', padding: '60px', background: '#F9FAFB', borderRadius: '12px', color: '#9CA3AF', border: '2px dashed #D1D5DB'}}>
            <p style={{fontSize: '18px', margin: 0}}>👈 Silakan pilih <b>Event</b> di atas untuk mulai mengatur harga tiket.</p>
        </div>
      )}
    </div>
  );
};

const styles = {
    label: { fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '5px', fontWeight: 'bold' },
    input: { border: '1px solid #E5E7EB', borderRadius: '6px', padding: '10px', width: '100%', fontSize: '14px', boxSizing: 'border-box' }
};

export default KategoriTiket;