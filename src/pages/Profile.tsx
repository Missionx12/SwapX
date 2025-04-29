
import React from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Settings, 
  MessageCircle, 
  BookMarked,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Leaf
} from 'lucide-react';
import { userImpact } from '@/lib/mockData';

const Profile = () => {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="p-6 pt-8 mb-4 text-center">
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings />
          </Button>
        </div>
        
        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-swapx-purple">
          <AvatarImage src="https://i.pravatar.cc/300" alt="User Profile" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        
        <h1 className="text-xl font-bold">Jane Doe</h1>
        <p className="text-muted-foreground">San Francisco, CA</p>
        
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Leaf className="h-4 w-4 text-green-600" />
            <span>{userImpact.totalSaved.toFixed(1)} kg saved</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
          <div className="text-sm font-medium">Level {userImpact.level}</div>
        </div>
      </header>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold">{userImpact.swapCount}</p>
          <p className="text-xs text-muted-foreground">Swaps</p>
        </div>
        <div className="bg-swapx-soft-purple rounded-lg p-3 text-center">
          <p className="text-xl font-bold">12</p>
          <p className="text-xs text-muted-foreground">Books</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold">5</p>
          <p className="text-xs text-muted-foreground">Friends</p>
        </div>
      </div>
      
      {/* Actions */}
      <div className="px-6 space-y-4">
        <div className="bg-white rounded-lg shadow-sm">
          <Button variant="ghost" className="w-full justify-start p-4 h-auto">
            <BookMarked className="h-5 w-5 mr-3 text-swapx-purple" />
            <span className="flex-grow text-left">My Books</span>
            <ChevronRight size={18} className="text-muted-foreground" />
          </Button>
          <hr className="mx-4" />
          <Button variant="ghost" className="w-full justify-start p-4 h-auto">
            <MessageCircle className="h-5 w-5 mr-3 text-swapx-purple" />
            <span className="flex-grow text-left">Messages</span>
            <span className="bg-swapx-purple text-white text-xs rounded-full px-2 py-0.5">2</span>
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <Button variant="ghost" className="w-full justify-start p-4 h-auto">
            <ShieldCheck className="h-5 w-5 mr-3 text-swapx-purple" />
            <span className="flex-grow text-left">Privacy Settings</span>
            <ChevronRight size={18} className="text-muted-foreground" />
          </Button>
          <hr className="mx-4" />
          <Button variant="ghost" className="w-full justify-start p-4 h-auto text-red-500">
            <LogOut className="h-5 w-5 mr-3" />
            <span className="flex-grow text-left">Log Out</span>
          </Button>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Profile;
