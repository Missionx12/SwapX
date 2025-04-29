
import React from 'react';
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
import { useToast } from "@/components/ui/use-toast";

const AddBook = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate successful book addition
    toast({
      title: "Book added successfully!",
      description: "Your book listing has been created and is now visible to others.",
    });
    
    // Show carbon impact toast after a delay
    setTimeout(() => {
      toast({
        title: "Carbon Impact",
        description: "By listing this book, you could save up to 2.8 kg of CO₂!",
        className: "bg-swapx-green border-green-400",
      });
    }, 1500);
    
    // Navigate to browse
    setTimeout(() => navigate('/browse'), 2500);
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
            <Input id="title" placeholder="Enter book title" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="author" className="text-sm font-medium">Author</label>
            <Input id="author" placeholder="Enter author name" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="condition" className="text-sm font-medium">Condition</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="like-new">Like New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="well-used">Well Used</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4" /> Description
            </label>
            <Textarea id="description" placeholder="Brief description of the book" rows={3} />
          </div>
        </div>
        
        {/* Carbon Impact Preview */}
        <div className="bg-swapx-green/20 border border-swapx-green/30 rounded-lg p-4 flex items-center space-x-4">
          <Leaf className="h-10 w-10 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium">Potential Carbon Impact</p>
            <p className="text-sm text-muted-foreground">Approx. 2.8 kg CO₂ saved if swapped</p>
          </div>
        </div>
        
        <Button type="submit" className="w-full bg-swapx-purple hover:bg-swapx-purple/90">
          List Book
        </Button>
      </form>

      <Navigation />
    </div>
  );
};

export default AddBook;
