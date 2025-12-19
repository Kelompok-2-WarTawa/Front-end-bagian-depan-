// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { apiRequest } from '../utils/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '', name: '', phoneNumber: '', nik: '', password: '', confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return alert("Password dan Konfirmasi Password tidak sama!");
        }
        setLoading(true);

        try {
            await apiRequest('/users', 'POST', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                nik: formData.nik,
                phone_number: formData.phoneNumber
            });

            alert("Registrasi Berhasil! Silakan Login.");
            navigate('/login');

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
                        <div style={styles.tabActive}>Register</div>
                        <Link to="/login" style={styles.tabInactive}>Login</Link>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Full Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>NIK (16 Digit) *</label>
                            <input type="text" name="nik" value={formData.nik} onChange={handleChange} required maxLength="16" style={styles.input} placeholder="Nomor KTP" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Phone Number *</label>
                            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password *</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Confirm Password *</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={styles.input} />
                        </div>

                        <button type="submit" className="btn btn-gold" style={styles.button} disabled={loading}>
                            {loading ? 'Processing...' : 'Register'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

// Gunakan style yang sama dengan Login
const styles = {
    pageContainer: { backgroundColor: '#0B1120', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    contentWrap: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px', paddingBottom: '40px' },
    logoContainer: { marginBottom: '30px', textAlign: 'center' },
    logoText: { fontSize: '48px', fontWeight: 'bold', color: 'white', margin: 0 },
    formContainer: { width: '100%', maxWidth: '500px', padding: '0 20px' },
    tabs: { display: 'flex', justifyContent: 'center', marginBottom: '30px', borderBottom: '1px solid #374151' },
    tabInactive: { flex: 1, textAlign: 'center', padding: '15px 0', color: '#6B7280', textDecoration: 'none', fontSize: '18px', fontWeight: '500', cursor: 'pointer' },
    tabActive: { flex: 1, textAlign: 'center', padding: '15px 0', color: '#F59E0B', borderBottom: '3px solid #F59E0B', fontSize: '18px', fontWeight: 'bold' },
    inputGroup: { marginBottom: '15px' },
    label: { display: 'block', color: 'white', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' },
    input: { width: '100%', padding: '12px 15px', borderRadius: '6px', border: 'none', backgroundColor: '#D1D5DB', fontSize: '16px', outline: 'none', boxSizing: 'border-box' },
    button: { width: '100%', padding: '15px', fontSize: '18px', marginTop: '20px', backgroundColor: '#F59E0B', color: 'black', border: 'none', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }
};

export default Register;
