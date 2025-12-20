// src/pages/ETicket.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { apiRequest } from '../utils/api';

const ETicket = () => {
    const location = useLocation();
    const ticketRef = useRef();

    const [currentUser, setCurrentUser] = useState(null);

    // Data dari navigate sebelumnya (Dashboard / Payment)
    const state = location.state || {};
    const [invoiceID] = useState(state.invoiceID || null);

    // State untuk menampung detail tiket
    // Default ambil dari state navigasi
    const [ticketDetails, setTicketDetails] = useState({
        eventData: state.eventData || {},
        userData: state.userData || {},
        ticketData: state.ticketData || { selectedSeats: [] }
    });

    // Cek apakah data kursi sudah ada
    const hasSeats = ticketDetails.ticketData?.selectedSeats && ticketDetails.ticketData.selectedSeats.length > 0;

    // Loading jika Invoice ada TAPI (Event Data kosong ATAU Kursi kosong)
    const [loading, setLoading] = useState(invoiceID && (!ticketDetails.eventData?.nama || !hasSeats));

    useEffect(() => {
        // 1. Cek Session
        const sessionString = localStorage.getItem('warTawaSession');
        if (sessionString) setCurrentUser(JSON.parse(sessionString));

        // 2. Fetch Data Lengkap jika data di state tidak lengkap (khususnya Kursi)
        if (invoiceID && (!ticketDetails.eventData?.nama || !hasSeats)) {
            const fetchBookingDetail = async () => {
                try {
                    // Panggil API Detail Booking untuk dapat Kursi
                    const booking = await apiRequest(`/bookings/${invoiceID}`);

                    setTicketDetails(prev => ({
                        ...prev,
                        // Merge Event Data (Prioritas data API, fallback ke data state lama)
                        eventData: {
                            nama: booking.event_name,
                            // Backend booking detail mungkin tdk kirim tanggal/venue, jadi kita pertahankan yg lama jika ada
                            jadwal: prev.eventData?.jadwal || "Cek Dashboard",
                            lokasi: prev.eventData?.lokasi || "TBA"
                        },
                        // Isi Data Kursi dari API (seat_labels: ["A1", "A2"])
                        ticketData: {
                            selectedSeats: booking.seat_labels
                        },
                        userData: {
                            fullName: prev.userData?.fullName || "User",
                            email: prev.userData?.email || "-"
                        }
                    }));
                } catch (err) {
                    console.error("Gagal ambil detail tiket:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchBookingDetail();
        } else {
            setLoading(false);
        }

    }, [invoiceID, hasSeats]);

    const handleDownloadPDF = async () => {
        const element = ticketRef.current;
        if (!element) return;
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`E-Ticket-${invoiceID}.pdf`);
    };

    if (!invoiceID) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: 'white', background: '#0B1120', minHeight: '100vh' }}>
                <h2>Data Tiket Tidak Ditemukan</h2>
                <Link to="/dashboard" style={{ color: '#F59E0B' }}>Kembali ke Dashboard</Link>
            </div>
        );
    }

    if (loading) return <div style={{ padding: '50px', color: 'white', textAlign: 'center' }}>Sedang Memuat Detail Tiket...</div>;

    // Destructure untuk render
    const { eventData, userData, ticketData } = ticketDetails;

    // Helper Display Kursi
    const getSeatString = () => {
        const seats = ticketData?.selectedSeats;
        if (!seats || seats.length === 0) return "-";

        // Jika format array string ["A1", "A2"] (dari API)
        if (typeof seats[0] === 'string') {
            return seats.join(', ');
        }

        // Jika format array object [{label: "A1"}] (dari flow Checkout)
        if (typeof seats[0] === 'object' && seats[0].label) {
            return seats.map(s => s.label).join(', ');
        }
        return "-";
    };

    return (
        <>
            <Navbar user={{ name: userData?.fullName || "User" }} />
            <div style={{ backgroundColor: '#0B1120', minHeight: '100vh', padding: '40px 20px', color: 'white' }}>

                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h1 style={{ color: '#10B981', margin: 0 }}>E-TICKET</h1>
                        <p style={{ color: '#9CA3AF' }}>Tunjukkan QR Code ini saat masuk.</p>
                    </div>

                    {/* KARTU TIKET */}
                    <div
                        ref={ticketRef}
                        style={{
                            backgroundColor: 'white',
                            color: '#111827',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}
                    >
                        {/* Header Kuning */}
                        <div style={{ backgroundColor: '#F59E0B', padding: '20px', textAlign: 'center', borderBottom: '2px dashed #000' }}>
                            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '1px' }}>TIKET MASUK</h2>
                            <p style={{ margin: '5px 0 0', fontWeight: 'bold', fontSize: '14px' }}>{invoiceID}</p>
                        </div>

                        {/* Isi Tiket */}
                        <div style={{ padding: '30px' }}>

                            <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                                <p style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Event</p>
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0', color: '#111827' }}>
                                    {eventData?.nama || eventData?.title}
                                </h2>
                                <p style={{ color: '#4B5563', margin: 0, fontSize: '14px' }}>WarTawa Live Experience</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                                <div>
                                    <p style={styles.label}>Tanggal</p>
                                    <p style={styles.value}>
                                        {/* Fallback tanggal jika format berbeda */}
                                        {eventData?.jadwal || (eventData?.date ? new Date(eventData.date).toLocaleDateString() : '-')}
                                    </p>
                                </div>
                                <div>
                                    <p style={styles.label}>Waktu</p>
                                    <p style={styles.value}>Open Gate</p>
                                </div>
                                <div>
                                    <p style={styles.label}>Lokasi</p>
                                    <p style={styles.value}>{eventData?.venue || eventData?.lokasi || "TBA"}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div>
                                    <p style={styles.label}>Nama Pengunjung</p>
                                    <p style={{ ...styles.value, fontSize: '16px' }}>{userData?.fullName}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={styles.label}>Kursi</p>
                                    <p style={{ ...styles.value, fontSize: '18px', color: '#F59E0B' }}>{getSeatString()}</p>
                                </div>
                            </div>

                            <div style={{ marginTop: '20px', textAlign: 'center', background: '#F9FAFB', padding: '20px', borderRadius: '12px' }}>
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${invoiceID}`}
                                    alt="QR Code"
                                    style={{ width: '130px', height: '130px', mixBlendMode: 'multiply' }}
                                />
                                <p style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '10px' }}>Scan validasi di pintu masuk</p>
                            </div>

                        </div>
                    </div>

                    <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                        <button onClick={handleDownloadPDF} style={styles.btnPrimary}>⬇ Simpan PDF</button>
                        <Link to="/dashboard" style={styles.btnSecondary}>Kembali</Link>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
};

const styles = {
    label: { fontSize: '12px', color: '#6B7280', marginBottom: '4px', textTransform: 'uppercase' },
    value: { fontSize: '14px', fontWeight: 'bold', color: '#111827', margin: 0 },
    btnPrimary: { flex: 1, padding: '15px', background: '#F59E0B', border: 'none', borderRadius: '8px', color: 'black', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
    btnSecondary: { flex: 1, padding: '15px', background: '#374151', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', textDecoration: 'none', textAlign: 'center' }
};

export default ETicket;
