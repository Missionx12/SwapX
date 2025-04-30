
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft,
  Upload,
  Camera,
  BookOpen,
  Info,
  Leaf
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addBook } from '@/services/bookService';
import { v4 as uuidv4 } from 'uuid';

const AddBook = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [condition, setCondition] = useState<string>('');
  const [description, setDescription] = useState('');
  
  // Sample image URLs for demo
  const sampleImageUrls = [
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765'
  ];
  
  // Calculate carbon saving based on condition
  const calculateCarbonSaving = (bookCondition: string): number => {
    switch (bookCondition) {
      case 'Like New': return 2.8;
      case 'Good': return 2.3;
      case 'Fair': return 1.9;
      case 'Well Used': return 1.7;
      default: return 2.0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast({
        title: "Missing information",
        description: "Please enter a book title.",
        variant: "destructive",
      });
      return;
    }
    
    if (!condition) {
      toast({
        title: "Missing information",
        description: "Please select a book condition.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // For demo purposes, we'll use a random image URL
      const randomImageUrl = sampleImageUrls[Math.floor(Math.random() * sampleImageUrls.length)];
      
      // Create the book in Supabase
      await addBook({
        title,
        author,
        description,
        condition,
        image_url: randomImageUrl,
        owner_id: uuidv4(), // Temporary owner ID for now
        carbon_saving: calculateCarbonSaving(condition),
      });
      
      // Show success toast
      toast({
        title: "Book added successfully!",
        description: "Your book listing has been created and is now visible to others.",
      });
      
      // Show carbon impact toast after a delay
      setTimeout(() => {
        toast({
          title: "Carbon Impact",
          description: `By listing this book, you could save up to ${calculateCarbonSaving(condition)} kg of CO₂!`,
          className: "bg-swapx-green border-green-400",
        });
      }, 1500);
      
      // Navigate to browse
      setTimeout(() => navigate('/browse'), 2500);
    } catch (error) {
      console.error('Error adding book:', error);
      toast({
        title: "Error",
        description: "Failed to add book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-background z-10 border-b">
        <div className="p-4 flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft />
          </Button>
          <h1 className="text-lg font-bold">List a Book</h1>
          <div className="w-9"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Add Book Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Book Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Book Cover</label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-gray-50 rounded-full p-3 mb-2">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium">Upload Book Cover</p>
            <p className="text-xs text-muted-foreground mt-1">Tap to take a photo or upload an image</p>
          </div>
        </div>
        
        {/* Book Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Title
            </label>
            <Input 
              id="title" 
              placeholder="Enter book title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="author" className="text-sm font-medium">Author</label>
            <Input 
              id="author" 
              placeholder="Enter author name" 
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="condition" className="text-sm font-medium">Condition</label>
            <Select
              value={condition}
              onValueChange={setCondition}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Like New">Like New</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Well Used">Well Used</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4" /> Description
            </label>
            <Textarea 
              id="description" 
              placeholder="Brief description of the book" 
              rows={3} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        
        {/* Carbon Impact Preview */}
        <div className="bg-swapx-green/20 border border-swapx-green/30 rounded-lg p-4 flex items-center space-x-4">
          <Leaf className="h-10 w-10 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium">Potential Carbon Impact</p>
            <p className="text-sm text-muted-foreground">
              Approx. {condition ? calculateCarbonSaving(condition) : 2.0} kg CO₂ saved if swapped
            </p>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-swapx-purple hover:bg-swapx-purple/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Book...' : 'List Book'}
        </Button>
      </form>

      <Navigation />
    </div>
  );
};

export default AddBook;
