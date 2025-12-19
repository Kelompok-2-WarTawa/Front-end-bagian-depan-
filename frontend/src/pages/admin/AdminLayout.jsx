// src/pages/admin/AdminLayout.jsx
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('warTawaSession'); // Hapus token asli
        navigate('/admin/login');
    };

    const menus = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { label: 'Manajemen Event', path: '/admin/events', icon: '📅' },
        { label: 'Kategori Tiket', path: '/admin/tickets', icon: '🎫' },
        { label: 'Transaksi', path: '/admin/transactions', icon: '💰' },
        { label: 'Validasi Tiket', path: '/admin/validation', icon: '📷' },
        { label: 'Ekspor Data', path: '/admin/export', icon: '📥' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>

            {/* --- SIDEBAR (KIRI) --- */}
            <div style={styles.sidebar}>
                <div style={styles.logoArea}>
                    <h2 style={{ margin: 0, color: '#F59E0B', fontSize: '24px' }}>
                        WarTawa<span style={{ color: 'white' }}>Admin</span>
                    </h2>
                </div>

                <nav style={{ flex: 1, padding: '20px 0' }}>
                    {menus.map((menu) => {
                        const isActive = location.pathname === menu.path;
                        return (
                            <Link
                                key={menu.path}
                                to={menu.path}
                                style={{
                                    ...styles.menuItem,
                                    backgroundColor: isActive ? '#1F2937' : 'transparent',
                                    borderLeft: isActive ? '4px solid #F59E0B' : '4px solid transparent',
                                    color: isActive ? '#F59E0B' : '#9CA3AF'
                                }}
                            >
                                <span style={{ marginRight: '10px' }}>{menu.icon}</span>
                                {menu.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Tombol Logout */}
                <div style={{ padding: '20px', borderTop: '1px solid #374151' }}>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        🚪 Keluar
                    </button>
                </div>
            </div>

            {/* --- KONTEN UTAMA (KANAN) --- */}
            <div style={styles.mainContent}>
                <Outlet />
            </div>

        </div>
    );
};

const styles = {
    sidebar: {
        width: '260px',
        height: '100vh',
        backgroundColor: '#111827',
        color: 'white',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflowY: 'auto'
    },
    mainContent: {
        marginLeft: '260px',
        flex: 1,
        padding: '40px',
        width: 'calc(100% - 260px)',
        overflowX: 'hidden'
    },
    logoArea: {
        padding: '25px',
        borderBottom: '1px solid #374151',
        textAlign: 'center'
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px 25px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.2s',
        marginBottom: '5px'
    },
    logoutBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#DC2626',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: '0.2s'
    }
};

export default AdminLayout;
