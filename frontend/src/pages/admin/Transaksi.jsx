import React from 'react';

const Transaksi = () => {
  const transactions = [
    { id: 'INV-001', user: 'Sarah Wijaya', email: 'sarahwijaya@email.com', event: 'Stand Up Comedy Spesial Akhir Tahun - VIP', total: 'RP 150.000', method: 'QRIS', status: 'Lunas' },
    { id: 'INV-002', user: 'Budi Santoso', email: 'budisantoso@email.com', event: 'Comedy Festival 2025 - Reguler', total: 'RP 75.000', method: 'Transfer Bank', status: 'Menunggu' },
    { id: 'INV-003', user: 'Budi Santoso', email: 'budisantoso@email.com', event: 'Lawak Malam Minggu - Reguler', total: 'RP 50.000', method: 'Go-Pay', status: 'Gagal' },
  ];

  return (
    <div style={{ color: '#111827' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Transaksi</h1>
          <p style={{ color: '#6B7280' }}>Monitor dan kelola semua transaksi tiket</p>
        </div>
        <button style={{ background: '#0B3996', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '600' }}>📤 Export</button>
      </header>

      {/* Filter Section */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '30px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', border: '1px solid #F3F4F6' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280' }}>Event</label>
          <select style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #E5E7EB', marginTop: '5px' }}><option>Semua Event</option></select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280' }}>Status</label>
          <select style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #E5E7EB', marginTop: '5px' }}><option>Semua Status</option></select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280' }}>Tanggal Mulai</label>
          <input type="date" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #E5E7EB', marginTop: '5px' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280' }}>Tanggal Akhir</label>
          <input type="date" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #E5E7EB', marginTop: '5px' }} />
        </div>
      </div>

      {/* Table Section */}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #F3F4F6' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #F3F4F6', color: '#6B7280' }}>
              <th style={{ padding: '15px' }}>ID TRANSAKSI</th>
              <th style={{ padding: '15px' }}>PEMBELI</th>
              <th style={{ padding: '15px' }}>EVENT & TIKET</th>
              <th style={{ padding: '15px' }}>TOTAL</th>
              <th style={{ padding: '15px' }}>METODE</th>
              <th style={{ padding: '15px' }}>STATUS</th>
              <th style={{ padding: '15px' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F9FAFB' }}>
                <td style={{ padding: '15px', fontWeight: '600' }}>{trx.id}</td>
                <td style={{ padding: '15px' }}>
                  <div style={{ fontWeight: 'bold' }}>{trx.user}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{trx.email}</div>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ fontWeight: '500' }}>{trx.event}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>1 Tiket</div>
                </td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>{trx.total}</td>
                <td style={{ padding: '15px', color: '#9CA3AF' }}>{trx.method}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '15px', fontSize: '11px', fontWeight: '600',
                    background: trx.status === 'Lunas' ? '#DCFCE7' : trx.status === 'Menunggu' ? '#FEF3C7' : '#FEE2E2',
                    color: trx.status === 'Lunas' ? '#166534' : trx.status === 'Menunggu' ? '#92400E' : '#991B1B'
                  }}>{trx.status}</span>
                </td>
                <td style={{ padding: '15px' }}>
                   <div style={{ display: 'flex', gap: '10px' }}>
                      <button style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer' }}>Detail</button>
                      <button style={{ background: 'none', border: 'none', color: '#10B981', cursor: 'pointer' }}>Resend</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transaksi;