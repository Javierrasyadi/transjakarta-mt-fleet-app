import axios from 'axios';
import { BASE_URL } from '../constants/api';
import Config from 'react-native-config';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': Config.MBTA_API_KEY,
  },
});


// Interceptor untuk menangani error response secara konsisten
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server merespons dengan status code di luar jangkauan 2xx
      const status = error.response.status;
      const data = error.response.data;

      let errorMessage = `Server error (${status}). Silakan coba lagi nanti.`;

      // Mencoba mengambil detail error spesifik dari JSON:API (jika ada)
      if (data && typeof data === 'object') {
        const jsonApiErrors = data.errors;
        if (Array.isArray(jsonApiErrors) && jsonApiErrors.length > 0) {
          const firstError = jsonApiErrors[0];
          if (firstError && typeof firstError === 'object' && firstError.detail) {
            errorMessage = firstError.detail;
          }
        }
      }

      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request telah dikirim namun tidak menerima respons (misalnya masalah jaringan)
      return Promise.reject(
        new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.')
      );
    } else {
      // Terjadi kesalahan saat menyiapkan request
      return Promise.reject(new Error(error.message || 'Terjadi kesalahan sistem.'));
    }
  }
);
