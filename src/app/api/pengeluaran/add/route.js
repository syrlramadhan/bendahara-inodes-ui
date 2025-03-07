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

        // Pastikan ada file nota
        const nota = formData.get('nota');
        if (!nota) {
            return NextResponse.json({
                success: false,
                message: 'Nota harus diupload'
            }, { status: 400 });
        }

        // Forward request ke backend API
        const response = await fetch(API_ENDPOINTS.PENGELUARAN_ADD, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'ngrok-skip-browser-warning': 'true'
            },
            body: formData
        });

        // Coba parse response sebagai text terlebih dahulu
        const responseText = await response.text();
        let responseData;
        
        try {
            responseData = JSON.parse(responseText);
        } catch (error) {
            console.error('Response text:', responseText);
            return NextResponse.json({
                success: false,
                message: 'Format response tidak valid',
                error: responseText
            }, { 
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, ngrok-skip-browser-warning'
                }
            });
        }

        if (!response.ok) {
            return NextResponse.json({
                success: false,
                message: responseData.message || 'Gagal menambah pengeluaran'
            }, { 
                status: response.status,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, ngrok-skip-browser-warning'
                }
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Berhasil menambah pengeluaran',
            data: responseData.data
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, ngrok-skip-browser-warning'
            }
        });
    } catch (error) {
        console.error('Error adding pengeluaran:', error);
        return NextResponse.json({
            success: false,
            message: 'Terjadi kesalahan saat menambah pengeluaran'
        }, { 
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, ngrok-skip-browser-warning'
            }
        });
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