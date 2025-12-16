import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Register = () => {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrap}>
        
        {/* LOGO */}
        <div style={styles.logoContainer}>
          <h1 style={styles.logoText}>
            <span style={{color: '#F59E0B'}}>War</span>Tawa
          </h1>
        </div>

        <div style={styles.formContainer}>
          
          {/* TABS */}
          <div style={styles.tabs}>
            <div style={styles.tabActive}>Register</div>
            <Link to="/login" style={styles.tabInactive}>Login</Link>
          </div>

          {/* FORM */}
          <form>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email <span style={{color: '#EF4444'}}>*</span></label>
              <input type="email" style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name <span style={{color: '#EF4444'}}>*</span></label>
              <input type="text" style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number <span style={{color: '#EF4444'}}>*</span></label>
              <input type="tel" style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password <span style={{color: '#EF4444'}}>*</span></label>
              <input type="password" style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password <span style={{color: '#EF4444'}}>*</span></label>
              <input type="password" style={styles.input} />
            </div>

            <button type="button" className="btn btn-gold" style={styles.button}>
              Register
            </button>

            <p style={{color: 'white', textAlign: 'center', fontSize: '14px', marginTop: '20px'}}>
              Dengan membuat atau mendaftar akun, Anda menyetujui isi Persyaratan dan Ketentuan & Kebijakan Privasi kami.
            </p>
          </form>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Gunakan styles yang sama persis dengan Login.jsx agar konsisten
const styles = {
  pageContainer: {
    backgroundColor: '#0B1120',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  contentWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '60px',
    paddingBottom: '60px'
  },
  logoContainer: {
    marginBottom: '40px',
    textAlign: 'center'
  },
  logoText: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0
  },
  formContainer: {
    width: '100%',
    maxWidth: '500px',
    padding: '0 20px'
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
    borderBottom: '1px solid #374151'
  },
  tabActive: {
    flex: 1,
    textAlign: 'center',
    padding: '15px 0',
    color: '#F59E0B',
    borderBottom: '3px solid #F59E0B',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  tabInactive: {
    flex: 1,
    textAlign: 'center',
    padding: '15px 0',
    color: '#6B7280',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    color: 'white',
    marginBottom: '8px',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#D1D5DB', 
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '15px',
    fontSize: '18px',
    marginTop: '20px'
  }
};

export default Register;