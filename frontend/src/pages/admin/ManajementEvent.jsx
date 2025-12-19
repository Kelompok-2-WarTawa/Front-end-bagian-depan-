// src/pages/admin/ManajementEvent.jsx
import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';

const ManajemenEvent = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const initialFormState = {
        id: null,
        nama: '',
        talent: '', // Note: Backend mungkin perlu update kolom ini jika belum ada
        jadwal: '',
        jam: '',
        lokasi: '',
        kota: '',
        price: '',
        totalSeats: '',
        status: 'Published',
        image: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = async () => {
        try {
            const data = await apiRequest('/events');
            // Map backend data to frontend state
            const mappedEvents = data.map(ev => ({
                id: ev.id,
                nama: ev.name,
                talent: 'Guest Star', // Backend belum support talent field?
                jadwal: new Date(ev.date).toISOString().split('T')[0],
                jam: new Date(ev.date).toTimeString().slice(0, 5),
                lokasi: ev.venue,
                kota: 'Jakarta',
                price: ev.phases[0]?.price || 0,
                totalSeats: ev.total_capacity,
                status: ev.status,
                image: ev.image_url || 'https://placehold.co/400x300'
            }));
            setEvents(mappedEvents);
        } catch (error) {
            console.error("Gagal load events:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Mock upload (karena backend belum handle file upload multipart)
    const handleImageUpload = (e) => {
        // Idealnya upload ke CDN/Server. Di sini kita pakai URL dummy atau base64 pendek
        setFormData(prev => ({ ...prev, image: 'http://img.com/1.jpg' }));
    };

    const handleOpenAdd = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (ev) => {
        setFormData(ev);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Gabungkan tanggal & jam (YYYY-MM-DD HH:MM:SS)
        const fullDate = `${formData.jadwal} ${formData.jam}:00`;

        // Payload sesuai cURL
        const payload = {
            name: formData.nama,
            description: `Performance by ${formData.talent}`,
            date: fullDate,
            venue: formData.lokasi,
            image_url: formData.image,
            phases: [
                // Generate Fase Reguler otomatis agar sesuai backend
                {
                    name: 'Regular (Active)',
                    price: parseInt(formData.price),
                    quota: parseInt(formData.totalSeats),
                    start_date: new Date().toISOString().split('T')[0] + ' 00:00:00', // Mulai hari ini
                    end_date: fullDate // Sampai hari H
                }
            ]
        };

        try {
            if (isEditing) {
                // Update (PUT)
                // Backend endpoint: PUT /api/events/{id} (Perlu dipastikan backend support ini)
                // Jika belum, gunakan POST create baru dulu untuk demo
                await apiRequest(`/events/${formData.id}`, 'PUT', {
                    venue: formData.lokasi,
                    name: formData.nama,
                    description: payload.description,
                    image_url: formData.image
                });
                alert("Event berhasil diperbarui!");
            } else {
                // Create (POST)
                await apiRequest('/events', 'POST', payload);
                alert("Event berhasil ditambahkan!");
            }

            setIsModalOpen(false);
            refreshData();
        } catch (error) {
            alert("Gagal simpan: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus event ini?")) {
            try {
                await apiRequest(`/events/${id}`, 'DELETE');
                refreshData();
            } catch (error) {
                alert("Gagal hapus: " + error.message);
            }
        }
    };

    return (
        <div style={{ color: '#111827', padding: '20px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Manajemen Event</h1>
                    <p style={{ color: '#6B7280', marginTop: '5px' }}>Kelola jadwal & kapasitas gedung di sini</p>
                </div>
                <button onClick={handleOpenAdd} style={styles.btnAdd}>+ Tambah Event</button>
            </div>

            <div style={styles.tableContainer}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                        <tr>
                            <th style={styles.th}>EVENT</th>
                            <th style={styles.th}>JADWAL</th>
                            <th style={styles.th}>LOKASI</th>
                            <th style={styles.th}>HARGA (Start)</th>
                            <th style={styles.th}>KUOTA (Seat)</th>
                            <th style={styles.th}>STATUS</th>
                            <th style={styles.th}>AKSI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((ev) => (
                            <tr key={ev.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                <td style={{ ...styles.td, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img src={ev.image} alt="thumb" style={{ width: '60px', height: '40px', borderRadius: '4px', objectFit: 'cover', backgroundColor: '#eee' }} />
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{ev.nama}</div>
                                        <div style={{ fontSize: '12px', color: '#F59E0B' }}>{ev.talent}</div>
                                    </div>
                                </td>
                                <td style={styles.td}>{ev.jadwal} <br /><span style={{ fontSize: '12px', color: '#666' }}>{ev.jam} WIB</span></td>
                                <td style={styles.td}>{ev.lokasi}, <br />{ev.kota}</td>
                                <td style={styles.td}>Rp {parseInt(ev.price).toLocaleString('id-ID')}</td>
                                <td style={styles.td}><span style={{ fontWeight: 'bold' }}>{ev.totalSeats || 0}</span> Kursi</td>
                                <td style={styles.td}>
                                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', background: '#D1FAE5', color: '#065F46' }}>
                                        {ev.status}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <button onClick={() => handleDelete(ev.id)} style={{ ...styles.btnIcon, color: '#EF4444' }}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>{isEditing ? 'Edit Event' : 'Tambah Event Baru'}</h2>
                        <form onSubmit={handleSave}>
                            <label style={styles.label}>Nama Event</label>
                            <input name="nama" value={formData.nama} onChange={handleChange} required style={styles.input} />

                            <label style={styles.label}>Nama Talent</label>
                            <input name="talent" value={formData.talent} onChange={handleChange} required style={styles.input} />

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Tanggal</label>
                                    <input type="date" name="jadwal" value={formData.jadwal} onChange={handleChange} required style={styles.input} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Jam (WIB)</label>
                                    <input type="time" name="jam" value={formData.jam} onChange={handleChange} required style={styles.input} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Lokasi</label>
                                    <input name="lokasi" value={formData.lokasi} onChange={handleChange} required style={styles.input} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Kota</label>
                                    <input name="kota" value={formData.kota} onChange={handleChange} required style={styles.input} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Harga Tiket</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} required style={styles.input} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ ...styles.label, color: '#D97706' }}>Total Kuota</label>
                                    <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} required style={styles.input} />
                                </div>
                            </div>

                            <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.btnCancel}>Batal</button>
                                <button type="submit" style={styles.btnSave} disabled={loading}>
                                    {loading ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    btnAdd: { background: '#F59E0B', color: 'black', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    tableContainer: { background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #E5E7EB' },
    th: { padding: '15px', fontSize: '13px', color: '#6B7280', fontWeight: 'bold' },
    td: { padding: '15px', fontSize: '14px', color: '#1F2937' },
    btnIcon: { cursor: 'pointer', border: 'none', background: 'none', fontSize: '18px', marginRight: '5px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { background: 'white', padding: '30px', borderRadius: '16px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' },
    label: { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px', marginTop: '15px', color: '#374151' },
    input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box', fontSize: '14px' },
    btnCancel: { padding: '10px 20px', borderRadius: '8px', border: '1px solid #D1D5DB', background: 'white', cursor: 'pointer', fontWeight: '500' },
    btnSave: { padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#F59E0B', color: 'black', fontWeight: 'bold', cursor: 'pointer' }
};

export default ManajemenEvent;
