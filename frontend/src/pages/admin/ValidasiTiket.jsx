import React from 'react';

const ValidasiTiket = () => {
  const checkInLog = [
    { name: 'Sarah Wijaya', type: 'VIP', code: 'TKT-2024-VIP-059', time: '2 detik lalu', color: '#DCFCE7', textColor: '#166534' },
    { name: 'Ahmad Rizki', type: 'REGULAR', code: 'TKT-2024-REG-231', time: '25 detik lalu', color: '#DBEAFE', textColor: '#1E40AF' },
    { name: 'Diana Putri', type: 'VIP', code: 'TKT-2024-VIP-015', time: '1 menit lalu', color: '#DCFCE7', textColor: '#166534' },
    { name: 'Budi Santoso', type: 'REGULAR', code: 'TKT-2024-REG-137', time: '2 menit lalu', color: '#DBEAFE', textColor: '#1E40AF' },
    { name: 'Rina Melati', type: 'REGULAR', code: 'TKT-2024-REG-156', time: '3 menit lalu', color: '#DBEAFE', textColor: '#1E40AF' },
  ];

  return (
    <div style={{ display: 'flex', gap: '30px', color: '#111827' }}>
      {/* Kolom Kiri: Scanner Area */}
      <div style={{ flex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Validasi Tiket Check-in</h1>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>Scan QR Code atau masukkan kode tiket manual</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>Total Check-in Hari Ini</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6' }}>247</div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', border: '1px solid #F3F4F6', textAlign: 'center' }}>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', textAlign: 'left', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Input Manual Kode Tiket</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="Masukkan kode tiket (contoh: TKT-2024-001)" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
              <button style={{ background: '#0B3996', color: 'white', border: 'none', padding: '0 25px', borderRadius: '8px', fontWeight: '600' }}>✓ Validasi</button>
            </div>
          </div>

          <div style={{ color: '#9CA3AF', fontSize: '12px', margin: '20px 0' }}>— ATAU —</div>

          <div style={{ margin: '0 auto', width: '300px', height: '300px', background: '#0B1120', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <div style={{ color: 'white', fontSize: '40px', marginBottom: '10px' }}>📷</div>
            <div style={{ color: 'white', fontSize: '14px' }}>Arahkan QR Code ke kamera</div>
            <div style={{ position: 'absolute', bottom: '-25px', color: '#10B981', fontSize: '12px' }}>● Kamera Aktif</div>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Log Activities */}
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>🕒 Log Check-in Realtime</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {checkInLog.map((log, i) => (
            <div key={i} style={{ background: log.color, padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{log.name}</span>
                  <span style={{ fontSize: '10px', color: '#6B7280' }}>{log.time}</span>
                </div>
                <div style={{ fontSize: '11px', color: log.textColor, fontWeight: '700', marginTop: '2px' }}>{log.type}</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>{log.code}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValidasiTiket;