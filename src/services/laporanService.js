import { API_BASE_URL, getHeaders } from '@/config/api';
import Cookies from 'js-cookie';

export const laporanService = {
    getAllLaporan: async () => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            // Ambil data pemasukan
            const pemasukanResponse = await fetch(`/api/pemasukan/getall`, {
                method: 'GET',
                headers: {
                    ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            // Ambil data pengeluaran
            const pengeluaranResponse = await fetch(`/api/pengeluaran/getall`, {
                method: 'GET',
                headers: {
                    ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });
            
            if (!pemasukanResponse.ok || !pengeluaranResponse.ok) {
                throw new Error('Gagal mengambil data');
            }
            
            const pemasukanData = await pemasukanResponse.json();
            const pengeluaranData = await pengeluaranResponse.json();

            console.log('Pemasukan:', pemasukanData);
            console.log('Pengeluaran:', pengeluaranData);

            // Gabungkan dan urutkan data berdasarkan tanggal
            const combinedData = [
                ...(pemasukanData.data || []).map(item => ({
                    tanggal: item.tanggal,
                    keterangan: item.keterangan,
                    kategori: item.kategori,
                    pemasukan: parseInt(item.nominal) || 0,
                    pengeluaran: 0,
                    jenis: 'Pemasukan'
                })),
                ...(pengeluaranData.data || []).map(item => ({
                    tanggal: item.tanggal,
                    keterangan: item.keterangan,
                    kategori: item.kategori,
                    pemasukan: 0,
                    pengeluaran: parseInt(item.nominal) || 0,
                    jenis: 'Pengeluaran'
                }))
            ].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

            // Hitung saldo berjalan
            let saldo = 0;
            const dataWithSaldo = combinedData.map(item => {
                saldo += (item.pemasukan - item.pengeluaran);
                return {
                    ...item,
                    total_saldo: saldo
                };
            });

            return dataWithSaldo;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    addPemasukan: async (data) => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            const response = await fetch(`/api/pemasukan/add`, {
                method: 'POST',
                headers: {
                    ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menambah pemasukan');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error adding pemasukan:', error);
            throw error;
        }
    },

    addPengeluaran: async (data) => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            const response = await fetch(`/api/pengeluaran/add`, {
                method: 'POST',
                headers: {
                    ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menambah pengeluaran');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error adding pengeluaran:', error);
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