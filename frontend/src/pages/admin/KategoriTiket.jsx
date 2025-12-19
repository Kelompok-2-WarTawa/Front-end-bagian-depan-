import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';

const KategoriTiket = () => {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [config, setConfig] = useState(null);

    // Load Events dari API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await apiRequest('/events');
                setEvents(data);
            } catch (error) {
                console.error("Gagal load events", error);
            }
        };
        fetchEvents();
    }, []);

    const handleEventChange = (e) => {
        const eventId = parseInt(e.target.value);
        setSelectedEventId(eventId);

        if (eventId) {
            const selectedEvent = events.find(ev => ev.id === eventId);

            // LOGIKA MAPPING:
            const phase = selectedEvent.phases && selectedEvent.phases.length > 0
                ? selectedEvent.phases[0]
                : { price: 0, quota: 0, start_date: '', end_date: '' };

            // Simpan ke state config
            setConfig({
                // Kita simpan ID fase juga agar nanti bisa diupdate (future improvement)
                id: phase.id,
                name: phase.name,
                price: parseInt(phase.price),
                quota: phase.quota,
                start: phase.start_date ? new Date(phase.start_date).toISOString().split('T')[0] : '',
                end: phase.end_date ? new Date(phase.end_date).toISOString().split('T')[0] : ''
            });
        } else {
            setConfig(null);
        }
    };

    const handleChange = (field, value) => {
        setConfig(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {

        alert("Untuk mengubah harga tiket secara permanen, silakan gunakan menu 'Manajemen Event' dan edit event terkait. Fitur update parsial sedang dikembangkan.");
    };

    return (
        <div style={{ color: '#111827', padding: '20px' }}>
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Kelola Kategori Tiket</h1>
                <p style={{ color: '#6B7280', marginTop: '5px' }}>Pilih event di bawah untuk melihat konfigurasi harga.</p>
            </header>

            {/* --- DROPDOWN PILIH EVENT --- */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', marginBottom: '30px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#374151' }}>Pilih Event:</label>
                <select
                    value={selectedEventId}
                    onChange={handleEventChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '16px', outline: 'none' }}
                >
                    <option value="">-- Pilih Event --</option>
                    {events.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.name}</option>
                    ))}
                </select>
            </div>

            {/* --- FORM PENGATURAN --- */}
            {selectedEventId && config ? (
                <>
                    <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                        <button onClick={handleSave} style={{ background: '#0B3996', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
                            💾 Simpan Perubahan
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EC4899' }}></div>
                                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{config.name || "Kategori Tiket"}</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>

                                <div>
                                    <label style={styles.label}>Harga (Rp)</label>
                                    <input
                                        type="number"
                                        value={config.price}
                                        onChange={(e) => handleChange('price', e.target.value)}
                                        style={styles.input}
                                    />
                                </div>

                                <div>
                                    <label style={styles.label}>Kuota</label>
                                    <input
                                        type="number"
                                        value={config.quota}
                                        onChange={(e) => handleChange('quota', e.target.value)}
                                        style={styles.input}
                                    />
                                </div>

                                <div>
                                    <label style={styles.label}>Mulai Jual</label>
                                    <input
                                        type="date"
                                        value={config.start}
                                        onChange={(e) => handleChange('start', e.target.value)}
                                        style={styles.input}
                                    />
                                </div>

                                <div>
                                    <label style={styles.label}>Akhir Jual</label>
                                    <input
                                        type="date"
                                        value={config.end}
                                        onChange={(e) => handleChange('end', e.target.value)}
                                        style={styles.input}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* Tampilan saat belum pilih event */
                <div style={{ textAlign: 'center', padding: '60px', background: '#F9FAFB', borderRadius: '12px', color: '#9CA3AF', border: '2px dashed #D1D5DB' }}>
                    <p style={{ fontSize: '18px', margin: 0 }}>👈 Silakan pilih <b>Event</b> di atas.</p>
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
