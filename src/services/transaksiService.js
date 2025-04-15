import { getHeaders } from '@/config/api';
import Cookies from 'js-cookie';

export const transaksiService = {
    /**
     * Get all transaction history
     * @returns {Promise<Array>} Array of transaction records
     */
    getAllTransaksi: async () => {
        try {
            // const token = Cookies.get('authToken');
            // if (!token) {
            //     throw new Error('Token tidak ditemukan');
            // }

            const response = await fetch('/api/transaksi/getall', {
                method: 'GET',
                headers: {
                    // ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data transaksi');
            }

            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getAllTransaksi:', error);
            throw error;
        }
    },

    /**
     * Get last transaction
     * @returns {Promise<Object>} Last transaction record
     */
    getLastTransaksi: async () => {
        try {
            // const token = Cookies.get('authToken');
            // if (!token) {
            //     throw new Error('Token tidak ditemukan');
            // }

            const response = await fetch('/api/transaksi/getlast', {
                method: 'GET',
                headers: {
                    // ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil transaksi terakhir');
            }

            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getLastTransaksi:', error);
            throw error;
        }
    }
};