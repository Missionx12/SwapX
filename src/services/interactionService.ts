import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Like = Database['public']['Tables']['likes']['Row'];
type Match = Database['public']['Tables']['matches']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];

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

// Like a book
export const likeBook = async (likerId: string, bookId: string): Promise<Like> => {
  const { data, error } = await supabase
    .from('likes')
    .insert({ liker_id: likerId, liked_book_id: bookId })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Check if a match exists
export const checkMatch = async (userId: string, bookId: string): Promise<Match | null> => {
  // Get the book owner's ID
  const { data: book } = await supabase
    .from('books')
    .select('owner_id')
    .eq('id', bookId)
    .single();

  if (!book) return null;

  // Check if the book owner has liked any of the user's books
  const { data: userBooks } = await supabase
    .from('books')
    .select('id')
    .eq('owner_id', userId);

  if (!userBooks?.length) return null;

  const userBookIds = userBooks.map(b => b.id);

  const { data: match } = await supabase
    .from('likes')
    .select('liked_book_id')
    .eq('liker_id', book.owner_id)
    .in('liked_book_id', userBookIds)
    .single();

  if (!match) return null;

  // Create a match
  const { data: newMatch, error } = await supabase
    .from('matches')
    .insert({
      user1_id: userId,
      user2_id: book.owner_id,
      book1_id: bookId,
      book2_id: match.liked_book_id
    })
    .select()
    .single();

  if (error) throw error;
  return newMatch;
};

// Get all matches for a user
export const getUserMatches = async (userId: string): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      book1:books!matches_book1_id_fkey(*),
      book2:books!matches_book2_id_fkey(*)
    `)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

  if (error) throw error;
  return data || [];
};

// Send a message
export const sendMessage = async (matchId: string, senderId: string, content: string): Promise<Message> => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      match_id: matchId,
      sender_id: senderId,
      content,
      read: false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get messages for a match
export const getMatchMessages = async (matchId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

// Subscribe to new messages
export const subscribeToMessages = (
  matchId: string,
  callback: (message: Message) => void
) => {
  return supabase
    .channel(`match-${matchId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      },
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();
};

// Mark messages as read
export const markMessagesAsRead = async (matchId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('match_id', matchId)
    .neq('sender_id', userId)
    .eq('read', false);

  if (error) throw error;
};
