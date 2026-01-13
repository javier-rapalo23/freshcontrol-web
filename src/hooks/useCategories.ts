import { useState, useEffect, useCallback } from 'react';
import api, { type APIResponse } from '../lib/axios';
import { type Category } from './useProducts';

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => void;
  createCategory: (data: Partial<Category>) => Promise<boolean>;
  updateCategory: (id: number, data: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<APIResponse<Category[]>>('/categorias');
      setCategories(response.data.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('No se pudieron cargar las categorías.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = async (data: Partial<Category>): Promise<boolean> => {
    try {
      await api.post('/categorias', data);
      await fetchCategories();
      return true;
    } catch (err) {
      console.error('Error creating category:', err);
      setError('Error al crear la categoría.');
      return false;
    }
  };

  const updateCategory = async (id: number, data: Partial<Category>): Promise<boolean> => {
    try {
      await api.put(`/categorias/${id}`, data);
      await fetchCategories();
      return true;
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Error al actualizar la categoría.');
      return false;
    }
  };

  const deleteCategory = async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/categorias/${id}`);
      await fetchCategories();
      return true;
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Error al eliminar la categoría.');
      return false;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { 
    categories, 
    loading, 
    error, 
    refreshCategories: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
}
