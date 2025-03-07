import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/config/api';

export async function PUT(request, { params }) {
    try {
        const formData = await request.formData();
        const token = request.headers.get('Authorization');
        const { id } = params;

        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'Token tidak ditemukan'
            }, { status: 401 });
        }

        // Forward request ke backend API
        const response = await fetch(`${API_ENDPOINTS.PENGELUARAN_UPDATE(id)}`, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'ngrok-skip-browser-warning': 'true'
            },
            body: formData
        });

        const responseData = await response.json();

        if (!response.ok) {
            return NextResponse.json({
                success: false,
                message: responseData.message || 'Gagal mengupdate pengeluaran'
            }, { status: response.status });
        }

        return NextResponse.json({
            success: true,
            message: 'Berhasil mengupdate pengeluaran',
            data: responseData.data
        });
    } catch (error) {
        console.error('Error updating pengeluaran:', error);
        return NextResponse.json({
            success: false,
            message: 'Terjadi kesalahan saat mengupdate pengeluaran'
        }, { status: 500 });
    }
} 