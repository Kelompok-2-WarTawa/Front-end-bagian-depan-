// File: src/pages/admin/Login.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'; 

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // --- LOGIKA LOGIN ADMIN  ---
    navigate('/admin');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#2c3e50'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '8px', 
        width: '300px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: 'black' }}>Admin Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Username Admin" style={{ padding: '10px' }} />
          <input type="password" placeholder="Password" style={{ padding: '10px' }} />
          <button type="submit" style={{ 
            padding: '10px', 
            background: '#e74c3c', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer' 
          }}>
            Masuk
          </button>
        </form>
        <p style={{ marginTop: '10px', fontSize: '12px' }}>
          <a href="/admin" style={{ color: '#666' }}>← Kembali ke Beranda</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;