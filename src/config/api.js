export const API_BASE_URL = 'https://6fba-140-213-217-131.ngrok-free.app/api';
export const UPLOAD_URL = 'https://6fba-140-213-217-131.ngrok-free.app/api/uploads/';

export const API_ENDPOINTS = {
    // Admin endpoints
    ADMIN: `${API_BASE_URL}/admin`,
    ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
    ADMIN_REGISTER: `${API_BASE_URL}/admin/daftar`,
    ADMIN_BY_NIK: (nik) => `${API_BASE_URL}/admin/${nik}`,
    
    // Pemasukan endpoints
    PEMASUKAN_ADD: `${API_BASE_URL}/pemasukan/add`,
    PEMASUKAN_UPDATE: (id) => `${API_BASE_URL}/pemasukan/update/${id}`,
    PEMASUKAN_GET_ALL: `${API_BASE_URL}/pemasukan/getall`,
    PEMASUKAN_GET_BY_ID: (id) => `${API_BASE_URL}/pemasukan/get/${id}`,
    PEMASUKAN_DELETE: (id) => `${API_BASE_URL}/pemasukan/delete/${id}`,
    
    // Pengeluaran endpoints
    PENGELUARAN_ADD: `${API_BASE_URL}/pengeluaran/add`,
    PENGELUARAN_UPDATE: (id) => `${API_BASE_URL}/pengeluaran/update/${id}`,
    PENGELUARAN_GET_ALL: `${API_BASE_URL}/pengeluaran/getall`,
    PENGELUARAN_GET_BY_ID: (id) => `${API_BASE_URL}/pengeluaran/get/${id}`,
    PENGELUARAN_DELETE: (id) => `${API_BASE_URL}/pengeluaran/delete/${id}`,
    
    // Transaksi endpoints
    TRANSAKSI_GET_ALL: `${API_BASE_URL}/transaksi/getall`,
    TRANSAKSI_GET_LAST: `${API_BASE_URL}/transaksi/getlast`,
    
    // Laporan endpoints
    LAPORAN_GET_ALL: `${API_BASE_URL}/laporan/getall`,
    LAPORAN_GET_SALDO: `${API_BASE_URL}/laporan/saldo`,
    LAPORAN_GET_PENGELUARAN: `${API_BASE_URL}/laporan/pengeluaran`,
    LAPORAN_GET_PEMASUKAN: `${API_BASE_URL}/laporan/pemasukan`,
};

export const getHeaders = (token = null) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}; 