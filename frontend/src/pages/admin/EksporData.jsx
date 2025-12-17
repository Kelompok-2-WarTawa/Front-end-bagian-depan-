import React from 'react';

const EksporData = () => {
  const exportHistory = [
    { name: 'Data Pembeli - Tech Conference', date: '15 Desember 2024, 14:30' },
    { name: 'Laporan Keuangan - Semua Event', date: '12 Desember 2024, 09:15' },
    { name: 'Data Check-in - Music Festival', date: '10 Desember 2024, 16:45' },
  ];

  return (
    <div style={{ color: '#111827' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Ekspor Data</h1>
        <p style={{ color: '#6B7280' }}>Generate dan unduh laporan data event Anda</p>
      </header>

      {/* Info Box */}
      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '15px', borderRadius: '8px', color: '#1E40AF', fontSize: '13px', marginBottom: '30px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span>Pilih filter yang sesuai untuk menghasilkan laporan. Laporan akan mencakup semua data berdasarkan kriteria yang Anda pilih.</span>
      </div>

      {/* Main Form Area */}
      <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #F3F4F6', marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '25px', fontSize: '18px' }}>Generator Laporan</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {/* Pilih Event */}
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>Pilih Event</label>
            <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              <option>Semua Event</option>
            </select>
          </div>

          {/* Rentang Waktu */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>Tanggal Mulai</label>
              <input type="date" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>Tanggal Sampai</label>
              <input type="date" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
            </div>
          </div>

          {/* Jenis Data */}
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '15px', fontSize: '14px' }}>Jenis Data</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Data Pembeli</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>Informasi pembeli tiket, nama, email, nomor telepon</div>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer' }}>
                <input type="checkbox" />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Data Keuangan</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>Transaksi, pendapatan, metode pembayaran</div>
                </div>
              </label>
            </div>
          </div>

          {/* Format File */}
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '15px', fontSize: '14px' }}>Format File</label>
            <div style={{ display: 'flex', gap: '15px' }}>
              {['Excel', 'CSV', 'PDF'].map((fmt) => (
                <div key={fmt} style={{ flex: 1, textAlign: 'center', padding: '20px', border: '1px solid #E5E7EB', borderRadius: '12px', cursor: 'pointer' }}>
                   <div style={{ fontSize: '24px', marginBottom: '5px' }}>{fmt === 'Excel' ? '📁' : fmt === 'CSV' ? '📄' : '📕'}</div>
                   <div style={{ fontWeight: 'bold' }}>{fmt}</div>
                </div>
              ))}
            </div>
          </div>

          <button style={{ background: '#0B3996', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
            Unduh Laporan
          </button>
        </div>
      </div>

      {/* Riwayat Table */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Riwayat Ekspor Terbaru</h3>
          <button style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer' }}>Lihat Semua</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {exportHistory.map((item, i) => (
            <div key={i} style={{ background: 'white', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{item.date}</div>
                </div>
              </div>
              <button style={{ color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>📥</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EksporData;