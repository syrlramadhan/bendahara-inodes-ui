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
                    id: item.id,
                    tanggal: item.tanggal,
                    keterangan: item.keterangan,
                    kategori: item.kategori,
                    pemasukan: parseInt(item.nominal) || 0,
                    pengeluaran: 0,
                    jenis: 'Pemasukan'
                })),
                ...(pengeluaranData.data || []).map(item => ({
                    id: item.id,
                    tanggal: item.tanggal,
                    keterangan: item.keterangan,
                    kategori: item.kategori,
                    pemasukan: 0,
                    pengeluaran: parseInt(item.nominal) || 0,
                    jenis: 'Pengeluaran',
                    nota: item.nota
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
            // Validasi tanggal
            if (!data.tanggal || isNaN(Date.parse(data.tanggal))) {
                throw new Error('Format tanggal tidak valid');
            }

            // Validasi nominal
            const nominal = typeof data.nominal === 'string' ? 
                parseInt(data.nominal.replace(/\D/g, '')) : 
                parseInt(data.nominal);

            if (isNaN(nominal) || nominal <= 0) {
                throw new Error('Nominal harus berupa angka positif');
            }

            // Validasi maksimal nominal (11 digit - puluhan milyar)
            if (nominal.toString().length > 11) {
                throw new Error('Nominal terlalu besar (maksimal puluhan milyar)');
            }

            // Validasi kategori
            if (!data.kategori || data.kategori.trim() === '') {
                throw new Error('Kategori tidak boleh kosong');
            }

            // Validasi keterangan
            if (!data.keterangan || data.keterangan.trim() === '') {
                throw new Error('Keterangan tidak boleh kosong');
            }

            // Siapkan data dalam format JSON
            const jsonData = {
                tanggal: data.tanggal,
                nominal: nominal,
                kategori: data.kategori.trim(),
                keterangan: data.keterangan.trim()
            };

            console.log('Sending data:', jsonData);

            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            const response = await fetch('/api/pemasukan/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(jsonData)
            });

            // Log response untuk debugging
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            const responseText = await response.text();
            console.log('Response text:', responseText);

            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (error) {
                console.error('Error parsing response:', error);
                throw new Error('Format response tidak valid');
            }

            if (!response.ok) {
                throw new Error(responseData.message || 'Gagal menambah pemasukan');
            }

            return responseData;
        } catch (error) {
            console.error('Error in addPemasukan:', error);
            throw error;
        }
    },

    addPengeluaran: async (data) => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            const formData = new FormData();
            formData.append('tanggal', data.tanggal);
            formData.append('nominal', data.nominal);
            formData.append('keterangan', data.keterangan);
            
            // Pastikan ada file nota yang dipilih
            if (!data.nota) {
                throw new Error('Nota harus diupload');
            }
            formData.append('nota', data.nota);

            const response = await fetch(`/api/pengeluaran/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: formData
            });

            const responseText = await response.text();
            let result;
            
            try {
                result = JSON.parse(responseText);
            } catch (error) {
                console.error('Response text:', responseText);
                throw new Error('Format response tidak valid');
            }

            if (!response.ok) {
                throw new Error(result.message || 'Gagal menambah pengeluaran');
            }

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

    updateLaporan: async (id, data) => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            const formData = new FormData();
            formData.append('tanggal', data.tanggal);
            formData.append('nominal', data.nominal);
            formData.append('keterangan', data.keterangan);

            let endpoint = '';
            if (data.jenis === 'Pemasukan') {
                endpoint = `/api/pemasukan/update/${id}`;
            } else {
                endpoint = `/api/pengeluaran/update/${id}`;
            }

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengupdate data');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error updating data:', error);
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