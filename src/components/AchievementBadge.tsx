
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
}

const AchievementBadge = ({ 
  title, 
  description, 
  icon, 
  unlocked, 
  progress = 100 
}: AchievementBadgeProps) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all border-2",
      unlocked ? "border-swapx-purple" : "border-gray-200 opacity-70"
    )}>
      <CardContent className="p-4 flex flex-col items-center text-center">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mb-3",
          unlocked ? "bg-swapx-soft-purple text-swapx-purple" : "bg-gray-100 text-gray-400"
        )}>
          {icon}
        </div>
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        
        {!unlocked && progress < 100 && (
          <div className="w-full mt-3 bg-gray-100 rounded-full h-1.5">
            <div 
              className="bg-swapx-purple h-1.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementBadge;
