import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import BookCard from '@/components/BookCard';
import { getBooks } from '@/services/bookService';
import { getUserMatches } from '@/services/interactionService';
import { Database } from '@/integrations/supabase/types';

type Book = Database['public']['Tables']['books']['Row'];
type Match = Database['public']['Tables']['matches']['Row'];

const Feed = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedBooks, setLikedBooks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch books
        const fetchedBooks = await getBooks();
        setBooks(fetchedBooks);

        // Fetch matches
        const fetchedMatches = await getUserMatches(user.id);
        setMatches(fetchedMatches);

        // Get liked books from matches
        const liked = new Set<string>();
        fetchedMatches.forEach(match => {
          if (match.user1_id === user.id) {
            liked.add(match.book2_id);
          } else {
            liked.add(match.book1_id);
          }
        });
        setLikedBooks(liked);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load books. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const handleLike = (bookId: string) => {
    setLikedBooks(prev => new Set([...prev, bookId]));
  };

  const handleMatch = (bookId: string) => {
    // Refresh matches when a new match is created
    getUserMatches(user?.id || '').then(setMatches);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please sign in to view the feed</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-background z-10 border-b">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold">Feed</h1>
          <Button
            onClick={() => navigate('/add-book')}
            className="bg-swapx-purple hover:bg-swapx-purple/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </div>
      </header>

      {/* Book Grid */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-swapx-purple"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No books available. Be the first to add one!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {books.map((book) => {
              const isLiked = likedBooks.has(book.id);
              const isMatched = matches.some(
                match =>
                  (match.user1_id === user.id && match.book2_id === book.id) ||
                  (match.user2_id === user.id && match.book1_id === book.id)
              );

              return (
                <BookCard
                  key={book.id}
                  book={book}
                  isLiked={isLiked}
                  isMatched={isMatched}
                  onLike={() => handleLike(book.id)}
                  onMatch={() => handleMatch(book.id)}
                />
              );
            })}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Feed; 