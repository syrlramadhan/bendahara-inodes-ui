import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/config/api';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Methods': 'PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function PUT(request, { params }) {
  try {
    // 1. Parse FormData
    const formData = await request.formData();
    const { id } = params;

    // 2. Validate ID
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID tidak valid' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 3. Validate Authorization (opsional, sesuai kode asli)
    // const token = request.headers.get('Authorization');
    // if (!token || !token.startsWith('Bearer ')) {
    //   return NextResponse.json(
    //     { success: false, message: 'Authorization token required' },
    //     { status: 401, headers: CORS_HEADERS }
    //   );
    // }

    // 4. Extract and validate required fields
    const tanggal = formData.get('tanggal');
    const nominal = formData.get('nominal');
    const keterangan = formData.get('keterangan');
    const nota = formData.get('nota');

    const requiredFields = ['tanggal', 'nominal', 'keterangan'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing fields: ${missingFields.join(', ')}`,
          missingFields
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 5. Validate date format (YYYY-MM-DD HH:mm)
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!dateRegex.test(tanggal)) {
      return NextResponse.json(
        { success: false, message: 'Date format must be YYYY-MM-DD HH:mm' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 6. Validate nominal
    const nominalValue = Number(nominal);
    if (isNaN(nominalValue) || nominalValue <= 0) {
      return NextResponse.json(
        { success: false, message: 'Nominal must be a positive number' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 7. Validate keterangan
    if (!keterangan.trim()) {
      return NextResponse.json(
        { success: false, message: 'Keterangan cannot be empty' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 8. Validate nota (if provided)
    if (nota && !(nota instanceof File)) {
      return NextResponse.json(
        { success: false, message: 'Nota must be a valid file' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 9. Prepare FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('tanggal', tanggal);
    backendFormData.append('nominal', nominalValue);
    backendFormData.append('keterangan', keterangan.trim());
    if (nota) {
      backendFormData.append('nota', nota);
    }

    // 10. Forward to backend API
    const response = await fetch(`${API_ENDPOINTS.PENGELUARAN_UPDATE(id)}`, {
      method: 'PUT',
      headers: {
        // 'Authorization': token,
        'ngrok-skip-browser-warning': 'true'
      },
      body: backendFormData
    });

    // 11. Handle backend response
    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: responseData.message || 'Gagal mengupdate pengeluaran'
        },
        { status: response.status, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Berhasil mengupdate pengeluaran',
        data: responseData.data
      },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('Error updating pengeluaran:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengupdate pengeluaran',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}