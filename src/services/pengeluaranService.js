import { getHeaders } from '@/config/api';
import Cookies from 'js-cookie';

// Fungsi untuk memformat tanggal dari YYYY-MM-DDTHH:mm ke YYYY-MM-DD HH:mm
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

export const pengeluaranService = {
    /**
     * Add new expenditure record
     * @param {Object} data - Expenditure data
     * @returns {Promise<Object>} Response data
     */
    addPengeluaran: async (data) => {
        try {
            // const token = Cookies.get('authToken');
            // if (!token) {
            //     throw new Error('Token tidak ditemukan');
            // }

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

            if (!data.keterangan?.trim()) {
                throw new Error('Keterangan tidak boleh kosong');
            }

            if (!data.nota) {
                throw new Error('Nota harus diupload');
            }

            // Prepare FormData with properly formatted date
            const formData = new FormData();
            formData.append('tanggal', formatDateForBackend(data.tanggal)); // Formatted date
            formData.append('nominal', nominal);
            formData.append('keterangan', data.keterangan.trim());
            formData.append('nota', data.nota); // File object

            const response = await fetch('/api/pengeluaran/add', {
                method: 'POST',
                headers: {
                    // 'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: formData,
                credentials: 'include'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gagal menambah pengeluaran');
            }

            return {
                success: true,
                data: result.data,
                message: 'Pengeluaran berhasil ditambahkan'
            };
        } catch (error) {
            console.error('Error in addPengeluaran:', error);
            throw error;
        }
    },

    /**
     * Update expenditure record
     * @param {string} id - Record ID
     * @param {Object} data - Updated data
     * @returns {Promise<Object>} Response data
     */
    updatePengeluaran: async (id, data) => {
        try {
            // const token = Cookies.get('authToken');
            // if (!token) {
            //     throw new Error('Token tidak ditemukan');
            // }

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

            if (!data.keterangan?.trim()) {
                throw new Error('Keterangan tidak boleh kosong');
            }

            // Prepare FormData with properly formatted date
            const formData = new FormData();
            formData.append('tanggal', formatDateForBackend(data.tanggal)); // Formatted date
            formData.append('nominal', nominal);
            formData.append('keterangan', data.keterangan.trim());

            if (data.nota) {
                formData.append('nota', data.nota);
            }

            const response = await fetch(`/api/pengeluaran/update/${id}`, {
                method: 'PUT',
                headers: {
                    // 'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: formData,
                credentials: 'include'
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Gagal mengupdate pengeluaran');
            }

            return {
                success: true,
                data: responseData.data,
                message: 'Pengeluaran berhasil diupdate'
            };
        } catch (error) {
            console.error('Error in updatePengeluaran:', error);
            throw error;
        }
    },

    /**
     * Delete expenditure record
     * @param {string} id - Record ID
     * @returns {Promise<Object>} Response data
     */
    deletePengeluaran: async (id) => {
        try {
            // const token = Cookies.get('authToken');
            // if (!token) {
            //     throw new Error('Token tidak ditemukan');
            // }

            if (!id) {
                throw new Error('ID tidak valid');
            }

            const response = await fetch(`/api/pengeluaran/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    // ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menghapus pengeluaran');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in deletePengeluaran:', error);
            throw error;
        }
    },

    /**
     * Get all expenditure records
     * @returns {Promise<Array>} Array of expenditure records
     */
    getAllPengeluaran: async (page = 1, pageSize = 10) => {
        try {
            // const token = Cookies.get('authToken');
            // if (!token) {
            //     throw new Error('Token tidak ditemukan');
            // }

            const response = await fetch(`/api/pengeluaran/getall?page=${page}&page_size=${pageSize}`, {
                method: 'GET',
                headers: {
                    // ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data pengeluaran');
            }

            return await response.json(); // Kembalikan seluruh response termasuk metadata pagination
        } catch (error) {
            console.error('Error in getAllPengeluaran:', error);
            throw error;
        }
    },

    /**
     * Get expenditure record by ID
     * @param {string} id - Record ID
     * @returns {Promise<Object>} Expenditure record
     */
    getPengeluaranById: async (id) => {
        try {
            // const token = Cookies.get('authToken');
            // if (!token) {
            //     throw new Error('Token tidak ditemukan');
            // }

            if (!id) {
                throw new Error('ID tidak valid');
            }

            const response = await fetch(`/api/pengeluaran/get/${id}`, {
                method: 'GET',
                headers: {
                    // ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data pengeluaran');
            }

            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getPengeluaranById:', error);
            throw error;
        }
    }
};