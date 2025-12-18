// src/utils/authStore.js

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
    // Simpan sesi user yang sedang aktif (tanpa password)
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