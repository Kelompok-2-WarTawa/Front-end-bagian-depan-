// src/pages/admin/EksporData.jsx
import React, { useState, useEffect } from 'react';
import { getAllTransactions } from '../../utils/transactionStore';
import { getEvents } from '../../utils/eventStore';


import { jsPDF } from "jspdf"; 
import autoTable from "jspdf-autotable"; 

const EksporData = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('Semua Event');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [includeBuyerData, setIncludeBuyerData] = useState(true);
  const [includeFinancialData, setIncludeFinancialData] = useState(false);
  
  const [fileFormat, setFileFormat] = useState('CSV');

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const handleDownload = () => {
    // A. Ambil Data
    let data = getAllTransactions();
    if (data.length === 0) return alert("Belum ada data transaksi!");

    // Filter Event
    if (selectedEvent !== 'Semua Event') {
        data = data.filter(trx => trx.event === selectedEvent);
    }

    // Filter Tanggal
    if (startDate && endDate) {
        data = data.filter(trx => {
            if (!trx.date) return true; 
            return trx.date >= startDate && trx.date <= endDate;
        });
    }

    if (data.length === 0) return alert("Tidak ada data yang cocok dengan filter ini.");

    // B. Siapkan Kolom
    let headers = ["Invoice ID", "Event", "Waktu"]; 
    if (includeBuyerData) headers.push("Nama Pembeli", "No. HP");
    if (includeFinancialData) headers.push("Nominal", "Status");

    // C. Siapkan Baris Data
    const tableRows = data.map(trx => {
        let row = [trx.invoiceID, trx.event, trx.time];
        if (includeBuyerData) row.push(trx.user, trx.phoneNumber || '-');
        if (includeFinancialData) row.push(trx.amount, trx.status);
        return row;
    });

    // --- LOGIKA GENERATE FILE ---
    if (fileFormat === 'PDF') {
        try {
            // 1. Inisialisasi jsPDF
            const doc = new jsPDF();

            // 2. Judul
            doc.text("Laporan Transaksi WarTawa", 14, 15);
            doc.setFontSize(10);
            doc.text(`Event: ${selectedEvent}`, 14, 22);
            doc.text(`Dicetak: ${new Date().toLocaleString()}`, 14, 27);

            // 3. Buat Tabel (Pakai fungsi autoTable yang diimport)
            autoTable(doc, {
                head: [headers],
                body: tableRows,
                startY: 32,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [22, 101, 52] }, // Hijau
            });

            // 4. Save
            doc.save(`Laporan_${Date.now()}.pdf`);
            alert("✅ PDF Berhasil diunduh!");

        } catch (error) {
            console.error("Gagal cetak PDF:", error);
            alert("Gagal membuat PDF. Cek Console (F12) untuk detail error.");
        }

    } else {
        // --- LOGIKA CSV/EXCEL ---
        const csvHeader = headers.join(",");
        const csvBody = tableRows.map(row => row.map(item => `"${item}"`).join(",")).join("\n");
        const csvString = `${csvHeader}\n${csvBody}`;

        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        const ext = fileFormat === 'Excel' ? 'xls' : 'csv';
        link.href = url;
        link.download = `Laporan_${Date.now()}.${ext}`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert(`✅ ${fileFormat} Berhasil diunduh!`);
    }
  };

  return (
    <div style={{ color: '#111827' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Ekspor Data</h1>
        <p style={{ color: '#6B7280' }}>Generate dan unduh laporan data event Anda</p>
      </header>

      {/* Info Box */}
      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '15px', borderRadius: '8px', color: '#1E40AF', fontSize: '13px', marginBottom: '30px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span>ℹ️ Pilih filter yang sesuai untuk menghasilkan laporan.</span>
      </div>

      <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #F3F4F6', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '25px', fontSize: '18px' }}>Generator Laporan</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* Form Filter Event */}
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>Pilih Event</label>
            <select 
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px' }}
            >
              <option value="Semua Event">Semua Event</option>
              {events.map(ev => (
                  <option key={ev.id} value={ev.nama}>{ev.nama}</option>
              ))}
            </select>
          </div>

          {/* Form Checkbox */}
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '15px', fontSize: '14px' }}>Jenis Data</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', border: includeBuyerData ? '1px solid #2563EB' : '1px solid #E5E7EB', background: includeBuyerData ? '#EFF6FF' : 'white', borderRadius: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={includeBuyerData} onChange={(e) => setIncludeBuyerData(e.target.checked)} />
                <div><div style={{ fontWeight: '600', fontSize: '14px' }}>Data Pembeli</div></div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', border: includeFinancialData ? '1px solid #2563EB' : '1px solid #E5E7EB', background: includeFinancialData ? '#EFF6FF' : 'white', borderRadius: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={includeFinancialData} onChange={(e) => setIncludeFinancialData(e.target.checked)} />
                <div><div style={{ fontWeight: '600', fontSize: '14px' }}>Data Keuangan</div></div>
              </label>
            </div>
          </div>

          {/* Pilihan Format File */}
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '15px', fontSize: '14px' }}>Format File</label>
            <div style={{ display: 'flex', gap: '15px' }}>
              {['Excel', 'CSV', 'PDF'].map((fmt) => (
                <div 
                    key={fmt} 
                    onClick={() => setFileFormat(fmt)}
                    style={{ 
                        flex: 1, textAlign: 'center', padding: '20px', 
                        border: fileFormat === fmt ? '2px solid #2563EB' : '1px solid #E5E7EB', 
                        background: fileFormat === fmt ? '#EFF6FF' : 'white',
                        borderRadius: '12px', cursor: 'pointer'
                    }}
                >
                   <div style={{ fontSize: '24px', marginBottom: '5px' }}>{fmt === 'Excel' ? '📊' : fmt === 'CSV' ? '📄' : '📕'}</div>
                   <div style={{ fontWeight: 'bold', color: fileFormat === fmt ? '#1E40AF' : '#374151' }}>{fmt}</div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleDownload}
            style={{ background: '#0B3996', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}
          >
            📥 Unduh Laporan ({fileFormat})
          </button>
        </div>
      </div>
    </div>
  );
};

export default EksporData;