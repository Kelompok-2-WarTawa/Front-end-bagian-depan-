import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../utils/api'; // Gunakan API, bukan authStore

const LoginAdmin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Tembak API Login
            const response = await apiRequest('/users/login', 'POST', {
                email: formData.email,
                password: formData.password
            });

            // 2. Cek Role (Backend mengirim user.role)
            // Pastikan backend mengirim string "admin" (huruf kecil/besar disesuaikan)
            if (response.user.role.toLowerCase() !== 'admin') {
                throw new Error("Akses Ditolak: Akun ini bukan Admin.");
            }

            // 3. Simpan Sesi
            const sessionData = {
                token: response.token,
                ...response.user
            };
            localStorage.setItem('warTawaSession', JSON.stringify(sessionData));

            alert("Selamat datang, Admin!");
            navigate('/admin/dashboard');

        } catch (err) {
            setError(err.message || "Login gagal.");
        } finally {
            setLoading(false);
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

                    <button type="submit" disabled={loading} style={{ backgroundColor: '#0B1120', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                        {loading ? 'Memuat...' : 'Masuk ke Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginAdmin;
