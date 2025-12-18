// src/utils/ticketStore.js

// Data Default (Jika belum ada yang diedit)
const defaultData = {
  early: { 
    price: 50000, 
    start: '2025-12-01', 
    end: '2025-12-31',
    quota: 100
  },
  presale: { 
    price: 75000, 
    start: '2026-01-01', 
    end: '2026-02-28',
    quota: 100
  },
  reguler: { 
    price: 100000, 
    start: '2026-03-01', 
    end: '2026-04-18',
    quota: 150
  }
};

// Fungsi Ambil Data (Dipakai User & Admin)
export const getTicketConfig = () => {
  const storedData = localStorage.getItem('warTawaTicketConfig');
  if (!storedData) {
    return defaultData; // Balikin default kalau belum pernah diedit
  }
  return JSON.parse(storedData);
};

// Fungsi Simpan Data (Dipakai Admin)
export const saveTicketConfig = (newData) => {
  localStorage.setItem('warTawaTicketConfig', JSON.stringify(newData));
  alert("Data Berhasil Disimpan! Silakan cek halaman User.");
};