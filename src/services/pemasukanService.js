import { getHeaders } from '@/config/api';
import Cookies from 'js-cookie';

// Fungsi untuk memformat tanggal dari datetime-local ke format backend
const formatDateForBackend = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error('Format tanggal tidak valid');
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const pemasukanService = {
    /**
     * Add new income record
     * @param {Object} data - Income data
     * @returns {Promise<Object>} Response data
     */
    async addPemasukan(data) {
        try {
            // const token = Cookies.get('authToken');
            // if (!token) throw new Error('Token tidak ditemukan');

            // Prepare payload with properly formatted date
            const payload = {
                tanggal: formatDateForBackend(data.tanggal), // Formatted for backend
                nominal: Number(data.nominal.toString().replace(/\D/g, '')),
                kategori: data.kategori.trim(),
                keterangan: data.keterangan.trim()
            };

            const response = await fetch('/api/pemasukan/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gagal menambah pemasukan');
            }

            return {
                success: true,
                data: result.data,
                message: 'Pemasukan berhasil ditambahkan'
            };
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
    async updatePemasukan(id, data) {
        try {
            // const token = Cookies.get('authToken');
            // if (!token) throw new Error('Token tidak ditemukan');

            const payload = {
                tanggal: formatDateForBackend(data.tanggal), // Gunakan format yang sama dengan addPemasukan
                nominal: Number(data.nominal.toString().replace(/\D/g, '')),
                kategori: data.kategori.trim(),
                keterangan: data.keterangan.trim()
            };

            const response = await fetch(`/api/pemasukan/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gagal mengupdate pemasukan');
            }

            return {
                success: true,
                data: result.data,
                message: result.message || 'Pemasukan berhasil diupdate'
            };
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
            // const token = Cookies.get('authToken');
            // if (!token) {
            //     throw new Error('Token tidak ditemukan');
            // }

            if (!id) {
                throw new Error('ID tidak valid');
            }

            const response = await fetch(`/api/pemasukan/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    // ...getHeaders(token),
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
    getAllPemasukan: async (page, pageSize) => {
        try {
            // const token = Cookies.get('authToken');
            // if (!token) {
            //     throw new Error('Token tidak ditemukan');
            // }

            const response = await fetch(`/api/pemasukan/getall?page=${page}&page_size=${pageSize}`, {
                method: 'GET',
                headers: {
                    // ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data pemasukan');
            }

            return await response.json(); // Kembalikan seluruh response termasuk metadata pagination
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
            // const token = Cookies.get('authToken');
            // if (!token) {
            //     throw new Error('Token tidak ditemukan');
            // }

            if (!id) {
                throw new Error('ID tidak valid');
            }

            const response = await fetch(`/api/pemasukan/get/${id}`, {
                method: 'GET',
                headers: {
                    // ...getHeaders(token),
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