
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, TreeDeciduous, CloudSun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarbonImpactProps {
  totalSaved: number; // in kg
  swapCount: number;
  level: number;
  points: number;
}

const CarbonImpact = ({ totalSaved, swapCount, level, points }: CarbonImpactProps) => {
  // Calculate progress to next level (fictional calculation)
  const nextLevelPoints = level * 100;
  const progress = (points / nextLevelPoints) * 100;

  // Generate equivalent metrics
  const treesEquivalent = Math.round(totalSaved / 20); // Fictional: 1 tree = 20kg CO2 saved
  const carKmEquivalent = Math.round(totalSaved * 6); // Fictional: 1kg CO2 = 6km driven
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Leaf className="h-6 w-6 text-swapx-purple" />
            Your Carbon Impact
          </CardTitle>
          <CardDescription>
            Track how much CO₂ you've saved by swapping instead of buying new
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-4xl font-bold swapx-gradient">{totalSaved.toFixed(1)} kg</p>
              <p className="text-sm text-muted-foreground">CO₂ saved</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{swapCount}</p>
              <p className="text-sm text-muted-foreground">Total swaps</p>
            </div>
          </div>
          
          <div className="space-y-6 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Level {level}</span>
                <span>Level {level+1}</span>
              </div>
              <Progress value={progress} className="h-2 bg-swapx-green" />
              <p className="text-xs text-muted-foreground text-center">
                {Math.floor(nextLevelPoints - points)} more points to next level
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-swapx-green/30">
          <CardContent className="p-4 flex flex-col items-center">
            <TreeDeciduous className="h-8 w-8 text-green-600 mb-2" />
            <p className="font-bold text-xl">{treesEquivalent}</p>
            <p className="text-xs text-center">Trees planted for a month</p>
          </CardContent>
        </Card>
        <Card className="bg-swapx-soft-purple/50">
          <CardContent className="p-4 flex flex-col items-center">
            <CloudSun className="h-8 w-8 text-swapx-purple mb-2" />
            <p className="font-bold text-xl">{carKmEquivalent} km</p>
            <p className="text-xs text-center">Car travel avoided</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarbonImpact;
