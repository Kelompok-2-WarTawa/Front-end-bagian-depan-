// src/pages/admin/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, initMasterAdmin } from '../../utils/authStore';

const LoginAdmin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    // 1. Buat Akun Admin Default saat halaman dibuka pertama kali
    useEffect(() => {
        initMasterAdmin();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // 2. Gunakan fungsi login KHUSUS ADMIN
        const result = loginAdmin(formData.email, formData.password);

        if (result.success) {
            alert("Selamat datang, Admin!");
            navigate('/admin/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F3F4F6' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>

                <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#111827' }}>Admin Portal</h2>
                <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '30px' }}>Masuk untuk mengelola event</p>

                {error && (
                    <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                            placeholder="admin@wartawa.com"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                            placeholder="••••••"
                        />
                    </div>

                    <button type="submit" style={{ backgroundColor: '#0B1120', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                        Masuk ke Dashboard
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
                    Hint: Gunakan <b>admin@wartawa.com</b> / <b>admin</b>
                </div>

            </div>
        </div>
    );
};

export default LoginAdmin;
