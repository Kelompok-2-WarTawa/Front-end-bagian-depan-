// frontend/src/utils/authStore.js

// 1. Ambil semua user yang terdaftar
export const getRegisteredUsers = () => {
  const users = localStorage.getItem('warTawaUsers');
  return users ? JSON.parse(users) : [];
};

// 2. Registrasi User Baru
export const registerUser = (userData) => {
  const users = getRegisteredUsers();
  
  // Cek apakah email sudah terdaftar
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    return { success: false, message: 'Email sudah terdaftar!' };
  }

  // Simpan user baru
  users.push(userData);
  localStorage.setItem('warTawaUsers', JSON.stringify(users));
  return { success: true, message: 'Registrasi Berhasil!' };
};

// 3. Login User
export const loginUser = (email, password) => {
  const users = getRegisteredUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Simpan sesi user yang sedang aktif (tanpa password agar aman)
    const sessionData = { ...user };
    delete sessionData.password; 
    localStorage.setItem('warTawaCurrentUser', JSON.stringify(sessionData));
    return { success: true, data: sessionData };
  }

  return { success: false, message: 'Email atau Password salah!' };
};

// 4. Ambil User yang Sedang Login (Session)
export const getCurrentUser = () => {
  const user = localStorage.getItem('warTawaCurrentUser');
  return user ? JSON.parse(user) : null;
};

// 5. Logout
export const logoutUser = () => {
  localStorage.removeItem('warTawaCurrentUser');
};

// 6. Update Data User (Nama & Telepon)
export const updateUser = (updatedData) => {
  const users = getRegisteredUsers();
  
  // Update di database utama
  const updatedUsersList = users.map(user => 
    user.email === updatedData.email ? { ...user, ...updatedData } : user
  );
  localStorage.setItem('warTawaUsers', JSON.stringify(updatedUsersList));

  // Update sesi aktif
  localStorage.setItem('warTawaCurrentUser', JSON.stringify(updatedData));
  
  return true;
};

// 7. Ganti Password 
export const changePassword = (email, oldPassword, newPassword) => {
  const users = getRegisteredUsers();
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex !== -1) {
    // Cek apakah password lama benar
    if (users[userIndex].password === oldPassword) {
      // Ganti dengan password baru
      users[userIndex].password = newPassword;
      
      // Simpan perubahan ke LocalStorage
      localStorage.setItem('warTawaUsers', JSON.stringify(users));
      return { success: true, message: 'Password berhasil diubah!' };
    } else {
      return { success: false, message: 'Password lama salah!' };
    }
  }
  return { success: false, message: 'User tidak ditemukan!' };
};