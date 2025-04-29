
import React from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trophy, Share2, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userImpact, achievements } from '@/lib/mockData';
import CarbonImpact from '@/components/CarbonImpact';
import AchievementBadge from '@/components/AchievementBadge';

// Dynamic icon component
import * as LucideIcons from 'lucide-react';

const Impact = () => {
  const navigate = useNavigate();
  
  // Function to dynamically get icon from name
  const getIcon = (iconName: string, size: number = 24) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    return <Icon size={size} />;
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-background z-10 border-b">
        <div className="p-4 flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft />
          </Button>
          <h1 className="text-lg font-bold">Your Impact</h1>
          <Button variant="ghost" size="icon">
            <Share2 />
          </Button>
        </div>
      </header>

      {/* Carbon Impact */}
      <section className="p-6">
        <CarbonImpact 
          totalSaved={userImpact.totalSaved}
          swapCount={userImpact.swapCount}
          level={userImpact.level}
          points={userImpact.points}
        />
      </section>

      {/* Achievements */}
      <section className="px-6 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-swapx-purple" />
          Achievements
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              title={achievement.title}
              description={achievement.description}
              icon={getIcon(achievement.iconName)}
              unlocked={achievement.unlocked}
              progress={achievement.progress}
            />
          ))}
        </div>
      </section>

      {/* Community Leaderboard */}
      <section className="px-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-swapx-purple" />
          Community Leaderboard
        </h2>
        <div className="bg-swapx-green/30 rounded-lg p-4 text-center">
          <p className="font-medium">You're in the top 20%</p>
          <p className="text-sm text-muted-foreground">of carbon savers in your area</p>
          <Button className="mt-4 bg-swapx-purple hover:bg-swapx-purple/90" size="sm" onClick={() => navigate('/leaderboard')}>
            View leaderboard
          </Button>
        </div>
      </section>

      <Navigation />
    </div>
  );
};

export default Impact;
