import { getHeaders } from '@/config/api';
import Cookies from 'js-cookie';

export const laporanService = {
    /**
     * Get all financial reports with calculated balances
     * @returns {Promise<Array>} Array of report items
     */
    getAllLaporan: async () => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            const response = await fetch(`/api/laporan/getall`, {
                method: 'GET',
                headers: {
                    ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data laporan');
            }
            
            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getAllLaporan:', error);
            throw error;
        }
    },

    /**
     * Get current balance
     * @returns {Promise<number>} Current balance
     */
    getSaldo: async () => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            const response = await fetch(`/api/laporan/saldo`, {
                method: 'GET',
                headers: {
                    ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil saldo');
            }

            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getSaldo:', error);
            throw error;
        }
    },

    /**
     * Get total income
     * @returns {Promise<number>} Total income
     */
    getTotalPemasukan: async () => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            const response = await fetch(`/api/laporan/pemasukan`, {
                method: 'GET',
                headers: {
                    ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil total pemasukan');
            }

            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getTotalPemasukan:', error);
            throw error;
        }
    },

    /**
     * Get total expenditure
     * @returns {Promise<number>} Total expenditure
     */
    getTotalPengeluaran: async () => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            const response = await fetch(`/api/laporan/pengeluaran`, {
                method: 'GET',
                headers: {
                    ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil total pengeluaran');
            }

            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getTotalPengeluaran:', error);
            throw error;
        }
    },

    /**
     * Get reports by date range
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise<Array>} Array of report items within the date range
     */
    getLaporanByDateRange: async (startDate, endDate) => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            const response = await fetch(
                `/api/laporan/range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`, 
                {
                    method: 'GET',
                    headers: {
                        ...getHeaders(token),
                        'ngrok-skip-browser-warning': 'true'
                    },
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil laporan berdasarkan rentang tanggal');
            }

            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getLaporanByDateRange:', error);
            throw error;
        }
    }
};