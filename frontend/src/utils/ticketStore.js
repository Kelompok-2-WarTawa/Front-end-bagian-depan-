// src/utils/ticketStore.js

// 1. Data Default 
// Ini akan dipakai jika sebuah event belum pernah diatur harganya
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

// 2. Fungsi Ambil Data Berdasarkan ID Event
export const getTicketConfigByEvent = (eventId) => {
  // Ambil object besar yang menampung semua config event
  const allConfigs = JSON.parse(localStorage.getItem('warTawaTicketConfigs') || '{}');
  
  // Jika event ini belum punya settingan, kembalikan defaultData
  return allConfigs[eventId] || defaultData;
};

// 3. Fungsi Simpan Data Spesifik untuk Event Tertentu
export const saveTicketConfig = (eventId, newData) => {
  // Ambil data lama dulu
  const allConfigs = JSON.parse(localStorage.getItem('warTawaTicketConfigs') || '{}');
  
  // Simpan/Update config hanya untuk event ID tersebut
  allConfigs[eventId] = newData;
  
  // Masukkan kembali ke LocalStorage
  localStorage.setItem('warTawaTicketConfigs', JSON.stringify(allConfigs));
};