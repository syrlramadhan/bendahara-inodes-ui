import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/config/api';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request) {
  try {
    // 1. Validate Content-Type
    const contentType = request.headers.get('Content-Type');
    if (contentType !== 'application/json') {
      return NextResponse.json(
        { success: false, message: 'Content-Type must be application/json' },
        { status: 415, headers: CORS_HEADERS }
      );
    }

    // 2. Parse JSON
    let data;
    try {
      data = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON format' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // // 3. Validate Authorization
    // const token = request.headers.get('Authorization');
    // if (!token || !token.startsWith('Bearer ')) {
    //   return NextResponse.json(
    //     { success: false, message: 'Authorization token required' },
    //     { status: 401, headers: CORS_HEADERS }
    //   );
    // }

    // 4. Validate required fields
    const requiredFields = ['tanggal', 'nominal', 'keterangan', 'kategori'];
    const missingFields = requiredFields.filter(field => !data[field]);
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
    if (!dateRegex.test(data.tanggal)) {
      return NextResponse.json(
        { success: false, message: 'Date format must be YYYY-MM-DD HH:mm' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 6. Validate nominal
    const nominal = Number(data.nominal.toString().replace(/\D/g, ''));
    if (isNaN(nominal) || nominal <= 0) {
      return NextResponse.json(
        { success: false, message: 'Nominal must be a positive number' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 7. Validate string fields
    if (!data.kategori.trim() || !data.keterangan.trim()) {
      return NextResponse.json(
        { success: false, message: 'Category and description cannot be empty' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 8. Prepare payload for backend
    const payload = {
      tanggal: data.tanggal, // Already in correct format "YYYY-MM-DD HH:mm"
      nominal: nominal,
      kategori: data.kategori.trim(),
      keterangan: data.keterangan.trim()
    };

    console.log('Forwarding to backend:', payload);

    // 9. Forward to backend API
    const backendResponse = await fetch(API_ENDPOINTS.PEMASUKAN_ADD, {
      method: 'POST',
      headers: {
        // 'Authorization': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // 10. Handle backend response
    if (!backendResponse.ok) {
      let errorData;
      try {
        errorData = await backendResponse.json();
      } catch {
        errorData = { message: await backendResponse.text() };
      }
      
      console.error('Backend error:', backendResponse.status, errorData);
      
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || 'Backend processing failed',
          backendError: errorData
        },
        { 
          status: backendResponse.status,
          headers: CORS_HEADERS
        }
      );
    }

    // 11. Return success response
    const result = await backendResponse.json();
    return NextResponse.json(
      {
        success: true,
        message: 'Income data saved successfully',
        data: result.data || result
      },
      { 
        status: 201,
        headers: CORS_HEADERS
      }
    );

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { 
        status: 500,
        headers: CORS_HEADERS
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}