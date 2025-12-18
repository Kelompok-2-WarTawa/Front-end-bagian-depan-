// src/pages/admin/ManajementEvent.jsx
import React, { useState, useEffect } from 'react';
import { getEvents, addEvent, updateEvent, deleteEvent } from '../../utils/eventStore';

const ManajemenEvent = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialFormState = {
    id: null,
    nama: '',
    talent: '',
    jadwal: '',
    jam: '',
    lokasi: '',
    kota: '',
    price: '',
    status: 'Published',
    image: '' 
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setEvents(getEvents());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- FUNGSI BARU: HANDLE UPLOAD GAMBAR ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Hasil konversi gambar ke text (Base64) disimpan ke state
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  // -----------------------------------------

  const handleOpenAdd = () => {
    setFormData({
        ...initialFormState,
        image: '' // Kosongkan awal agar user upload sendiri
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event) => {
    setFormData(event);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    const dataToSave = {
        ...formData,
        price: parseInt(formData.price) || 0,
        // Jika user tidak upload gambar, pakai gambar default placeholder
        image: formData.image || 'https://placehold.co/400x300/1a1a1a/F59E0B?text=No+Image'
    };

    if (isEditing) {
        updateEvent(dataToSave);
        alert("Event berhasil diperbarui!");
    } else {
        addEvent(dataToSave);
        alert("Event baru berhasil ditambahkan!");
    }
    
    setIsModalOpen(false);
    refreshData();
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus event ini?")) {
        deleteEvent(id);
        refreshData();
    }
  };

  return (
    <div style={{ color: '#111827', padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Manajemen Event</h1>
            <p style={{ color: '#6B7280', marginTop: '5px' }}>Kelola jadwal stand-up comedy Anda di sini</p>
        </div>
        <button onClick={handleOpenAdd} style={styles.btnAdd}>+ Tambah Event</button>
      </div>

      <div style={styles.tableContainer}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            <tr>
              <th style={styles.th}>EVENT & THUMBNAIL</th>
              <th style={styles.th}>JADWAL</th>
              <th style={styles.th}>LOKASI</th>
              <th style={styles.th}>HARGA</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                <td style={{...styles.td, display: 'flex', alignItems: 'center', gap: '10px'}}>
                    {/* Tampilkan gambar kecil di tabel */}
                    <img 
                        src={ev.image} 
                        alt="thumb" 
                        style={{width: '60px', height: '40px', borderRadius: '4px', objectFit: 'cover', backgroundColor: '#eee'}} 
                    />
                    <div>
                        <div style={{fontWeight: 'bold'}}>{ev.nama}</div>
                        <div style={{fontSize: '12px', color: '#F59E0B'}}>{ev.talent}</div>
                    </div>
                </td>
                <td style={styles.td}>{ev.jadwal} <br/><span style={{fontSize:'12px', color:'#666'}}>{ev.jam} WIB</span></td>
                <td style={styles.td}>{ev.lokasi}, <br/>{ev.kota}</td>
                <td style={styles.td}>Rp {parseInt(ev.price).toLocaleString('id-ID')}</td>
                <td style={styles.td}>
                    <span style={{
                        padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
                        background: ev.status === 'Published' ? '#D1FAE5' : '#E5E7EB',
                        color: ev.status === 'Published' ? '#065F46' : '#374151'
                    }}>
                        {ev.status}
                    </span>
                </td>
                <td style={styles.td}>
                  <button onClick={() => handleOpenEdit(ev)} style={styles.btnIcon}>✏️</button>
                  <button onClick={() => handleDelete(ev.id)} style={styles.btnIcon}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h2 style={{marginTop: 0, marginBottom: '20px'}}>{isEditing ? 'Edit Event' : 'Tambah Event Baru'}</h2>
                
                <form onSubmit={handleSave}>
                    
                    {/* --- INPUT FILE GAMBAR --- */}
                    <label style={styles.label}>Upload Thumbnail</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        style={styles.input} 
                    />
                    {/* Preview Gambar jika sudah dipilih */}
                    {formData.image && (
                        <div style={{marginTop: '10px', textAlign: 'center', background: '#f9f9f9', padding: '10px', borderRadius: '8px'}}>
                            <p style={{fontSize: '12px', color: '#666', margin: '0 0 5px 0'}}>Preview:</p>
                            <img src={formData.image} alt="Preview" style={{width: '100%', maxHeight: '150px', objectFit: 'contain', borderRadius: '6px'}} />
                        </div>
                    )}
                    {/* ------------------------- */}

                    <label style={styles.label}>Nama Event</label>
                    <input name="nama" value={formData.nama} onChange={handleChange} required style={styles.input} placeholder="Contoh: Stand Up Nite" />
                    
                    <label style={styles.label}>Nama Talent / Artis</label>
                    <input name="talent" value={formData.talent} onChange={handleChange} required style={styles.input} placeholder="Contoh: Raditya Dika" />

                    <div style={{display:'flex', gap:'15px'}}>
                        <div style={{flex:1}}>
                            <label style={styles.label}>Tanggal</label>
                            <input type="date" name="jadwal" value={formData.jadwal} onChange={handleChange} required style={styles.input} />
                        </div>
                        <div style={{flex:1}}>
                            <label style={styles.label}>Jam (WIB)</label>
                            <input type="time" name="jam" value={formData.jam} onChange={handleChange} required style={styles.input} />
                        </div>
                    </div>

                    <div style={{display:'flex', gap:'15px'}}>
                        <div style={{flex:1}}>
                             <label style={styles.label}>Lokasi (Gedung)</label>
                             <input name="lokasi" value={formData.lokasi} onChange={handleChange} required style={styles.input} placeholder="Gedung..." />
                        </div>
                        <div style={{flex:1}}>
                             <label style={styles.label}>Kota</label>
                             <input name="kota" value={formData.kota} onChange={handleChange} required style={styles.input} placeholder="Jakarta..." />
                        </div>
                    </div>

                    <div style={{display:'flex', gap:'15px'}}>
                        <div style={{flex:1}}>
                            <label style={styles.label}>Harga Tiket (Rp)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required style={styles.input} placeholder="150000" />
                        </div>
                        <div style={{flex:1}}>
                            <label style={styles.label}>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} style={styles.input}>
                                <option value="Published">Published</option>
                                <option value="Draft">Draft</option>
                            </select>
                        </div>
                    </div>

                    <div style={{marginTop: '25px', display:'flex', justifyContent:'end', gap:'10px'}}>
                        <button type="button" onClick={() => setIsModalOpen(false)} style={styles.btnCancel}>Batal</button>
                        <button type="submit" style={styles.btnSave}>Simpan Data</button>
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
    btnIcon: { cursor: 'pointer', border:'none', background:'none', fontSize:'18px', marginRight: '5px' },
    
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex: 1000 },
    modalContent: { background: 'white', padding: '30px', borderRadius: '16px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
    label: { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px', marginTop: '15px', color: '#374151' },
    input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box', fontSize: '14px' },
    btnCancel: { padding: '10px 20px', borderRadius: '8px', border: '1px solid #D1D5DB', background: 'white', cursor: 'pointer', fontWeight: '500' },
    btnSave: { padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#F59E0B', color: 'black', fontWeight: 'bold', cursor: 'pointer' }
};

export default ManajemenEvent;