import { useState, useEffect } from 'react';
import { Category } from '../models/Mission';
import { supabase } from '../config/supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user?.id)
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des catégories');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (name: string, color: string, icon?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name,
          color,
          icon,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setCategories((prev) => [...prev, data]);
      toast.success('Catégorie créée avec succès !');
      return data;
    } catch (error: any) {
      toast.error('Erreur lors de la création de la catégorie');
      console.error('Error creating category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCategories((prev) =>
        prev.map((category) => (category.id === data.id ? data : category))
      );
      toast.success('Catégorie mise à jour !');
      return data;
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour de la catégorie');
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      setCategories((prev) => prev.filter((category) => category.id !== categoryId));
      toast.success('Catégorie supprimée !');
    } catch (error: any) {
      toast.error('Erreur lors de la suppression de la catégorie');
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}; 