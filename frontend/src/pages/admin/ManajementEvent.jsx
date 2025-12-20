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
        talent: '',
        jadwal: '',
        jam: '',
        lokasi: '',
        image: '', 
        phases: [
            { name: 'Early Bird', price: 0, quota: 0, start_date: '', end_date: '' },
            { name: 'Presale', price: 0, quota: 0, start_date: '', end_date: '' },
            { name: 'Regular', price: 0, quota: 0, start_date: '', end_date: '' }
        ]
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = async () => {
        try {
            const data = await apiRequest('/events');

            const mappedEvents = data.map(ev => ({
                id: ev.id,
                nama: ev.name,
                talent: ev.description || '-',
                jadwal: new Date(ev.date).toISOString().split('T')[0],
                jam: new Date(ev.date).toTimeString().slice(0, 5),
                lokasi: ev.venue,
                image: ev.image_url || 'https://placehold.co/400x300',
                status: ev.status,

                totalSeats: ev.capacity || 0,
                phases: ev.phases
            }));
            setEvents(mappedEvents);
        } catch (error) {
            console.error("Gagal load events:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhaseChange = (index, field, value) => {
        const newPhases = [...formData.phases];
        newPhases[index][field] = value;
        setFormData({ ...formData, phases: newPhases });
    };

    // --- LOGIKA UPLOAD GAMBAR ---
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi ukuran (misal max 500KB agar muat di DB sementara)
            if (file.size > 500000) {
                alert("Ukuran file terlalu besar! Gunakan gambar < 500KB atau gunakan URL gambar.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                // Hasil Base64 disimpan ke state image
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOpenAdd = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (ev) => {
        const phasesTemplate = [
            { name: 'Early Bird', price: 0, quota: 0, start_date: '', end_date: '' },
            { name: 'Presale', price: 0, quota: 0, start_date: '', end_date: '' },
            { name: 'Regular', price: 0, quota: 0, start_date: '', end_date: '' }
        ];

        if (ev.phases) {
            ev.phases.forEach((p, idx) => {
                if (idx < 3) {
                    phasesTemplate[idx] = {
                        name: p.name,
                        price: p.price,
                        quota: p.quota,
                        start_date: p.start_date ? p.start_date.split('T')[0] : '',
                        end_date: p.end_date ? p.end_date.split('T')[0] : ''
                    };
                }
            });
        }

        setFormData({
            id: ev.id,
            nama: ev.nama,
            talent: ev.talent,
            jadwal: ev.jadwal,
            jam: ev.jam,
            lokasi: ev.lokasi,
            image: ev.image,
            phases: phasesTemplate
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        const fullDate = `${formData.jadwal} ${formData.jam}:00`;

        const validPhases = formData.phases.filter(p => p.quota > 0).map(p => ({
            name: p.name,
            price: parseInt(p.price),
            quota: parseInt(p.quota),
            start_date: p.start_date ? p.start_date + ' 00:00:00' : fullDate, // Default ke hari H jika kosong
            end_date: p.end_date ? p.end_date + ' 23:59:59' : fullDate
        }));

        if (validPhases.length === 0) {
            alert("Minimal isi 1 kategori tiket (kuota > 0)!");
            setLoading(false);
            return;
        }

        const payload = {
            name: formData.nama,
            description: formData.talent,
            date: fullDate,
            venue: formData.lokasi,
            image_url: formData.image, // Mengirim URL atau Base64
            phases: validPhases
        };

        try {
            if (isEditing) {
                await apiRequest(`/events/${formData.id}`, 'PUT', {
                    venue: formData.lokasi,
                    name: formData.nama,
                    description: formData.talent,
                    image_url: formData.image,
                    date: fullDate
                });
                alert("Info Event diperbarui!");
            } else {
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
                    <p style={{ color: '#6B7280', marginTop: '5px' }}>Kelola jadwal & kategori tiket</p>
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
                            <th style={styles.th}>TOTAL KUOTA</th>
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
                                <td style={styles.td}>{ev.lokasi}</td>
                                <td style={styles.td}>
                                    {/* Perbaikan Tampilan Kuota */}
                                    <span style={{ fontWeight: 'bold', color: ev.totalSeats > 0 ? '#111827' : '#EF4444' }}>
                                        {ev.totalSeats}
                                    </span> Kursi
                                </td>
                                <td style={styles.td}>
                                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', background: '#D1FAE5', color: '#065F46' }}>
                                        {ev.status}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <button onClick={() => handleOpenEdit(ev)} style={{ ...styles.btnIcon, color: '#0B3996' }}>✏️</button>
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

                            {/* AREA UPLOAD FOTO */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={styles.label}>Poster Event / Gambar</label>

                                <div style={styles.uploadBox}>
                                    <input
                                        type="file"
                                        id="eventImage"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="eventImage" style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'block' }}>
                                        {formData.image ? (
                                            <div style={{ position: 'relative', height: '200px' }}>
                                                <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                                                <div style={{ position: 'absolute', bottom: '10px', left: '0', right: '0', textAlign: 'center' }}>
                                                    <span style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '5px 10px', borderRadius: '15px', fontSize: '12px' }}>Klik untuk ganti foto</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>
                                                <div style={{ fontSize: '30px', marginBottom: '5px' }}>📷</div>
                                                <span style={{ fontWeight: '600', color: '#0B3996' }}>Upload Foto</span>
                                                <p style={{ fontSize: '11px', marginTop: '2px' }}>PNG, JPG (Max 500KB)</p>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                <div style={{ marginTop: '10px' }}>
                                    <label style={{ fontSize: '12px', color: '#666' }}>Atau masukkan URL Gambar:</label>
                                    <input
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px dashed #ccc' }}>
                                <label style={styles.label}>Nama Event</label>
                                <input name="nama" value={formData.nama} onChange={handleChange} required style={styles.input} />

                                <label style={styles.label}>Nama Talent (Deskripsi)</label>
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

                                <label style={styles.label}>Lokasi</label>
                                <input name="lokasi" value={formData.lokasi} onChange={handleChange} required style={styles.input} />
                            </div>

                            <h3 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>Atur Kategori Tiket</h3>
                            {formData.phases.map((phase, idx) => (
                                <div key={idx} style={{ background: '#F3F4F6', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', color: '#0B3996' }}>{phase.name}</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                                        <div>
                                            <label style={styles.subLabel}>Harga</label>
                                            <input type="number" value={phase.price} onChange={(e) => handlePhaseChange(idx, 'price', e.target.value)} style={styles.subInput} />
                                        </div>
                                        <div>
                                            <label style={styles.subLabel}>Kuota</label>
                                            <input type="number" value={phase.quota} onChange={(e) => handlePhaseChange(idx, 'quota', e.target.value)} style={styles.subInput} />
                                        </div>
                                        <div>
                                            <label style={styles.subLabel}>Mulai</label>
                                            <input type="date" value={phase.start_date} onChange={(e) => handlePhaseChange(idx, 'start_date', e.target.value)} style={styles.subInput} />
                                        </div>
                                        <div>
                                            <label style={styles.subLabel}>Akhir</label>
                                            <input type="date" value={phase.end_date} onChange={(e) => handlePhaseChange(idx, 'end_date', e.target.value)} style={styles.subInput} />
                                        </div>
                                    </div>
                                </div>
                            ))}

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
    btnIcon: { cursor: 'pointer', border: 'none', background: 'none', fontSize: '18px', marginRight: '10px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { background: 'white', padding: '30px', borderRadius: '16px', width: '700px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' },
    label: { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px', marginTop: '10px', color: '#374151' },
    input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box', fontSize: '14px' },
    subLabel: { fontSize: '11px', color: '#6B7280', display: 'block', marginBottom: '2px' },
    subInput: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', fontSize: '13px' },
    btnCancel: { padding: '10px 20px', borderRadius: '8px', border: '1px solid #D1D5DB', background: 'white', cursor: 'pointer', fontWeight: '500' },
    btnSave: { padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#F59E0B', color: 'black', fontWeight: 'bold', cursor: 'pointer' },

    // Style Khusus Upload
    uploadBox: {
        border: '2px dashed #D1D5DB',
        borderRadius: '8px',
        backgroundColor: '#F9FAFB',
        marginTop: '5px',
        overflow: 'hidden',
        transition: 'border 0.2s',
        minHeight: '120px'
    }
};

export default ManajemenEvent;
