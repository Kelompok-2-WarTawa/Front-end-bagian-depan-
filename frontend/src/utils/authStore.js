const USERS_KEY = 'warTawaUsers';
const SESSION_KEY = 'warTawaCurrentUser';

// 1. Ambil semua user yang terdaftar
export const getRegisteredUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};
// Alias (biar kode yang pake 'getUsers' tetep jalan)
export const getUsers = getRegisteredUsers; 

// 2. Registrasi User Baru (MODIFIKASI: Tambah Role 'user')
export const registerUser = (userData) => {
  const users = getRegisteredUsers();
  
  // Cek apakah email sudah terdaftar
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    return { success: false, message: 'Email sudah terdaftar!' };
  }

  // Simpan user baru dengan ROLE default 'user'
  const newUser = { 
    ...userData, 
    role: 'user' // <--- Penanda user biasa
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true, message: 'Registrasi Berhasil!' };
};

// 3. Login User Biasa (Umum)
export const loginUser = (email, password) => {
  const users = getRegisteredUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Simpan sesi
    const sessionData = { ...user };
    delete sessionData.password; 
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    return { success: true, data: sessionData };
  }

  return { success: false, message: 'Email atau Password salah!' };
};

// --- FITUR BARU: KHUSUS ADMIN ---

// 4. Login KHUSUS ADMIN (Baru)
export const loginAdmin = (email, password) => {
    const users = getRegisteredUsers();
    
    // Cek User + Password + Role harus 'admin'
    const adminUser = users.find(u => 
        u.email === email && 
        u.password === password && 
        u.role === 'admin' // <--- Penjaga Gerbang
    );
    
    if (adminUser) {
      const sessionData = { ...adminUser };
      delete sessionData.password;
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      return { success: true, data: sessionData };
    }
    
    return { success: false, message: 'Akses Ditolak! Anda bukan Admin.' };
};

// 5. Inisialisasi Master Admin Otomatis (Baru)
export const initMasterAdmin = () => {
    const users = getRegisteredUsers();
    const adminExists = users.find(u => u.role === 'admin');

    if (!adminExists) {
        const masterAdmin = {
            fullName: 'Master Admin',
            email: 'admin@wartawa.com',
            password: 'admin',
            phoneNumber: '081234567890',
            role: 'admin' // <--- Role Spesial
        };
        users.push(masterAdmin);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        console.log("Master Admin Created: admin@wartawa.com");
    }
};



// 6. Ambil User yang Sedang Login
export const getCurrentUser = () => {
  const user = localStorage.getItem(SESSION_KEY);
  return user ? JSON.parse(user) : null;
};

// 7. Logout
export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};
// Alias logout
export const logout = logoutUser;

// 8. Update Data User
export const updateUser = (updatedData) => {
  const users = getRegisteredUsers();
  
  const updatedUsersList = users.map(user => 
    user.email === updatedData.email ? { ...user, ...updatedData } : user
  );
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsersList));
  localStorage.setItem(SESSION_KEY, JSON.stringify(updatedData));
  
  return true;
};

// 9. Ganti Password
export const changePassword = (email, oldPassword, newPassword) => {
  const users = getRegisteredUsers();
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex !== -1) {
    if (users[userIndex].password === oldPassword) {
      users[userIndex].password = newPassword;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return { success: true, message: 'Password berhasil diubah!' };
    } else {
      return { success: false, message: 'Password lama salah!' };
    }
  }
  return { success: false, message: 'User tidak ditemukan!' };
};