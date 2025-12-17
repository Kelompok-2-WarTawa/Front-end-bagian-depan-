import React from 'react';

const ManajemenEvent = () => {
  // Data dummy sesuai gambar
  const events = [
    {
      nama: 'Stand Up Comedy Spesial Akhir Tahun',
      talent: 'Raditya Dika',
      jadwal: '13 Desember 2025',
      jam: '19:00 WIB',
      lokasi: 'Balai Sarbini',
      kota: 'Jakarta Selatan',
      status: 'Published'
    },
    {
      nama: 'Open Mic Night - Bandung',
      talent: 'Pandji Pragiwaksono',
      jadwal: '14 Desember 2025',
      jam: '20:00 WIB',
      lokasi: 'The Hall Senayan',
      kota: 'Bandung',
      status: 'Published'
    },
    {
      nama: 'Comedy Kings Tour Surabaya',
      talent: 'Ernest Prakasa',
      jadwal: '19 Desember 2025',
      jam: '20:00 WIB',
      lokasi: 'Grand City',
      kota: 'Surabaya',
      status: 'Published'
    }
  ];

  return (
    <div>
      {/* Header Halaman */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Manajemen Event</h1>
        <p style={{ color: '#6B7280', marginTop: '5px' }}>Kelola semua acara stand-up comedy Anda</p>
      </div>

      {/* Tombol Tambah Event */}
      <button style={{
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

      {/* Tabel Manajemen Event */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
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
            {events.map((event, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #F9FAFB' }}>
                {/* Thumbnail placeholder */}
                <td style={{ padding: '20px' }}>
                  <div style={{ width: '60px', height: '60px', background: '#D1D5DB', borderRadius: '4px' }}></div>
                </td>
                
                {/* Nama Event & Talent */}
                <td style={{ padding: '20px' }}>
                  <div style={{ fontWeight: '700', color: '#111827', fontSize: '14px' }}>{event.nama}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{event.talent}</div>
                </td>

                {/* Jadwal */}
                <td style={{ padding: '20px' }}>
                  <div style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>{event.jadwal}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{event.jam}</div>
                </td>

                {/* Lokasi */}
                <td style={{ padding: '20px' }}>
                  <div style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>{event.lokasi}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{event.kota}</div>
                </td>

                {/* Status */}
                <td style={{ padding: '20px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '700',
                    background: '#DCFCE7',
                    color: '#166534'
                  }}>
                    {event.status}
                  </span>
                </td>

                {/* Tombol Aksi */}
                <td style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <span style={{ cursor: 'pointer', color: '#3B82F6' }} title="Lihat">👁️</span>
                    <span style={{ cursor: 'pointer', color: '#6B7280' }} title="Edit">✏️</span>
                    <span style={{ cursor: 'pointer', color: '#EF4444' }} title="Hapus">🗑️</span>
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

export default ManajemenEvent;