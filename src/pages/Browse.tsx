
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { mockBooks } from '@/lib/mockData';
import BookItem from '@/components/BookItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  SlidersHorizontal,
  ChevronLeft,
  BookOpenText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter books based on search term
  const filteredBooks = mockBooks.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-background z-10 border-b">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
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
        <div className="grid grid-cols-2 gap-4">
          {filteredBooks.map((book) => (
            <BookItem key={book.id} {...book} />
          ))}
        </div>
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No books found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Browse;
