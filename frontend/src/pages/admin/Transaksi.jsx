// src/pages/admin/Transaksi.jsx
import React, { useState, useEffect } from 'react';
import { getAllTransactions } from '../../utils/transactionStore'; // Import Store

const Transaksi = () => {
  // State Transaksi
  const [transactions, setTransactions] = useState([]);

  // Load Data saat halaman dibuka
  useEffect(() => {
    const data = getAllTransactions();
    setTransactions(data);
  }, []);

  return (
    <div style={{ color: '#111827' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Riwayat Transaksi</h1>
        <p style={{ color: '#6B7280' }}>Pantau semua pemasukan tiket secara real-time</p>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
      }}>
        
        {/* Jika Data Kosong */}
        {transactions.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>
                Belum ada transaksi masuk.
            </div>
        ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                <tr style={{ borderBottom: '1px solid #F3F4F6', color: '#6B7280', fontSize: '12px' }}>
                    <th style={{ padding: '15px 10px', fontWeight: '600' }}>PEMBELI</th>
                    <th style={{ padding: '15px 10px', fontWeight: '600' }}>EVENT</th>
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
                        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{trx.email}</div>
                    </td>
                    
                    <td style={{ padding: '15px 10px', color: '#374151', fontSize: '14px' }}>
                        {trx.event}
                    </td>

                    <td style={{ padding: '15px 10px', color: '#374151', fontSize: '12px', fontFamily: 'monospace' }}>
                        {trx.invoiceID}
                    </td>
                    
                    <td style={{ padding: '15px 10px', fontWeight: '600', color: '#111827' }}>
                        {trx.amount}
                    </td>
                    
                    <td style={{ padding: '15px 10px' }}>
                        <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: '#DCFCE7', // Hijau Lunas
                        color: '#166534'
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