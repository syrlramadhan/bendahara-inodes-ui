import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/config/api';

export async function POST(request) {
    try {
        // Terima data sebagai JSON
        const data = await request.json();
        const token = request.headers.get('Authorization');

        // Validasi token
        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'Token tidak ditemukan'
            }, { status: 401 });
        }

        // Validasi data
        if (!data.tanggal || !data.nominal || !data.keterangan || !data.kategori) {
            return NextResponse.json({
                success: false,
                message: 'Data tidak lengkap (tanggal, nominal, kategori, dan keterangan harus diisi)'
            }, { status: 400 });
        }

        // Validasi format tanggal
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.tanggal)) {
            return NextResponse.json({
                success: false,
                message: 'Format tanggal tidak valid (YYYY-MM-DD)'
            }, { status: 400 });
        }

        // Validasi nominal
        if (isNaN(data.nominal) || data.nominal <= 0) {
            return NextResponse.json({
                success: false,
                message: 'Nominal harus berupa angka positif'
            }, { status: 400 });
        }

        // Validasi maksimal nominal
        if (data.nominal.toString().length > 11) {
            return NextResponse.json({
                success: false,
                message: 'Nominal terlalu besar (maksimal puluhan milyar)'
            }, { status: 400 });
        }

        // Validasi kategori
        if (!data.kategori.trim()) {
            return NextResponse.json({
                success: false,
                message: 'Kategori tidak boleh kosong'
            }, { status: 400 });
        }

        console.log('Sending data to backend:', data);

        // Forward request ke backend API
        const response = await fetch(API_ENDPOINTS.PEMASUKAN_ADD, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
                tanggal: data.tanggal,
                nominal: data.nominal,
                kategori: data.kategori.trim(),
                keterangan: data.keterangan.trim()
            })
        });

        // Log response untuk debugging
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
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
            }, { 
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, ngrok-skip-browser-warning'
                }
            });
        }

        // Jika response tidak ok, kembalikan error
        if (!response.ok) {
            return NextResponse.json({
                success: false,
                message: responseData.message || 'Gagal menambah pemasukan'
            }, { 
                status: response.status,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, ngrok-skip-browser-warning'
                }
            });
        }

        // Jika berhasil, kembalikan response
        return NextResponse.json({
            success: true,
            message: 'Berhasil menambah pemasukan',
            data: responseData.data || responseData
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, ngrok-skip-browser-warning'
            }
        });

    } catch (error) {
        console.error('Error adding pemasukan:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Terjadi kesalahan saat menambah pemasukan'
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