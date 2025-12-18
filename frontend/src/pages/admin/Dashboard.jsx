// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../utils/eventStore';
import { getAllTransactions } from '../../utils/transactionStore';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalIncome: 0,
    totalTicketsSold: 0,
    recentSales: []
  });

  useEffect(() => {
    const events = getEvents();
    const transactions = getAllTransactions();

    // Hitung Income (Hanya yang statusnya Lunas/Checked-in)
    const validTrx = transactions.filter(t => t.status === 'Lunas' || t.status === 'Checked-in');
    
    const income = validTrx.reduce((acc, curr) => {
        const cleanAmount = curr.amount ? curr.amount.replace(/[^0-9]/g, '') : '0';
        return acc + parseInt(cleanAmount);
    }, 0);

    setStats({
      totalEvents: events.length,
      activeEvents: events.filter(e => e.status === 'Published').length,
      totalIncome: income,
      totalTicketsSold: validTrx.length, 
      recentSales: transactions.slice(0, 5) // Hanya mengambil 5 transaksi terbaru
    });
  }, []);

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);

  return (
    <div style={{ color: '#111827' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Dashboard Overview</h1>
        <p style={{ color: '#6B7280' }}>Pantau performa penjualan tiket event Anda hari ini.</p>
      </div>

      {/* --- KARTU STATISTIK --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        
        {/* Card 1: Total Pendapatan */}
        <div style={styles.cardYellow}>
          <div style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Pendapatan</div>
          
          {/* Angka Pendapatan */}
          <div style={{ 
              fontSize: '25px', 
              fontWeight: '800', 
              margin: '10px 0',
              wordBreak: 'break-word', 
          }}>
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
               <div style={{ color: '#6B7280', fontSize: '14px', fontWeight: '600' }}>Total Event</div>
               <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{stats.totalEvents}</div>
            </div>
            <div style={{ fontSize: '30px', padding: '10px', background: '#ECFDF5', borderRadius: '8px' }}>🎤</div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#059669', fontWeight: '600' }}>
            ● {stats.activeEvents} Event Aktif
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
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#D97706', fontWeight: '600' }}>
            Laris Manis!
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
            <Link to="/admin/transactions" style={{ color: '#F59E0B', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>Lihat Semua →</Link>
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
                            <th style={{ padding: '12px 0' }}>INVOICE</th>
                            <th style={{ padding: '12px 0' }}>PEMBELI</th>
                            <th style={{ padding: '12px 0' }}>EVENT</th>
                            <th style={{ padding: '12px 0' }}>NOMINAL</th>
                            <th style={{ padding: '12px 0' }}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.recentSales.map((trx, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #F9FAFB' }}>
                                <td style={{ padding: '15px 0', fontSize: '13px', fontFamily: 'monospace', color: '#374151' }}>{trx.invoiceID}</td>
                                <td style={{ padding: '15px 0', fontSize: '14px', fontWeight: '600' }}>{trx.user}</td>
                                <td style={{ padding: '15px 0', fontSize: '13px', color: '#6B7280' }}>{trx.event}</td>
                                <td style={{ padding: '15px 0', fontSize: '14px', color: '#059669', fontWeight: '600' }}>{trx.amount}</td>
                                <td style={{ padding: '15px 0' }}>
                                    <span style={{ 
                                        fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px',
                                        background: trx.status === 'Lunas' ? '#DCFCE7' : trx.status === 'Checked-in' ? '#DBEAFE' : '#FEF3C7',
                                        color: trx.status === 'Lunas' ? '#166534' : trx.status === 'Checked-in' ? '#1E40AF' : '#D97706'
                                    }}>
                                        {trx.status}
                                    </span>
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
    cardYellow: {
        backgroundColor: '#F59E0B',
        color: 'white',
        padding: '25px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '130px'
    },
    cardWhite: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '16px',
        border: '1px solid #F3F4F6',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '130px'
    }
};

export default Dashboard;