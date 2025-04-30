
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  SlidersHorizontal,
  ChevronLeft,
  BookOpenText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getBooks } from '@/services/bookService';
import BookInteractionItem from '@/components/BookInteractionItem';
import { useToast } from '@/hooks/use-toast';

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await getBooks();
        
        // Transform the data to match our BookItem props
        const transformedBooks = booksData.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author || 'Unknown Author',
          imageUrl: book.image_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e',
          distance: Math.random() * 5, // Random distance for demo
          condition: book.condition || 'Good',
          carbonSaving: book.carbon_saving || 2.0,
          ownerId: book.owner_id
        }));
        
        setBooks(transformedBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
        toast({
          title: "Error",
          description: "Failed to load books. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [toast]);
  
  // Filter books based on search term
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLike = (id: string, liked: boolean) => {
    console.log(`Book ${id} ${liked ? 'liked' : 'unliked'}`);
    // You could update local state here if needed
  };

  const handleSwap = (id: string) => {
    console.log(`Swap requested for book ${id}`);
    // You could update local state here if needed
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-background z-10 border-b">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => window.history.back()}>
              <ChevronLeft />
            </Button>
            <h1 className="text-lg font-bold flex items-center">
              <BookOpenText className="h-5 w-5 mr-2" /> Browse Books
            </h1>
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal size={18} />
          </Button>
        </div>
      </header>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title or author..."
            className="pl-8 bg-muted/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="px-4 py-2 overflow-x-auto flex gap-2 border-b">
        <Badge variant="secondary" className="whitespace-nowrap">All Books</Badge>
        <Badge variant="outline" className="whitespace-nowrap">Fiction</Badge>
        <Badge variant="outline" className="whitespace-nowrap">Non-Fiction</Badge>
        <Badge variant="outline" className="whitespace-nowrap">Fantasy</Badge>
        <Badge variant="outline" className="whitespace-nowrap">Sci-Fi</Badge>
        <Badge variant="outline" className="whitespace-nowrap">Mystery</Badge>
      </div>

      {/* Books grid */}
      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse rounded-lg overflow-hidden">
                <div className="bg-gray-200 aspect-[3/4]"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              {filteredBooks.map((book) => (
                <BookInteractionItem 
                  key={book.id} 
                  {...book}
                  onLike={handleLike}
                  onSwap={handleSwap}
                />
              ))}
            </div>
            {filteredBooks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchTerm ? `No books found matching "${searchTerm}"` : "No books available yet"}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Browse;
