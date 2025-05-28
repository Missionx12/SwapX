import React, { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { likeBook, checkMatch } from '@/services/interactionService';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface BookCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  ownerId: string;
  carbonSaving: number;
  tags: string[];
  isLiked?: boolean;
  isMatched?: boolean;
  onLike?: () => void;
  onMatch?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  ownerId,
  carbonSaving,
  tags,
  isLiked = false,
  isMatched = false,
  onLike,
  onMatch
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like books",
        variant: "destructive",
      });
      return;
    }

    if (isLiked) return;

    setIsLiking(true);
    try {
      await likeBook(user.id, id);
      
      // Check for a match
      const match = await checkMatch(user.id, id);
      
      if (match) {
        toast({
          title: "It's a match! 🎉",
          description: "You can now start chatting with the book owner",
        });
        onMatch?.();
      } else {
        toast({
          title: "Book liked!",
          description: "You'll be notified if the owner likes your book back",
        });
      }
      
      onLike?.();
    } catch (error) {
      console.error('Error liking book:', error);
      toast({
        title: "Error",
        description: "Failed to like book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleChat = () => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Book Image */}
      <div className="relative aspect-[3/4] bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
        
        {/* Carbon Impact Badge */}
        <div className="absolute top-2 right-2 bg-swapx-green text-white px-2 py-1 rounded-full text-xs font-medium">
          {carbonSaving} kg CO₂
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant={isLiked ? "default" : "outline"}
            className={`flex-1 ${isLiked ? 'bg-swapx-purple hover:bg-swapx-purple/90' : ''}`}
            onClick={handleLike}
            disabled={isLiking || isLiked || ownerId === user?.id}
          >
            <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            {isLiked ? 'Liked' : 'Like'}
          </Button>
          
          {isMatched && (
            <Button
              variant="default"
              className="flex-1 bg-swapx-green hover:bg-swapx-green/90"
              onClick={handleChat}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard; 