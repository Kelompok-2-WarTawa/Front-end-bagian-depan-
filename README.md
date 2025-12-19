# Frontend - Tugas UAS Kelompok 2 WarTawa

Repositori ini berisi kode sumber frontend untuk sistem ticketing wisata "WarTawa". Frontend ini dibangun menggunakan framework **React.js**, **Vite**, **Zustand**, dan **Tailwind CSS**.

---

## 1. Tim dan Anggota

**Kelompok 2 - WarTawa**

* **Daffa Hakim Matondang** - **123140002** (Database Administrator & Schema)
* **Arrauf Setiawan Muhammad Jabar** - **123140032** (Project Leader)
* **Varasina Farmadani** - **123140107** (Backend Developer & Logic)
* **Fadzilah saputri** - **123140149** (UI/UX Designer)
* **Fadina Mustika Ratnaningsih** - **123140157** (Frontend Developer)

---

## 2. Deskripsi Project dan Fitur Utama

WarTawa adalah platform manajemen tiket acara stand-up comedy. Bagian Frontend ini menyediakan antarmuka pengguna yang responsif untuk proses pembelian tiket yang cepat serta dashboard manajemen yang komprehensif bagi admin.

**Fitur Utama:**

### A. Autentikasi & Manajemen Pengguna

* **Login & Register:** Sistem masuk dan daftar akun untuk Customer.
* **Role Based Interface:** Perbedaan tampilan antarmuka secara otomatis antara `ADMIN` dan `USER`.
* **State Persistence:** Menggunakan **Zustand** untuk menjaga sesi login pengguna tetap aktif.

### B. Event & Tiket Discovery

* **Browse Events:** Menampilkan daftar event yang tersedia secara dinamis.
* **Detail Event:** Informasi lengkap mengenai deskripsi, lokasi, dan harga tiket.
* **Ticket Phases:** Mendukung pengaturan harga berbeda berdasarkan fase (misal: Early Bird, Presale, Normal).

### C. Sistem Transaksi (Checkout Flow)

* **Multi-step Booking:** Proses pemesanan terstruktur mulai dari pemilihan tiket, pengisian data, hingga metode pembayaran.
* **Payment Confirmation:** Antarmuka untuk mengonfirmasi pembayaran dan unggah bukti transaksi.
* **E-Ticket Generation:** Tampilan tiket digital yang dapat diakses melalui dashboard user setelah transaksi divalidasi.

### D. Admin Management Dashboard

* **Event Management:** CRUD (Create, Read, Update, Delete) data event wisata.
* **Transaction Monitoring:** Dashboard untuk melihat statistik penjualan dan daftar transaksi masuk.
* **Ticket Validation:** Fitur scan/verifikasi tiket untuk memvalidasi pengunjung.
* **Ekspor Data:** Fitur untuk mengunduh laporan transaksi dalam format tertentu.

---

## 3. Tech Stack

* **Core Framework:** React.js (Vite)
* **State Management:** React Hooks (`useState`, `useEffect`, `useContext`)
* **Styling:** CSS in JS (Inline Styles) & CSS Modules
* **Routing:** React Router DOM
* **Icons & Assets:** Placehold.co (Dummy Images)
* **HTTP Client:** Fetch API (Terintegrasi dengan Backend API)

---

## 4. Cara Instalasi dan Menjalankan (Local Development)

### Prasyarat

* Node.js (Versi 18 ke atas)
* npm atau yarn

### Langkah-langkah

1. **Clone Repositori:**
```bash
git clone <repository-url>
cd front-end-bagian-depan-/frontend

```


2. **Instalasi Dependensi:**
Gunakan npm untuk mengunduh semua library yang diperlukan.
```bash
npm install

```


3. **Konfigurasi Environment:**
Buat file `.env` di folder root frontend dan sesuaikan dengan URL backend Anda:
```env
VITE_API_URL=http://localhost:6543/api

```


4. **Jalankan Mode Pengembangan:**
```bash
npm run dev

```


**Aplikasi akan berjalan di `http://localhost:5173`.**
5. **Build untuk Produksi:**
```bash
npm run build

```



---

## 5. Link Deployment

* **Frontend:** 
* **Backend API:** 

---

## 6. Dokumentasi Komponen

### Public Pages

| Page | Route | Deskripsi |
| --- | --- | --- |
| Home | `/` | Halaman utama menampilkan daftar event. |
| Login | `/login` | Halaman masuk aplikasi. |
| Register | `/register` | Halaman pendaftaran akun baru. |
| Detail | `/event/:id` | Informasi mendalam mengenai event tertentu. |

### User Dashboard

| Page | Route | Deskripsi |
| --- | --- | --- |
| Profile | `/profile` | Pengaturan profil dan data diri. |
| My Tickets | `/dashboard` | Daftar tiket yang telah dibeli. |
| Checkout | `/checkout` | Proses pemesanan dan pembayaran. |
| E-Ticket | `/e-ticket/:id` | Tampilan tiket digital untuk check-in. |

### Admin Panel

| Page | Route | Deskripsi |
| --- | --- | --- |
| Admin Dashboard | `/admin/dashboard` | Statistik utama dan ringkasan data. |
| Manage Event | `/admin/events` | Pengelolaan event. |
| Transactions | `/admin/transactions` | Daftar riwayat pembayaran user. |
| Validation | `/admin/validation` | Verifikasi tiket ketika event berlangsung. |

---

## 7. Screenshot Aplikasi



---

## 8. Link Video Presentasi
