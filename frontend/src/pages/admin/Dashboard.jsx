import React from 'react';

const AdminDashboard = () => {
  const summaryCards = [
    { title: 'Total Penjualan', value: 'RP 10.000.000', trend: '+ 12.5%', trendColor: '#10B981' },
    { title: 'Event Aktif', value: '10', trend: '+ 3 Event', trendColor: '#F39C12' },
    { title: 'Tiket Terjual', value: '327', trend: '+ 8.2', trendColor: '#8B5CF6' },
    { title: 'Menunggu Konfirmasi', value: '47', trend: 'Butuh Review', trendColor: '#EF4444' },
  ];

  const transactions = [
    { user: 'Sarah Wijaya', email: 'sarahwijaya@email.com', event: 'Stand Up Comedy Spesial Akhir Tahun - VIP', amount: 'RP 150.000', status: 'Lunas', time: '2 menit lalu' },
    { user: 'Budi Santoso', email: 'budisantoso@email.com', event: 'Comedy Festival 2025 - Reguler', amount: 'RP 75.000', status: 'Pending', time: '5 menit lalu' },
    { user: 'Maya Sari', email: 'mayasari@email.com', event: 'Lawak Malam Minggu - Reguler', amount: 'RP 50.000', status: 'Lunas', time: '8 menit lalu' },
  ];

  return (
    <div>
      {/* Kartu Statistik */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '40px' }}>
        {summaryCards.map((card, i) => (
          <div key={i} style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '15px' }}>{card.title}</p>
            <h2 style={{ color: '#000000ff', fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{card.value}</h2>
            <p style={{ color: card.trendColor, fontSize: '12px', margin: 0, fontWeight: '500' }}>{card.trend}</p>
          </div>
        ))}
      </div>

      {/* Tabel */}
      {/* --- BAGIAN TABEL TRANSAKSI TERBARU --- */}
        <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
        }}>
        <h3 style={{ marginTop: 0, marginBottom: '25px', fontSize: '18px', color: '#111827' }}>
            Transaksi Terbaru
        </h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
            <tr style={{ borderBottom: '1px solid #F3F4F6', color: '#6B7280', fontSize: '12px' }}>
                <th style={{ padding: '12px 10px', fontWeight: '600' }}>PEMBELI</th>
                <th style={{ padding: '12px 10px', fontWeight: '600' }}>EVENT</th>
                <th style={{ padding: '12px 10px', fontWeight: '600' }}>NOMINAL</th>
                <th style={{ padding: '12px 10px', fontWeight: '600' }}>STATUS</th>
                <th style={{ padding: '12px 10px', fontWeight: '600' }}>WAKTU</th>
            </tr>
            </thead>
            <tbody>
            {transactions.map((trx, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #F9FAFB' }}>
                {/* Kolom Pembeli - Sekarang teksnya dipaksa berwarna gelap */}
                <td style={{ padding: '15px 10px' }}>
                    <div style={{ fontWeight: '700', color: '#111827', fontSize: '14px' }}>{trx.user}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{trx.email}</div>
                </td>
                
                {/* Kolom Event */}
                <td style={{ padding: '15px 10px', color: '#374151', fontSize: '14px' }}>
                    {trx.event}
                </td>
                
                {/* Kolom Nominal */}
                <td style={{ padding: '15px 10px', fontWeight: '600', color: '#111827' }}>
                    {trx.amount}
                </td>
                
                {/* Kolom Status */}
                <td style={{ padding: '15px 10px' }}>
                    <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: trx.status === 'Lunas' ? '#DCFCE7' : '#FEF3C7',
                    color: trx.status === 'Lunas' ? '#166534' : '#92400E'
                    }}>
                    {trx.status}
                    </span>
                </td>
                
                {/* Kolom Waktu */}
                <td style={{ padding: '15px 10px', color: '#9CA3AF', fontSize: '12px' }}>
                    {trx.time}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
  );
};

export default AdminDashboard;