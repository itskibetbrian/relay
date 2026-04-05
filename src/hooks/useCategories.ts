// src/hooks/useCategories.ts

import { useState, useEffect, useCallback } from 'react';
import { db } from '../services/database';
import { Category } from '../types';

interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  createCategory: (name: string, color: string, icon: string) => Promise<Category>;
  updateCategory: (id: string, name: string, color: string, icon: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await db.getAllCategories();
      setCategories(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const createCategory = useCallback(async (name: string, color: string, icon: string) => {
    const cat = await db.createCategory(name, color, icon);
    setCategories(prev => [...prev, cat]);
    return cat;
  }, []);

  const updateCategory = useCallback(async (id: string, name: string, color: string, icon: string) => {
    await db.updateCategory(id, name, color, icon);
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name, color, icon } : c));
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await db.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  return { categories, isLoading, createCategory, updateCategory, deleteCategory, refresh };
}
