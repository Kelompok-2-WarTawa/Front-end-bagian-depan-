import React, { useState } from 'react';
import { getEvents, saveEvents } from '../../utils/eventStore';

const ManajemenEvent = () => {
  const [events, setEvents] = useState(() => getEvents());
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // Field 'image' di sini
  const defaultForm = {
    nama: '',
    talent: '',
    jadwal: '',
    jam: '',
    lokasi: '',
    kota: '',
    status: 'Published',
    image: ''
  };

  const [formData, setFormData] = useState(defaultForm);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Upload Gambar & Konversi
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file); 
    }
  };

  // --- LOGIKA EDIT EVENT ---
  const handleEditClick = (event) => {
    setEditId(event.id);
    setFormData({
      nama: event.nama,
      talent: event.talent,
      jadwal: event.jadwal,
      jam: event.jam,
      lokasi: event.lokasi,
      kota: event.kota,
      status: event.status,
      image: event.image || '' 
    });
    setShowModal(true);
  };

  // --- LOGIKA SIMPAN ---
  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedEvents;

    if (editId) {
      // MODE EDIT
      updatedEvents = events.map((item) => 
        item.id === editId ? { ...item, ...formData } : item
      );
    } else {
      // MODE TAMBAH BARU
      const newEvent = {
        id: Date.now(),
        ...formData
      };
      updatedEvents = [...events, newEvent];
    }

    setEvents(updatedEvents);
    saveEvents(updatedEvents);

    resetForm();
    alert(editId ? 'Event berhasil diperbarui!' : 'Event berhasil ditambahkan!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus event ini?')) {
      const updatedEvents = events.filter(event => event.id !== id);
      setEvents(updatedEvents);
      saveEvents(updatedEvents);
    }
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setEditId(null);
    setShowModal(false);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Manajemen Event</h1>
        <p style={{ color: '#6B7280', marginTop: '5px' }}>Kelola semua acara stand-up comedy Anda</p>
      </div>

      {/* Tombol Tambah */}
      <button 
        onClick={() => { resetForm(); setShowModal(true); }}
        style={{
          background: '#0B3996',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
        + Tambah Event Baru
      </button>

      {/* Tabel */}
      <div style={{ 
        background: 'white', borderRadius: '16px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden'
      }}>
        {events.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>Belum ada event.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F4F6', color: '#9CA3AF', fontSize: '12px' }}>
                <th style={{ padding: '20px', fontWeight: '600' }}>THUMBNAIL</th>
                <th style={{ padding: '20px', fontWeight: '600' }}>NAMA EVENT</th>
                <th style={{ padding: '20px', fontWeight: '600' }}>JADWAL</th>
                <th style={{ padding: '20px', fontWeight: '600' }}>LOKASI</th>
                <th style={{ padding: '20px', fontWeight: '600' }}>STATUS</th>
                <th style={{ padding: '20px', fontWeight: '600' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                  
                  {/* TAMPILKAN GAMBAR DI TABEL */}
                  <td style={{ padding: '20px' }}>
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt="Thumb" 
                        style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #ddd' }} 
                      />
                    ) : (
                      <div style={{ width: '60px', height: '60px', background: '#D1D5DB', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#666' }}>No Img</div>
                    )}
                  </td>

                  <td style={{ padding: '20px' }}>
                    <div style={{ fontWeight: '700', color: '#111827', fontSize: '14px' }}>{event.nama}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{event.talent}</div>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>{event.jadwal}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{event.jam} WIB</div>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>{event.lokasi}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{event.kota}</div>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                      background: event.status === 'Cancelled' ? '#FEE2E2' : event.status === 'Draft' ? '#F3F4F6' : '#DCFCE7',
                      color: event.status === 'Cancelled' ? '#991B1B' : event.status === 'Draft' ? '#374151' : '#166534'
                    }}>
                      {event.status}
                    </span>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <span onClick={() => handleEditClick(event)} style={{ cursor: 'pointer', color: '#6B7280' }} title="Edit">✏️</span>
                      <span onClick={() => handleDelete(event.id)} style={{ cursor: 'pointer', color: '#EF4444' }} title="Hapus">🗑️</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL FORM */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <h2 style={{ color: '#111827', marginTop: 0, marginBottom: '20px', fontSize: '20px' }}>
              {editId ? 'Edit Event' : 'Tambah Event Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* INPUT GAMBAR DI DALAM FORM */}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>Thumbnail Event</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {/* Preview Gambar Kecil */}
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E5E7EB' }} 
                    />
                  )}
                  {/* Tombol Input File */}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ fontSize: '14px', color: '#6B7280' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>Nama Event</label>
                <input required type="text" name="nama" value={formData.nama} onChange={handleInputChange} 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', color: '#111827', background: 'white' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>Talent / Komika</label>
                <input required type="text" name="talent" value={formData.talent} onChange={handleInputChange} 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', color: '#111827', background: 'white' }} />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>Tanggal</label>
                  <input required type="date" name="jadwal" value={formData.jadwal} onChange={handleInputChange} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', color: '#111827', background: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>Jam</label>
                  <input required type="time" name="jam" value={formData.jam} onChange={handleInputChange} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', color: '#111827', background: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>Lokasi</label>
                  <input required type="text" name="lokasi" value={formData.lokasi} onChange={handleInputChange} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', color: '#111827', background: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>Kota</label>
                  <input required type="text" name="kota" value={formData.kota} onChange={handleInputChange} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', color: '#111827', background: 'white' }} />
                </div>
              </div>

              {/* DROPDOWN STATUS */}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>Status Event</label>
                <select name="status" value={formData.status} onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', color: '#111827', background: 'white' }}>
                  <option value="Published">Published (Tayang)</option>
                  <option value="Draft">Draft (Disimpan)</option>
                  <option value="Cancelled">Cancelled (Batal)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={resetForm}
                  style={{ background: 'transparent', border: '1px solid #D1D5DB', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', color: '#374151' }}>
                  Batal
                </button>
                <button type="submit" 
                  style={{ background: '#0B3996', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                  {editId ? 'Simpan Perubahan' : 'Simpan Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenEvent;