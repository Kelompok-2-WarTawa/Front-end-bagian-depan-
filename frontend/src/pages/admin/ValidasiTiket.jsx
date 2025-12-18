// src/pages/admin/ValidasiTiket.jsx
import React, { useState, useEffect } from 'react';
import { getAllTransactions, updateTransactionStatus } from '../../utils/transactionStore';

const ValidasiTiket = () => {
  const [inputCode, setInputCode] = useState('');
  const [checkInLog, setCheckInLog] = useState([]); 
  const [checkInCount, setCheckInCount] = useState(0);
  const [feedback, setFeedback] = useState({ msg: '', type: '' });

  // 1. LOAD DATA SAAT PERTAMA KALI (Agar angka tidak 0)
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const allTransactions = getAllTransactions();
    // Hitung berapa yang statusnya 'Checked-in'
    const totalCheckedIn = allTransactions.filter(t => t.status === 'Checked-in').length;
    setCheckInCount(totalCheckedIn);
  };

  // 2. FUNGSI VALIDASI UTAMA
  const processValidation = (code) => {
    if (!code) return;

    const allTransactions = getAllTransactions();
    const foundTrx = allTransactions.find(t => t.invoiceID === code);

    setFeedback({ msg: '', type: '' });

    // Cek Status
    if (!foundTrx) {
        setFeedback({ msg: '❌ Tiket Tidak Ditemukan!', type: 'error' });
        return;
    }
    if (foundTrx.status === 'Pending') {
        setFeedback({ msg: '⚠️ Tiket Belum Lunas!', type: 'warning' });
        return;
    }
    if (foundTrx.status === 'Checked-in') {
        setFeedback({ msg: '🚫 Tiket Sudah Terpakai (Check-in)!', type: 'error' });
        addToLog(foundTrx, 'GAGAL (Duplicate)', '#FEE2E2', '#991B1B'); 
        return;
    }

    // SUKSES CHECK-IN
    if (foundTrx.status === 'Lunas') {
        updateTransactionStatus(code, 'Checked-in');
        
        setFeedback({ msg: `✅ Check-in Berhasil: ${foundTrx.user}`, type: 'success' });
        addToLog(foundTrx, 'BERHASIL', '#DCFCE7', '#166534');
        setInputCode(''); // Reset input
        refreshData(); // Update angka counter
    }
  };

  const addToLog = (trx, statusLabel, bgColor, textColor) => {
      const newLog = {
          name: trx.user,
          type: statusLabel,
          code: trx.invoiceID,
          time: new Date().toLocaleTimeString('id-ID'), // Jam Realtime
          color: bgColor,
          textColor: textColor
      };
      setCheckInLog(prev => [newLog, ...prev]);
  };

  // 3. FITUR SIMULASI KAMERA (Klik untuk Scan)
  const handleSimulateScan = () => {
    const all = getAllTransactions();
    // Cari tiket yang statusnya 'Lunas' (siap scan)
    const validTicket = all.find(t => t.status === 'Lunas');

    if (validTicket) {
        // Simulasi loading sebentar
        setFeedback({ msg: '🔍 Memindai QR Code...', type: 'warning' });
        setTimeout(() => {
            setInputCode(validTicket.invoiceID); // Isi otomatis
            processValidation(validTicket.invoiceID); // Validasi otomatis
        }, 1000);
    } else {
        alert("Tidak ada tiket 'Lunas' yang tersedia untuk simulasi demo.");
    }
  };

  return (
    <div style={{ display: 'flex', gap: '30px', color: '#111827' }}>
      {/* KIRI */}
      <div style={{ flex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Validasi Tiket Check-in</h1>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>Scan QR Code atau masukkan kode tiket manual</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>Total Check-in</div>
            {/* Angka ini sekarang permanen (ambil dari LocalStorage) */}
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6' }}>{checkInCount}</div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', border: '1px solid #F3F4F6', textAlign: 'center' }}>
          
          {/* FEEDBACK ALERT */}
          {feedback.msg && (
              <div style={{
                  padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold',
                  backgroundColor: feedback.type === 'success' ? '#DCFCE7' : feedback.type === 'error' ? '#FEE2E2' : '#FEF3C7',
                  color: feedback.type === 'success' ? '#166534' : feedback.type === 'error' ? '#991B1B' : '#D97706'
              }}>
                  {feedback.msg}
              </div>
          )}

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', textAlign: 'left', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Input Manual Kode Tiket</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && processValidation(inputCode)}
                placeholder="Cth: INV-173..." 
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB' }} 
              />
              <button 
                onClick={() => processValidation(inputCode)}
                style={{ background: '#0B3996', color: 'white', border: 'none', padding: '0 25px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
              >
                ✓ Validasi
              </button>
            </div>
          </div>

          <div style={{ color: '#9CA3AF', fontSize: '12px', margin: '20px 0' }}>— ATAU —</div>

          {/* SIMULASI KAMERA */}
          <div 
            onClick={handleSimulateScan} // KLIK UNTUK SCAN
            style={{ 
                margin: '0 auto', width: '300px', height: '300px', 
                background: '#0B1120', borderRadius: '16px', 
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
                position: 'relative', cursor: 'pointer', border: '2px dashed #374151'
            }}
            title="Klik untuk Simulasi Scan QR"
          >
            <div style={{ color: 'white', fontSize: '40px', marginBottom: '10px' }}>📷</div>
            <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Simulasi Scan Kamera</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '5px' }}>(Klik kotak ini untuk demo)</div>
            <div style={{ position: 'absolute', bottom: '-25px', color: '#10B981', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{width:'8px', height:'8px', background:'#10B981', borderRadius:'50%', display:'inline-block'}}></span> Kamera Aktif
            </div>
          </div>

        </div>
      </div>

      {/* KANAN: LOG */}
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>🕒 Log Sesi Ini</h3>
        {checkInLog.length === 0 ? (
            <div style={{color: '#9CA3AF', fontStyle: 'italic', fontSize: '13px'}}>Belum ada aktivitas scan.</div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
            {checkInLog.map((log, i) => (
                <div key={i} style={{ background: log.color, padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #eee' }}>
                <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight:'bold' }}>
                    {log.type.includes('GAGAL') ? 'X' : '✓'}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{log.name}</span>
                    <span style={{ fontSize: '10px', color: '#6B7280' }}>{log.time}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: log.textColor, fontWeight: '700', marginTop: '2px' }}>{log.type}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'monospace' }}>{log.code}</div>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ValidasiTiket;