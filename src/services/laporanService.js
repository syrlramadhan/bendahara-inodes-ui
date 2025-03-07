import { API_BASE_URL, getHeaders } from '@/config/api';
import Cookies from 'js-cookie';

export const laporanService = {
    getAllLaporan: async () => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            const response = await fetch(`${API_BASE_URL}/pemasukan/getall`, {
                method: 'GET',
                headers: {
                    ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error('Gagal mengambil data pemasukan');
            }
            
            const result = await response.json();
            console.log('API Response:', result); // Debugging
            
            if (result.status === "OK" && Array.isArray(result.data)) {
                return result.data.map(item => ({
                    tanggal: item.tanggal,
                    keterangan: item.keterangan,
                    kategori: item.kategori,
                    pemasukan: item.nominal,
                    pengeluaran: 0,
                    total_saldo: item.nominal // Sementara menggunakan nominal sebagai saldo
                }));
            }
            
            return [];
        } catch (error) {
            console.error('Error fetching pemasukan:', error);
            throw error;
        }
    },

    addLaporan: async (laporanData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/laporan/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(laporanData),
            });
            if (!response.ok) {
                throw new Error('Failed to add laporan');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding laporan:', error);
            throw error;
        }
    },

    updateLaporan: async (id, laporanData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/laporan/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(laporanData),
            });
            if (!response.ok) {
                throw new Error('Failed to update laporan');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating laporan:', error);
            throw error;
        }
    },

    deleteLaporan: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/laporan/delete/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete laporan');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting laporan:', error);
            throw error;
        }
    }
}; 