// src/utils/transactionStore.js

// Ambil semua transaksi
export const getAllTransactions = () => {
  const data = localStorage.getItem('warTawaTransactions');
  return data ? JSON.parse(data) : [];
};

// Simpan transaksi baru
export const saveTransaction = (transaction) => {
  const currentData = getAllTransactions();
  // Tambahkan transaksi baru ke paling atas (unshift)
  currentData.unshift(transaction);
  localStorage.setItem('warTawaTransactions', JSON.stringify(currentData));
};