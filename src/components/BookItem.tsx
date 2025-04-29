
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BookProps {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  distance: number;
  condition: 'Like New' | 'Good' | 'Fair' | 'Well Used';
  carbonSaving: number;
}

const BookItem = ({ title, author, imageUrl, distance, condition, carbonSaving }: BookProps) => {
  const conditionColors = {
    'Like New': 'bg-green-100 text-green-800 border-green-200',
    'Good': 'bg-blue-100 text-blue-800 border-blue-200',
    'Fair': 'bg-orange-100 text-orange-800 border-orange-200',
    'Well Used': 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          <Badge className={cn("absolute top-2 right-2 font-normal", conditionColors[condition])}>
            {condition}
          </Badge>
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
          
          <Button className="w-full mt-2 bg-swapx-purple hover:bg-swapx-purple/90 text-white" size="sm">
            Request swap
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookItem;
