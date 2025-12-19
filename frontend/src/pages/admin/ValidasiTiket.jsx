// src/pages/admin/ValidasiTiket.jsx
import React, { useState } from 'react';
import { apiRequest } from '../../utils/api';

const ValidasiTiket = () => {
    const [inputCode, setInputCode] = useState('');
    const [checkInLog, setCheckInLog] = useState([]);
    const [feedback, setFeedback] = useState({ msg: '', type: '' });
    const [loading, setLoading] = useState(false);

    const processValidation = async (code) => {
        if (!code) return;
        setLoading(true);
        setFeedback({ msg: 'Memproses...', type: 'warning' });

        try {
            // CALL BACKEND: POST /api/bookings/{code}/checkin
            const result = await apiRequest(`/bookings/${code}/checkin`, 'POST');

            // Sukses
            setFeedback({
                msg: `✅ Check-in Berhasil: ${result.guest}`,
                type: 'success'
            });

            // Add to log
            const newLog = {
                name: result.guest,
                type: 'BERHASIL',
                code: code,
                time: new Date().toLocaleTimeString(),
                color: '#DCFCE7',
                textColor: '#166534'
            };
            setCheckInLog(prev => [newLog, ...prev]);
            setInputCode('');

        } catch (error) {
            // Gagal (Tiket tidak ada, atau sudah dipakai)
            setFeedback({
                msg: `❌ ${error.message}`,
                type: 'error'
            });

            const newLog = {
                name: 'Unknown',
                type: 'GAGAL',
                code: code,
                time: new Date().toLocaleTimeString(),
                color: '#FEE2E2',
                textColor: '#991B1B'
            };
            setCheckInLog(prev => [newLog, ...prev]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '30px', color: '#111827' }}>
            <div style={{ flex: 2 }}>
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Validasi Tiket Check-in</h1>
                    <p style={{ color: '#6B7280', fontSize: '14px' }}>Scan QR Code atau masukkan kode tiket manual</p>
                </div>

                <div style={{ background: 'white', padding: '40px', borderRadius: '16px', border: '1px solid #F3F4F6', textAlign: 'center' }}>

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
                                placeholder="Cth: BKG-XYZ..."
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                            />
                            <button
                                onClick={() => processValidation(inputCode)}
                                disabled={loading}
                                style={{ background: '#0B3996', color: 'white', border: 'none', padding: '0 25px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                            >
                                {loading ? '...' : '✓ Validasi'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>🕒 Log Sesi Ini</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
                    {checkInLog.map((log, i) => (
                        <div key={i} style={{ background: log.color, padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #eee' }}>
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
            </div>
        </div>
    );
};

export default ValidasiTiket;
