import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/config/api';

export async function POST(request) {
    try {
        const formData = await request.formData();
        // const token = request.headers.get('Authorization');

        // if (!token) {
        //     return NextResponse.json({
        //         success: false,
        //         message: 'Token tidak ditemukan'
        //     }, { status: 401 });
        // }

        // Pastikan ada file nota
        const nota = formData.get('nota');
        if (!nota) {
            return NextResponse.json({
                success: false,
                message: 'Nota harus diupload'
            }, { status: 400 });
        }

        // Ambil nilai tanggal dari formData
        const tanggal = formData.get('tanggal');
        if (!tanggal) {
            return NextResponse.json({
                success: false,
                message: 'Tanggal harus diisi'
            }, { status: 400 });
        }

        // Validasi format tanggal
        const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
        if (!dateRegex.test(tanggal)) {
            return NextResponse.json({
                success: false,
                message: 'Format tanggal tidak valid (YYYY-MM-DD HH:MM)'
            }, { status: 400 });
        }

        // Buat objek FormData baru untuk dikirim ke backend
        const newFormData = new FormData();
        newFormData.append('nota', nota);
        newFormData.append('tanggal', tanggal);
        newFormData.append('keterangan', formData.get('keterangan'));
        newFormData.append('nominal', formData.get('nominal'));

        // Forward request ke backend API
        const response = await fetch(API_ENDPOINTS.PENGELUARAN_ADD, {
            method: 'POST',
            body: newFormData
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
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}