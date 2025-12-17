import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Daftar menu
  const menuItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Manajemen Event', path: '/admin/events' },
    { name: 'Kategori Tiket', path: '/admin/tickets' },
    { name: 'Transaksi', path: '/admin/transactions' },
    { name: 'Validasi Tiket', path: '/admin/validation' },
    { name: 'Ekspor Data', path: '/admin/export' },
  ];

  // Fungsi Logout yang terintegrasi dengan AdminLogin.jsx
  const handleLogout = () => {
    
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: '#F8F9FA' }}>
      
      {/* --- SIDEBAR --- */}
      <aside style={{ 
        width: '260px', 
        background: '#0B1120',
        color: '#fff', 
        padding: '30px 0', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'fixed', 
        height: '100vh'
      }}>
        {/* Logo Branding */}
        <div style={{ padding: '0 25px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px' }}>WarTawa</h2>
        </div>
        
        {/* Navigasi Menu */}
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} style={{ marginBottom: '8px', padding: '0 15px' }}>
                  <Link to={item.path} style={{ 
                    display: 'block',
                    padding: '12px 20px',
                    color: isActive ? '#fff' : '#94A3B8',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    background: isActive ? '#F39C12' : 'transparent',
                    fontWeight: isActive ? '600' : 'normal',
                    transition: 'all 0.3s ease'
                  }}>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Sidebar (Settings & Logout) */}
        <div style={{ padding: '0 25px', borderTop: '1px solid #1E293B', paddingTop: '20px' }}>
          <button 
            onClick={() => navigate('/admin/settings')} 
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#94A3B8', padding: '10px 0', cursor: 'pointer', fontSize: '14px' }}
          >
            Pengaturan
          </button>
          <button 
            onClick={handleLogout} 
            style={{ 
              width: '100%', 
              textAlign: 'left', 
              background: 'none', 
              border: 'none', 
              color: '#EF4444', 
              padding: '10px 0', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main style={{ 
        flex: 1, 
        marginLeft: '260px', 
        padding: '40px' 
      }}>
        
        {/* Global Header */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '40px',
          background: 'transparent'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#111827', fontWeight: 'bold' }}>Dashboard</h1>
            <p style={{ margin: '5px 0 0', color: '#6B7280' }}>Selamat Datang kembali, Admin</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <div style={{ position: 'relative', cursor: 'pointer', fontSize: '20px' }}>
              🔔
              <span style={{ position: 'absolute', top: -2, right: -2, background: '#EF4444', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #F8F9FA' }}></span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid #E5E7EB', paddingLeft: '25px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: '#111827' }}>Admin User</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>adminacc@wartawa.com</p>
              </div>
              <div style={{ 
                width: '45px', 
                height: '45px', 
                borderRadius: '50%', 
                background: '#F39C12',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                A
              </div>
            </div>
          </div>
        </header>

        {/* Konten halaman yang berubah-ubah (Dashboard, Manajemen Event, dll) */}
        <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;