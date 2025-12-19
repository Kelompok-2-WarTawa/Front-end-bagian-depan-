import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';

const Transaksi = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Karena backend belum ada endpoint dedicated /transactions list all
                // Kita pakai data dari dashboard yang sudah ada (Top 5)
                // Atau jika Anda sudah buat endpoint /bookings (Admin only), pakai itu.
                // Di sini kita pakai /dashboard sebagai data source
                const data = await apiRequest('/dashboard');

                // Format ulang agar sesuai tabel
                const formatted = (data.recent_transactions || []).map(trx => ({
                    user: trx.user,
                    email: 'N/A', // Backend dashboard blm return email
                    event: 'N/A', // Backend dashboard blm return event name
                    invoiceID: trx.booking_code,
                    amount: `Rp ${trx.amount.toLocaleString()}`,
                    status: trx.status === 'confirmed' ? 'Lunas' : trx.status,
                    time: new Date(trx.date).toLocaleString()
                }));

                setTransactions(formatted);
            } catch (error) {
                console.error("Gagal load transaksi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ color: '#111827' }}>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Riwayat Transaksi</h1>
                <p style={{ color: '#6B7280' }}>Pantau transaksi (Data dari Dashboard API)</p>
            </div>

            <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                {loading ? <p style={{ textAlign: 'center' }}>Loading...</p> : transactions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                        Belum ada transaksi masuk.
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #F3F4F6', color: '#6B7280', fontSize: '12px' }}>
                                <th style={{ padding: '15px 10px', fontWeight: '600' }}>PEMBELI</th>
                                <th style={{ padding: '15px 10px', fontWeight: '600' }}>INVOICE</th>
                                <th style={{ padding: '15px 10px', fontWeight: '600' }}>NOMINAL</th>
                                <th style={{ padding: '15px 10px', fontWeight: '600' }}>STATUS</th>
                                <th style={{ padding: '15px 10px', fontWeight: '600' }}>WAKTU</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((trx, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #F9FAFB' }}>
                                    <td style={{ padding: '15px 10px' }}>
                                        <div style={{ fontWeight: '700', color: '#111827', fontSize: '14px' }}>{trx.user}</div>
                                    </td>
                                    <td style={{ padding: '15px 10px', color: '#374151', fontSize: '12px', fontFamily: 'monospace' }}>
                                        {trx.invoiceID}
                                    </td>
                                    <td style={{ padding: '15px 10px', fontWeight: '600', color: '#111827' }}>
                                        {trx.amount}
                                    </td>
                                    <td style={{ padding: '15px 10px' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                            background: trx.status === 'Lunas' ? '#DCFCE7' : '#FEF3C7',
                                            color: trx.status === 'Lunas' ? '#166534' : '#D97706'
                                        }}>
                                            {trx.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px 10px', color: '#9CA3AF', fontSize: '12px' }}>
                                        {trx.time}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Transaksi;
