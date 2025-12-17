import React from 'react';

const KategoriTiket = () => {
  const categories = [
    { name: 'Early Bird', status: 'Aktif', price: '450.000', quota: '50/100', start: '12/01/2025', end: '12/10/2025', color: '#4ADE80' },
    { name: 'Presale', status: 'Aktif', price: '650.000', quota: '120/100', start: '12/01/2025', end: '12/10/2025', color: '#A855F7' },
    { name: 'VIP Depan', status: 'Aktif', price: '1.250.000', quota: '15/30', start: '12/01/2025', end: '12/10/2025', color: '#EC4899' },
  ];

  return (
    <div style={{ color: '#111827' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Kategori Tiket</h1>
        <p style={{ color: '#6B7280' }}>Kelola kategori dan harga tiket untuk setiap event</p>
      </header>

      <section style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Pilih Event</label>
        <select style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', width: '350px', background: 'white' }}>
          <option>Stand Up Comedy Spesial Akhir Tahun</option>
        </select>
      </section>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Kategori Tiket - Stand Up Comedy Spesial Akhir Tahun</h2>
        <button style={{ background: '#0B3996', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '600' }}>+ Tambah Kategori</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {categories.map((cat, i) => (
          <div key={i} style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: cat.color }}></div>
                <span style={{ fontWeight: 'bold' }}>{cat.name}</span>
                <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '10px' }}>{cat.status}</span>
              </div>
              <input type="checkbox" defaultChecked style={{ width: '40px', height: '20px' }} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '5px' }}>Harga</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '8px' }}>
                  <span style={{ color: '#9CA3AF', marginRight: '5px' }}>Rp</span>
                  <input type="text" defaultValue={cat.price} style={{ border: 'none', width: '100%', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '5px' }}>Kuota</label>
                <input type="text" defaultValue={cat.quota} style={{ border: '1px solid #E5E7EB', borderRadius: '6px', padding: '8px', width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '5px' }}>Mulai Jual</label>
                <input type="text" defaultValue={cat.start} style={{ border: '1px solid #E5E7EB', borderRadius: '6px', padding: '8px', width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '5px' }}>Akhir Jual</label>
                <input type="text" defaultValue={cat.end} style={{ border: '1px solid #E5E7EB', borderRadius: '6px', padding: '8px', width: '100%' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KategoriTiket;