// src/utils/eventStore.js

// 1. Data Awal (Default)
const defaultEvents = [
  {
    id: 1,
    nama: 'Stand Up Comedy Spesial Akhir Tahun',
    talent: 'Raditya Dika',
    jadwal: '2025-12-13',
    jam: '19:00',
    lokasi: 'Balai Sarbini',
    kota: 'Jakarta Selatan',
    price: 150000,
    status: 'Published',
    image: 'https://placehold.co/400x300/1a1a1a/F59E0B?text=Comedy+Special'
  },
  {
    id: 2,
    nama: 'Open Mic Night - Bandung',
    talent: 'Pandji Pragiwaksono',
    jadwal: '2025-12-14',
    jam: '20:00',
    lokasi: 'The Hall Senayan',
    kota: 'Bandung',
    price: 75000,
    status: 'Published',
    image: 'https://placehold.co/400x300/1a1a1a/F59E0B?text=Open+Mic'
  },
  {
    id: 3,
    nama: 'Comedy Kings Tour Surabaya',
    talent: 'Ernest Prakasa',
    jadwal: '2025-12-19',
    jam: '20:00',
    lokasi: 'Grand City',
    kota: 'Surabaya',
    price: 125000,
    status: 'Published',
    image: 'https://placehold.co/400x300/1a1a1a/F59E0B?text=Comedy+Kings'
  }
];

// 2. Ambil Data Event
export const getEvents = () => {
  const storedEvents = localStorage.getItem('warTawaEvents');
  if (!storedEvents) {
    // Jika localStorage kosong, simpan data default lalu kembalikan
    localStorage.setItem('warTawaEvents', JSON.stringify(defaultEvents));
    return defaultEvents;
  }
  return JSON.parse(storedEvents);
};

// 3. Simpan Data Event (Timpa Semua)
export const saveEvents = (events) => {
  localStorage.setItem('warTawaEvents', JSON.stringify(events));
};

// --- FUNGSI TAMBAHAN (CRUD) UNTUK ADMIN ---

// Tambah Event Baru
export const addEvent = (newEvent) => {
  const events = getEvents();
  // Generate ID baru (ambil ID terakhir + 1)
  const newId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
  
  const eventToSave = { ...newEvent, id: newId };
  const updatedEvents = [...events, eventToSave];
  
  saveEvents(updatedEvents);
  return eventToSave;
};

// Update Event yang Ada
export const updateEvent = (updatedEvent) => {
  const events = getEvents();
  const newEvents = events.map(ev => 
    ev.id === updatedEvent.id ? updatedEvent : ev
  );
  saveEvents(newEvents);
};

// Hapus Event
export const deleteEvent = (id) => {
  const events = getEvents();
  const filteredEvents = events.filter(ev => ev.id !== id);
  saveEvents(filteredEvents);
};