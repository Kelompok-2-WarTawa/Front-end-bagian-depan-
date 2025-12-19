# 🎫 Event Ticketing System (Frontend)

Aplikasi web modern untuk pemesanan tiket event secara online. Dibangun menggunakan **React.js**, aplikasi ini mensimulasikan alur pembelian tiket yang lengkap mulai dari pemilihan event, pemilihan kursi (seat selection), hingga simulasi pembayaran dan penerbitan E-Ticket.

Aplikasi ini juga dilengkapi dengan **Panel Admin** untuk manajemen event, pengaturan kuota kursi, dan monitoring transaksi.

---

## 🚀 Fitur Unggulan

### 👤 Halaman Pengguna (User)
* **Browsing Event:** Melihat daftar event yang tersedia dengan status tiket (Available/Sold Out).
* **Detail Event Dinamis:** Menampilkan deskripsi, lokasi, dan status kategori tiket (Early Bird, Presale, Reguler) berdasarkan tanggal dan kuota.
* **Booking Flow (4 Steps):**
    1.  **Select Seat:** Memilih kursi secara visual melalui denah interaktif. Jumlah kursi menyesuaikan kapasitas gedung yang diatur Admin.
    2.  **Personal Info:** Pengisian data diri pemesan.
    3.  **Confirmation:** Review pesanan sebelum pembayaran.
    4.  **Checkout:** Pemilihan metode pembayaran (Virtual Account / E-Wallet).
* **Simulasi Pembayaran:** Halaman invoice dengan *countdown timer* dan validasi pembayaran otomatis.
* **E-Ticket:** Halaman tiket digital dengan QR Code setelah pembayaran berhasil.
* **Riwayat Transaksi:** Dashboard user untuk melihat tiket yang telah dibeli.

### 🛡️ Halaman Admin
* **Manajemen Event:** CRUD (Create, Read, Update, Delete) data event, termasuk upload gambar banner.
* **Manajemen Kapasitas:** Mengatur `Total Seats` (Kapasitas Gedung) yang akan digenerate otomatis menjadi peta kursi.
* **Konfigurasi Tiket:** Mengatur harga, kuota per kategori, dan periode tanggal penjualan.
* **Laporan Transaksi:** Melihat daftar pesanan masuk dari user.

---

## 🛠️ Teknologi yang Digunakan

* **Core:** [React.js](https://reactjs.org/) (Vite)
* **Routing:** [React Router DOM](https://reactrouter.com/)
* **State Management:** React Hooks (`useState`, `useEffect`, `useContext`)
* **Data Persistence:** `localStorage` (Simulasi Database tanpa Backend)
* **Styling:** CSS in JS (Inline Styles) & CSS Modules
* **Icons & Assets:** Placehold.co (Dummy Images)

---

## 📂 Struktur Folder

```bash
src/
├── components/       # Komponen UI yang dapat digunakan kembali (Navbar, Footer, Card, dll)
├── pages/            # Halaman utama aplikasi
│   ├── admin/        # Halaman khusus Admin (Dashboard, Manajemen Event, dll)
│   ├── payment/      # Flow pembayaran (Step 1 - Step 4 & Invoice)
│   ├── DetailEvent.jsx
│   ├── UserDashboard.jsx
│   └── ...
├── utils/            # Logic simulasi database (authStore, eventStore, ticketStore, transactionStore)
├── App.jsx           # Konfigurasi Routing utama
└── main.jsx          # Entry point

💻 Cara Menjalankan (Installation)
Pastikan kamu sudah menginstall Node.js di komputermu.
```

## 💻 Cara Menjalankan (Installation)
Pastikan kamu sudah menginstall Node.js di komputermu.

1. Clone repositori ini

```bash
git clone [https://github.com/username-kamu/nama-repo.git](https://github.com/username-kamu/nama-repo.git)
cd nama-repo
```

2. Install dependencies

```bash
npm install
```

3. Jalankan aplikasi (Development Mode)

```bash
npm run dev
```
4. Buka di Browser Akses http://localhost:5173 (atau port lain yang ditampilkan di terminal).

## 🔑 Demo (Simulasi)