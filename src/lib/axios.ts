import axios from 'axios';

// Definición de la respuesta estándar de la API según Swagger
export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    // Si la API devuelve success: false, lanzamos error aunque el status HTTP sea 200
    if (response.data && response.data.success === false) {
       return Promise.reject(new Error(response.data.message || 'Error en la operación'));
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
