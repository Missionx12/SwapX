
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Heart, Repeat, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTapInteraction } from '@/hooks/useTapInteraction';
import { toggleLike, checkIfLiked, getLikesCount, createSwapRequest } from '@/services/interactionService';
import { useToast } from '@/hooks/use-toast';

export interface BookInteractionProps {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  distance: number;
  condition: 'Like New' | 'Good' | 'Fair' | 'Well Used';
  carbonSaving: number;
  ownerId?: string;
  onLike?: (id: string, liked: boolean) => void;
  onSwap?: (id: string) => void;
}

const BookInteractionItem = ({ 
  id, 
  title, 
  author, 
  imageUrl, 
  distance, 
  condition, 
  carbonSaving,
  ownerId,
  onLike,
  onSwap
}: BookInteractionProps) => {
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define condition colors
  const conditionColors = {
    'Like New': 'bg-green-100 text-green-800 border-green-200',
    'Good': 'bg-blue-100 text-blue-800 border-blue-200',
    'Fair': 'bg-orange-100 text-orange-800 border-orange-200',
    'Well Used': 'bg-red-100 text-red-800 border-red-200'
  };

  // Custom tap interaction hooks
  const { tapCount, handleTap } = useTapInteraction({
    onLike: async () => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        const isNowLiked = await toggleLike(id);
        setLiked(isNowLiked);
        onLike?.(id, isNowLiked);
        
        // Update like count
        const newLikeCount = await getLikesCount(id);
        setLikeCount(newLikeCount);
        
        toast({
          title: isNowLiked ? "Book liked!" : "Like removed",
          description: isNowLiked ? "This book has been added to your likes" : "This book has been removed from your likes",
        });
      } catch (error) {
        console.error("Error toggling like:", error);
        toast({
          title: "Error",
          description: "Failed to like the book. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    onSwap: async () => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        await createSwapRequest(id, ownerId);
        onSwap?.(id);
        
        toast({
          title: "Swap requested!",
          description: "Your swap request has been sent to the book owner.",
        });
      } catch (error) {
        console.error("Error requesting swap:", error);
        toast({
          title: "Error",
          description: "Failed to request swap. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  });
  
  // Fetch initial like status and count
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const isLiked = await checkIfLiked(id);
        setLiked(isLiked);
        
        const count = await getLikesCount(id);
        setLikeCount(count);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };
    
    fetchLikeStatus();
  }, [id]);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div 
          className="relative aspect-[3/4] w-full overflow-hidden cursor-pointer"
          onClick={handleTap}
        >
          <img 
            src={imageUrl} 
            alt={title} 
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          <Badge className={cn("absolute top-2 right-2 font-normal", conditionColors[condition])}>
            {condition}
          </Badge>
          
          {/* Tap indicator */}
          {tapCount > 0 && (
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <div className="text-white font-bold text-2xl">
                {tapCount === 1 && "Tap again to like"}
                {tapCount === 2 && "Liked! Tap again to request swap"}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-3">
          <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{author}</p>
          
          <div className="mt-2 flex justify-between items-center">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={12} />
              <span>{distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`}</span>
            </div>
            <div className="text-xs font-medium text-green-600">
              {carbonSaving} kg CO₂
            </div>
          </div>
          
          <div className="flex gap-2 mt-2">
            <Button 
              className={cn(
                "flex-1 text-xs py-1 px-2 h-8 flex items-center gap-1",
                liked ? "bg-pink-100 text-pink-800 hover:bg-pink-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              )}
              variant="ghost"
              onClick={async (e) => {
                e.stopPropagation();
                if (isSubmitting) return;
                setIsSubmitting(true);
                try {
                  const isNowLiked = await toggleLike(id);
                  setLiked(isNowLiked);
                  onLike?.(id, isNowLiked);
                  
                  // Update like count
                  const newLikeCount = await getLikesCount(id);
                  setLikeCount(newLikeCount);
                } catch (error) {
                  console.error("Error toggling like:", error);
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <Heart size={16} className={liked ? "fill-pink-500 text-pink-500" : ""} /> 
              {likeCount > 0 && likeCount}
            </Button>
            
            <Button 
              className="flex-1 bg-swapx-purple hover:bg-swapx-purple/90 text-white text-xs py-1 px-2 h-8 flex items-center gap-1"
              onClick={async (e) => {
                e.stopPropagation();
                if (isSubmitting) return;
                setIsSubmitting(true);
                try {
                  await createSwapRequest(id, ownerId);
                  onSwap?.(id);
                  
                  toast({
                    title: "Swap requested!",
                    description: "Your swap request has been sent to the book owner.",
                  });
                } catch (error) {
                  console.error("Error requesting swap:", error);
                  toast({
                    title: "Error",
                    description: "Failed to request swap. Please try again.",
                    variant: "destructive",
                  });
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <Repeat size={16} /> Request swap
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookInteractionItem;
