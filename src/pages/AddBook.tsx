import React, { useState, useRef } from 'react';
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
  Leaf,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { addBook } from '@/services/bookService';
import { supabase } from '@/integrations/supabase/client';

const AddBook = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload image to Supabase storage
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `book-covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('book-covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('book-covers')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (imageFile && imageFile.size > 5 * 1024 * 1024) {
      newErrors.image = 'Image size should be less than 5MB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      // Create the book in Supabase
      await addBook({
        title: title.trim(),
        description: description.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        image_url: imageUrl,
        carbon_saving: 2.0, // Default carbon saving
      });
      
      // Show success toast
      toast({
        title: "Book added successfully!",
        description: "Your book listing has been created and is now visible to others.",
      });
      
      // Navigate to feed
      navigate('/feed');
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
          <label className="text-sm font-medium">Book Cover (Optional)</label>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <div 
            className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-swapx-purple transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="relative w-full aspect-[3/4] max-w-[200px]">
                <img 
                  src={imagePreview} 
                  alt="Book cover preview" 
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="bg-gray-50 rounded-full p-3 mb-2">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium">Upload Book Cover</p>
                <p className="text-xs text-muted-foreground mt-1">Tap to take a photo or upload an image</p>
              </>
            )}
          </div>
          {errors.image && (
            <p className="text-sm text-red-500">{errors.image}</p>
          )}
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
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors(prev => ({ ...prev, title: '' }));
              }}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4" /> Description
            </label>
            <Textarea 
              id="description" 
              placeholder="Brief description of the book" 
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors(prev => ({ ...prev, description: '' }));
              }}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium flex items-center gap-2">
              <Leaf className="h-4 w-4" /> Tags
            </label>
            <Input 
              id="tags" 
              placeholder="Enter tags separated by commas (e.g., fiction, mystery, sci-fi)" 
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-swapx-purple hover:bg-swapx-purple/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Book...' : 'Add Book'}
        </Button>
      </form>

      <Navigation />
    </div>
  );
};

export default AddBook;
