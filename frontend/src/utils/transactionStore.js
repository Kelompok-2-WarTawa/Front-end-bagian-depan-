// src/utils/transactionStore.js

// 1. Ambil semua transaksi
export const getAllTransactions = () => {
  const data = localStorage.getItem('warTawaTransactions');
  return data ? JSON.parse(data) : [];
};

// 2. Simpan transaksi baru (Add)
export const saveTransaction = (transaction) => {
  const currentData = getAllTransactions();
  // Tambahkan transaksi baru ke paling atas (unshift)
  currentData.unshift(transaction);
  localStorage.setItem('warTawaTransactions', JSON.stringify(currentData));
};

// 3. Update Status Transaksi (Edit Status) -> INI YANG PENTING
export const updateTransactionStatus = (invoiceID, newStatus) => {
  const transactions = getAllTransactions();
  
  // Cari index transaksi berdasarkan Invoice ID
  const index = transactions.findIndex(t => t.invoiceID === invoiceID);
  
  if (index !== -1) {
    // Update statusnya (misal: dari 'Lunas' jadi 'Checked-in')
    transactions[index].status = newStatus; 
    
    // Simpan balik ke LocalStorage
    localStorage.setItem('warTawaTransactions', JSON.stringify(transactions));
  }
};