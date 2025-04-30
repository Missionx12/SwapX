
import { supabase } from '@/integrations/supabase/client';

export interface Book {
  id?: string;
  title: string;
  author?: string;
  description?: string;
  condition?: string;
  image_url?: string;
  owner_id?: string;
  carbon_saving?: number;
  created_at?: string;
  is_available?: boolean;
}

export const getBooks = async () => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching books:', error);
    throw error;
  }

  return data;
};

export const getBookById = async (id: string) => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching book:', error);
    throw error;
  }

  return data;
};

export const addBook = async (book: Book) => {
  const { data, error } = await supabase
    .from('books')
    .insert([book])
    .select();

  if (error) {
    console.error('Error adding book:', error);
    throw error;
  }

  return data[0];
};

export const updateBook = async (id: string, updates: Partial<Book>) => {
  const { data, error } = await supabase
    .from('books')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating book:', error);
    throw error;
  }

  return data[0];
};

export const deleteBook = async (id: string) => {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
