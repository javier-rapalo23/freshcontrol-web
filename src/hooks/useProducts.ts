import { useState, useEffect, useCallback } from 'react';
import api, { type APIResponse } from '../lib/axios';

// Interfaz adaptada al Swagger
export interface Category {
  id: number;
  name: string;
  description?: string;
  active: boolean;
}

export interface Product {
  id: number;
  name: string;
  sell_price: number; // Antes 'price'
  buy_price: number;
  category: Category; // Antes 'string'
  category_id: number;
  stock: number;
  unit: string;
  active: boolean;
  // Campos UI (no vienen del API por ahora)
  image?: string; 
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint según swagger: GET /productos
      // El generic es APIResponse<Product[]>
      const response = await api.get<APIResponse<Product[]>>('/productos');
      
      // La data real está en response.data.data
      setProducts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('No se pudieron cargar los productos disponibles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
