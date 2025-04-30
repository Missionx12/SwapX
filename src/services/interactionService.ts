
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Interface for book likes
export interface BookLike {
  id?: string;
  book_id: string;
  user_id?: string;
  created_at?: string;
}

// Interface for swap requests
export interface SwapRequest {
  id?: string;
  book_id: string;
  requester_id?: string;
  owner_id?: string;
  status?: 'pending' | 'accepted' | 'completed' | 'cancelled';
  created_at?: string;
  completed_at?: string;
}

// Check if a user has liked a book
export const checkIfLiked = async (bookId: string, userId?: string) => {
  // For now, we'll use a placeholder user ID if not provided
  const effectiveUserId = userId || 'anonymous-user';
  
  const { data, error } = await supabase
    .from('book_likes')
    .select('*')
    .eq('book_id', bookId)
    .eq('user_id', effectiveUserId);

  if (error) {
    console.error('Error checking like status:', error);
    throw error;
  }

  return data && data.length > 0;
};

// Toggle like on a book
export const toggleLike = async (bookId: string, userId?: string) => {
  // For now, we'll use a placeholder user ID if not provided
  const effectiveUserId = userId || 'anonymous-user';
  
  const isLiked = await checkIfLiked(bookId, effectiveUserId);

  if (isLiked) {
    // Unlike the book
    const { error } = await supabase
      .from('book_likes')
      .delete()
      .eq('book_id', bookId)
      .eq('user_id', effectiveUserId);

    if (error) {
      console.error('Error removing like:', error);
      throw error;
    }

    return false; // Not liked anymore
  } else {
    // Like the book
    const { error } = await supabase
      .from('book_likes')
      .insert([{
        book_id: bookId,
        user_id: effectiveUserId
      }]);

    if (error) {
      console.error('Error adding like:', error);
      throw error;
    }

    return true; // Now liked
  }
};

// Get likes count for a book
export const getLikesCount = async (bookId: string) => {
  const { count, error } = await supabase
    .from('book_likes')
    .select('*', { count: 'exact' })
    .eq('book_id', bookId);

  if (error) {
    console.error('Error counting likes:', error);
    throw error;
  }

  return count || 0;
};

// Create a swap request
export const createSwapRequest = async (bookId: string, ownerId?: string, requesterId?: string) => {
  // For now, we'll use placeholder user IDs if not provided
  const effectiveRequesterId = requesterId || 'anonymous-requester';
  const effectiveOwnerId = ownerId || 'book-owner';
  
  const { data, error } = await supabase
    .from('swap_requests')
    .insert([{
      book_id: bookId,
      requester_id: effectiveRequesterId,
      owner_id: effectiveOwnerId,
      status: 'pending'
    }])
    .select();

  if (error) {
    console.error('Error creating swap request:', error);
    throw error;
  }

  return data[0];
};

// Get swap requests for a book
export const getSwapRequests = async (bookId: string) => {
  const { data, error } = await supabase
    .from('swap_requests')
    .select('*')
    .eq('book_id', bookId);

  if (error) {
    console.error('Error fetching swap requests:', error);
    throw error;
  }

  return data;
};

// Update swap request status
export const updateSwapRequestStatus = async (requestId: string, status: 'pending' | 'accepted' | 'completed' | 'cancelled') => {
  const updates: Partial<SwapRequest> = { status };
  
  if (status === 'completed') {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('swap_requests')
    .update(updates)
    .eq('id', requestId)
    .select();

  if (error) {
    console.error('Error updating swap request:', error);
    throw error;
  }

  return data[0];
};
