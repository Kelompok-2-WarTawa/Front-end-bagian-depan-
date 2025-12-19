// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { apiRequest } from '../utils/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Request ke Backend
            const response = await apiRequest('/users/login', 'POST', {
                email: formData.email,
                password: formData.password
            });

            // 2. Simpan Sesi
            const sessionData = {
                token: response.token,
                ...response.user
            };
            localStorage.setItem('warTawaSession', JSON.stringify(sessionData));

            alert(`Selamat Datang, ${response.user.name}!`);

            // 3. Redirect
            if (response.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }

        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.contentWrap}>
                <div style={styles.logoContainer}>
                    <h1 style={styles.logoText}><span style={{ color: '#F59E0B' }}>War</span>Tawa</h1>
                </div>
                <div style={styles.formContainer}>
                    <div style={styles.tabs}>
                        <Link to="/register" style={styles.tabInactive}>Register</Link>
                        <div style={styles.tabActive}>Login</div>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email <span style={{ color: '#EF4444' }}>*</span></label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} placeholder="email@example.com" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password <span style={{ color: '#EF4444' }}>*</span></label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} placeholder="••••••" />
                        </div>
                        <button type="submit" className="btn btn-gold" style={styles.button} disabled={loading}>
                            {loading ? 'Memproses...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const styles = {
    pageContainer: { backgroundColor: '#0B1120', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    contentWrap: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '60px' },
    logoContainer: { marginBottom: '40px', textAlign: 'center' },
    logoText: { fontSize: '48px', fontWeight: 'bold', color: 'white', margin: 0 },
    formContainer: { width: '100%', maxWidth: '500px', padding: '0 20px' },
    tabs: { display: 'flex', justifyContent: 'center', marginBottom: '30px', borderBottom: '1px solid #374151' },
    tabInactive: { flex: 1, textAlign: 'center', padding: '15px 0', color: '#6B7280', textDecoration: 'none', fontSize: '18px', fontWeight: '500', cursor: 'pointer' },
    tabActive: { flex: 1, textAlign: 'center', padding: '15px 0', color: '#F59E0B', borderBottom: '3px solid #F59E0B', fontSize: '18px', fontWeight: 'bold' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', color: 'white', marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' },
    input: { width: '100%', padding: '12px 15px', borderRadius: '6px', border: 'none', backgroundColor: '#D1D5DB', fontSize: '16px', outline: 'none', boxSizing: 'border-box' },
    button: { width: '100%', padding: '15px', fontSize: '18px', marginTop: '20px', backgroundColor: '#F59E0B', color: 'black', border: 'none', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }
};

export default Login;
