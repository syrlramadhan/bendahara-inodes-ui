import { getHeaders } from '@/config/api';
import Cookies from 'js-cookie';

export const pemasukanService = {
    /**
     * Add new income record
     * @param {Object} data - Income data
     * @returns {Promise<Object>} Response data
     */
    addPemasukan: async (data) => {
        try {
            // Validation
            if (!data.tanggal || isNaN(Date.parse(data.tanggal))) {
                throw new Error('Format tanggal tidak valid');
            }

            const nominal = typeof data.nominal === 'string' 
                ? parseInt(data.nominal.replace(/\D/g, '')) 
                : parseInt(data.nominal);

            if (isNaN(nominal) || nominal <= 0) {
                throw new Error('Nominal harus berupa angka positif');
            }

            if (nominal.toString().length > 11) {
                throw new Error('Nominal terlalu besar (maksimal puluhan milyar)');
            }

            if (!data.kategori?.trim()) {
                throw new Error('Kategori tidak boleh kosong');
            }

            if (!data.keterangan?.trim()) {
                throw new Error('Keterangan tidak boleh kosong');
            }

            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            const response = await fetch('/api/pemasukan/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    tanggal: data.tanggal,
                    nominal: nominal,
                    kategori: data.kategori.trim(),
                    keterangan: data.keterangan.trim()
                }),
                credentials: 'include'
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Gagal menambah pemasukan');
            }

            return responseData;
        } catch (error) {
            console.error('Error in addPemasukan:', error);
            throw error;
        }
    },

    /**
     * Update income record
     * @param {string} id - Record ID
     * @param {Object} data - Updated data
     * @returns {Promise<Object>} Response data
     */
    updatePemasukan: async (id, data) => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            if (!id) {
                throw new Error('ID tidak valid');
            }

            // Validation
            if (!data.tanggal || isNaN(Date.parse(data.tanggal))) {
                throw new Error('Format tanggal tidak valid');
            }

            const nominal = typeof data.nominal === 'string' 
                ? parseInt(data.nominal.replace(/\D/g, '')) 
                : parseInt(data.nominal);

            if (isNaN(nominal) || nominal <= 0) {
                throw new Error('Nominal harus berupa angka positif');
            }

            if (!data.kategori?.trim()) {
                throw new Error('Kategori tidak boleh kosong');
            }

            if (!data.keterangan?.trim()) {
                throw new Error('Keterangan tidak boleh kosong');
            }

            const response = await fetch(`/api/pemasukan/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    tanggal: data.tanggal,
                    nominal: nominal,
                    kategori: data.kategori.trim(),
                    keterangan: data.keterangan.trim()
                }),
                credentials: 'include'
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Gagal mengupdate pemasukan');
            }

            return responseData;
        } catch (error) {
            console.error('Error in updatePemasukan:', error);
            throw error;
        }
    },

    /**
     * Delete income record
     * @param {string} id - Record ID
     * @returns {Promise<Object>} Response data
     */
    deletePemasukan: async (id) => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            if (!id) {
                throw new Error('ID tidak valid');
            }

            const response = await fetch(`/api/pemasukan/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menghapus pemasukan');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in deletePemasukan:', error);
            throw error;
        }
    },

    /**
     * Get all income records
     * @returns {Promise<Array>} Array of income records
     */
    getAllPemasukan: async () => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            const response = await fetch('/api/pemasukan/getall', {
                method: 'GET',
                headers: {
                    ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data pemasukan');
            }

            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getAllPemasukan:', error);
            throw error;
        }
    },

    /**
     * Get income record by ID
     * @param {string} id - Record ID
     * @returns {Promise<Object>} Income record
     */
    getPemasukanById: async (id) => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            if (!id) {
                throw new Error('ID tidak valid');
            }

            const response = await fetch(`/api/pemasukan/get/${id}`, {
                method: 'GET',
                headers: {
                    ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data pemasukan');
            }

            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getPemasukanById:', error);
            throw error;
        }
    }
};