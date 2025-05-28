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
  tags?: string[];
}

// Fetch all books except those posted by the current user
export const getBooks = async () => {
  const user = (await supabase.auth.getSession()).data.session?.user;
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .neq('owner_id', user?.id)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
  return data;
};

// Fetch a single book by ID
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

// Add a new book, using the current user's ID
export const addBook = async (book: Book) => {
  const user = (await supabase.auth.getSession()).data.session?.user;
  if (!user) throw new Error('Not logged in');
  const { data, error } = await supabase
    .from('books')
    .insert([{ ...book, owner_id: user.id }])
    .select();
  if (error) {
    console.error('Error adding book:', error);
    throw error;
  }
  return data[0];
};

// Update a book
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

// Delete a book
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
