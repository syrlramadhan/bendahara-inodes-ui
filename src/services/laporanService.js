import { API_BASE_URL } from '@/config/api';

export const laporanService = {
    getAllLaporan: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/laporan/getall`);
            if (!response.ok) {
                throw new Error('Failed to fetch laporan');
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching laporan:', error);
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