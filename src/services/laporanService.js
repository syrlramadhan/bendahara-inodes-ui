import { getHeaders } from '@/config/api'
import Cookies from 'js-cookie'

export const laporanService = {
    getAllLaporan: async () => {
        try {
            // const token = Cookies.get('authToken')
            // if (!token) {
            //     throw new Error('Token tidak ditemukan')
            // }
            const response = await fetch(`/api/laporan/getall`, {
                method: 'GET',
                headers: {
                    // ...getHeaders(token),
                    ...(process.env.NODE_ENV === 'development' && { 'ngrok-skip-browser-warning': 'true' })
                },
                credentials: 'include'
            })
            if (!response.ok) {
                let errorMessage = 'Gagal mengambil data laporan'
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorMessage
                } catch (jsonError) {
                    errorMessage = response.statusText || errorMessage
                }
                throw new Error(errorMessage)
            }
            const { data } = await response.json()
            return Array.isArray(data) ? data : []
        } catch (error) {
            console.error('Error in getAllLaporan:', error)
            throw error
        }
    },

    getSaldo: async () => {
        try {
            // const token = Cookies.get('authToken')
            // if (!token) {
            //     throw new Error('Token tidak ditemukan')
            // }
            const response = await fetch(`/api/laporan/saldo`, {
                method: 'GET',
                headers: {
                    // ...getHeaders(token),
                    ...(process.env.NODE_ENV === 'development' && { 'ngrok-skip-browser-warning': 'true' })
                },
                credentials: 'include'
            })
            if (!response.ok) {
                let errorMessage = 'Gagal mengambil saldo'
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorMessage
                } catch (jsonError) {
                    errorMessage = response.statusText || errorMessage
                }
                throw new Error(errorMessage)
            }
            const result = await response.json()
            // Tangani berbagai format respons
            const saldo = result.data ?? result.saldo ?? result.total ?? 0
            if (!Number.isFinite(Number(saldo))) {
                console.warn('Saldo tidak valid:', saldo)
                return 0
            }
            return Number(saldo)
        } catch (error) {
            console.error('Error in getSaldo:', error.message)
            throw error
        }
    },

    getTotalPengeluaran: async () => {
        try {
            // const token = Cookies.get('authToken')
            // if (!token) {
            //     throw new Error('Token tidak ditemukan')
            // }
            const response = await fetch(`/api/laporan/pengeluaran`, {
                method: 'GET',
                headers: {
                    // ...getHeaders(token),
                    ...(process.env.NODE_ENV === 'development' && { 'ngrok-skip-browser-warning': 'true' })
                },
                credentials: 'include'
            })
            if (!response.ok) {
                let errorMessage = 'Gagal mengambil total pengeluaran'
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorMessage
                } catch (jsonError) {
                    errorMessage = response.statusText || errorMessage
                }
                throw new Error(errorMessage)
            }
            const { total } = await response.json()
            return Number.isFinite(Number(total)) ? Number(total) : 0
        } catch (error) {
            console.error('Error in getTotalPengeluaran:', error)
            throw error
        }
    },

    getTotalPemasukan: async () => {
        try {
            // const token = Cookies.get('authToken')
            // if (!token) {
            //     throw new Error('Token tidak ditemukan')
            // }
            const response = await fetch(`/api/laporan/pemasukan`, {
                method: 'GET',
                headers: {
                    // ...getHeaders(token),
                    ...(process.env.NODE_ENV === 'development' && { 'ngrok-skip-browser-warning': 'true' })
                },
                credentials: 'include'
            })
            if (!response.ok) {
                let errorMessage = 'Gagal mengambil total pemasukan'
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorMessage
                } catch (jsonError) {
                    errorMessage = response.statusText || errorMessage
                }
                throw new Error(errorMessage)
            }
            const { total } = await response.json()
            return Number.isFinite(Number(total)) ? Number(total) : 0
        } catch (error) {
            console.error('Error in getTotalPemasukan:', error)
            throw error
        }
    },

    getLaporanByDateRange: async (startDate, endDate) => {
        try {
            // const token = Cookies.get('authToken')
            // if (!token) {
            //     throw new Error('Token tidak ditemukan')
            // }
            const response = await fetch(
                `/api/laporan/range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
                {
                    method: 'GET',
                    headers: {
                        // ...getHeaders(token),
                        ...(process.env.NODE_ENV === 'development' && { 'ngrok-skip-browser-warning': 'true' })
                    },
                    credentials: 'include'
                }
            )
            if (!response.ok) {
                let errorMessage = 'Gagal mengambil laporan berdasarkan rentang tanggal'
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorMessage
                } catch (jsonError) {
                    errorMessage = response.statusText || errorMessage
                }
                throw new Error(errorMessage)
            }
            const { data } = await response.json()
            return Array.isArray(data) ? data : []
        } catch (error) {
            console.error('Error in getLaporanByDateRange:', error)
            throw error
        }
    }
}