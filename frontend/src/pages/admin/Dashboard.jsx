// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../utils/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEvents: 0,
        activeEvents: 0,
        totalIncome: 0,
        totalTicketsSold: 0,
        recentSales: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // GET /api/dashboard
                const data = await apiRequest('/dashboard');

                setStats({
                    totalEvents: data.active_events,
                    activeEvents: data.active_events,
                    totalIncome: data.total_revenue,
                    totalTicketsSold: data.tickets_sold,
                    recentSales: data.recent_transactions.map(t => ({
                        user: t.user,
                        email: '-',
                        event: 'N/A',
                        amount: `Rp ${t.amount.toLocaleString('id-ID')}`,
                        status: t.status === 'confirmed' ? 'Lunas' : t.status,
                        invoiceID: t.booking_code,
                        time: new Date(t.date).toLocaleDateString()
                    }))
                });
            } catch (error) {
                console.error("Gagal memuat dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Memuat Data Dashboard...</div>;

    return (
        <div style={{ color: '#111827' }}>

            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Dashboard Overview</h1>
                <p style={{ color: '#6B7280' }}>Pantau performa penjualan tiket real-time.</p>
            </div>

            {/* --- KARTU STATISTIK --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>

                {/* Card 1: Total Pendapatan */}
                <div style={styles.cardYellow}>
                    <div style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Pendapatan</div>
                    <div style={{ fontSize: '25px', fontWeight: '800', margin: '10px 0', wordBreak: 'break-word' }}>
                        {formatRupiah(stats.totalIncome)}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                        Dari {stats.totalTicketsSold} tiket terjual
                    </div>
                </div>

                {/* Card 2: Total Event */}
                <div style={styles.cardWhite}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ color: '#6B7280', fontSize: '14px', fontWeight: '600' }}>Event Aktif</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{stats.activeEvents}</div>
                        </div>
                        <div style={{ fontSize: '30px', padding: '10px', background: '#ECFDF5', borderRadius: '8px' }}>🎤</div>
                    </div>
                </div>

                {/* Card 3: Tiket Terjual */}
                <div style={styles.cardWhite}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ color: '#6B7280', fontSize: '14px', fontWeight: '600' }}>Tiket Terjual</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{stats.totalTicketsSold}</div>
                        </div>
                        <div style={{ fontSize: '30px', padding: '10px', background: '#FFFBEB', borderRadius: '8px' }}>🎫</div>
                    </div>
                </div>

                {/* Card 4: Shortcut Validasi */}
                <Link to="/admin/validation" style={{ textDecoration: 'none' }}>
                    <div style={{ ...styles.cardWhite, border: '2px dashed #F59E0B', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '130px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '5px' }}>📷</div>
                        <div style={{ fontWeight: 'bold', color: '#F59E0B' }}>Scan Tiket</div>
                    </div>
                </Link>

            </div>

            {/* --- TABEL TRANSAKSI TERBARU --- */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '30px', border: '1px solid #F3F4F6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>Transaksi Terbaru</h3>
                </div>

                {stats.recentSales.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '30px', background: '#F9FAFB', borderRadius: '8px' }}>
                        Belum ada transaksi masuk.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: '#6B7280', fontSize: '12px', borderBottom: '2px solid #F3F4F6' }}>
                                    <th style={{ padding: '12px 0' }}>KODE</th>
                                    <th style={{ padding: '12px 0' }}>PEMBELI</th>
                                    <th style={{ padding: '12px 0' }}>NOMINAL</th>
                                    <th style={{ padding: '12px 0' }}>STATUS</th>
                                    <th style={{ padding: '12px 0' }}>TANGGAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentSales.map((trx, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #F9FAFB' }}>
                                        <td style={{ padding: '15px 0', fontSize: '13px', fontFamily: 'monospace', color: '#374151' }}>{trx.invoiceID}</td>
                                        <td style={{ padding: '15px 0', fontSize: '14px', fontWeight: '600' }}>{trx.user}</td>
                                        <td style={{ padding: '15px 0', fontSize: '14px', color: '#059669', fontWeight: '600' }}>{trx.amount}</td>
                                        <td style={{ padding: '15px 0' }}>
                                            <span style={{
                                                fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px',
                                                background: trx.status === 'Lunas' ? '#DCFCE7' : '#FEF3C7',
                                                color: trx.status === 'Lunas' ? '#166534' : '#D97706'
                                            }}>
                                                {trx.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px 0', fontSize: '12px', color: '#6B7280' }}>
                                            {trx.time}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
};

const styles = {
    cardYellow: { backgroundColor: '#F59E0B', color: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '130px' },
    cardWhite: { backgroundColor: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '130px' }
};

export default Dashboard;
