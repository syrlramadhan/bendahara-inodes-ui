import { API_BASE_URL, API_ENDPOINTS, getHeaders } from '@/config/api';
import Cookies from 'js-cookie';

export const authService = {
    login: async (nik, password) => {
      try {
        console.log('Sending login request with:', { nik, password });
  
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ nik, password })
        });
  
        console.log('Response status:', response.status);
  
        const responseData = await response.json();
        console.log('Response data:', responseData);
  
        // Periksa status code dan pesan
        if (responseData.code !== 200 || responseData.status !== "OK") {
          return {
            success: false,
            error: responseData.message || 'Login gagal'
          };
        }
  
        // Simpan token dari field `data`
        const token = responseData.data;
        Cookies.set('authToken', token, { expires: 1 });
  
        // Jika tidak ada data user, Anda bisa menyimpan NIK atau data lain yang tersedia
        const user = { nik }; // Contoh: simpan NIK sebagai user data
        localStorage.setItem('user', JSON.stringify(user));
  
        return {
          success: true,
          data: {
            token,
            user
          }
        };
      } catch (error) {
        console.error('Login error:', error);
        return {
          success: false,
          error: 'Terjadi kesalahan saat login. Silakan coba lagi.'
        };
      }
    },
  
    validateToken: async (token) => {
      try {
        const response = await fetch('/api/admin/login', {
          method: 'GET',
          headers: getHeaders(token)
        });
  
        return response.ok;
      } catch (error) {
        console.error('Validate token error:', error);
        return false;
      }
    }
  };