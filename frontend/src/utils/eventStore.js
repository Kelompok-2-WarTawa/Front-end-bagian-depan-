// frontend/src/utils/eventStore.js

// Data awal (Dummy data dipindahkan ke sini sebagai default)
const defaultEvents = [
  {
    id: 1,
    nama: 'Stand Up Comedy Spesial Akhir Tahun',
    talent: 'Raditya Dika',
    jadwal: '2025-12-13',
    jam: '19:00',
    lokasi: 'Balai Sarbini',
    kota: 'Jakarta Selatan',
    status: 'Published'
  },
  {
    id: 2,
    nama: 'Open Mic Night - Bandung',
    talent: 'Pandji Pragiwaksono',
    jadwal: '2025-12-14',
    jam: '20:00',
    lokasi: 'The Hall Senayan',
    kota: 'Bandung',
    status: 'Published'
  },
  {
    id: 3,
    nama: 'Comedy Kings Tour Surabaya',
    talent: 'Ernest Prakasa',
    jadwal: '2025-12-19',
    jam: '20:00',
    lokasi: 'Grand City',
    kota: 'Surabaya',
    status: 'Published'
  }
];

// Ambil Data Event
export const getEvents = () => {
  const storedEvents = localStorage.getItem('warTawaEvents');
  if (!storedEvents) {
    return defaultEvents;
  }
  return JSON.parse(storedEvents);
};

// Simpan Data Event Baru/Update
export const saveEvents = (events) => {
  localStorage.setItem('warTawaEvents', JSON.stringify(events));
};