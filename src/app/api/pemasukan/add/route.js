import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/config/api';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const token = request.headers.get('Authorization');

        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'Token tidak ditemukan'
            }, { status: 401 });
        }

        // Forward request ke backend API
        const response = await fetch(API_ENDPOINTS.PEMASUKAN_ADD, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'ngrok-skip-browser-warning': 'true'
            },
            body: formData
        });

        // Coba parse response sebagai text terlebih dahulu
        const responseText = await response.text();
        console.log('Response from backend:', responseText);
        
        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch (error) {
            console.error('Error parsing response:', error);
            return NextResponse.json({
                success: false,
                message: 'Format response tidak valid',
                error: responseText
            }, { status: 500 });
        }

        // Jika response tidak ok, kembalikan error
        if (!response.ok) {
            return NextResponse.json({
                success: false,
                message: responseData.message || 'Gagal menambah pemasukan'
            }, { status: response.status });
        }

        // Jika berhasil, kembalikan response
        return NextResponse.json({
            success: true,
            message: 'Berhasil menambah pemasukan',
            data: responseData.data || responseData
        });

    } catch (error) {
        console.error('Error adding pemasukan:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Terjadi kesalahan saat menambah pemasukan'
        }, { status: 500 });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, ngrok-skip-browser-warning'
        }
    });
} 