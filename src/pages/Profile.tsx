import React, { useEffect, useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [books, setBooks] = useState([]);
  const [likedBooks, setLikedBooks] = useState([]);
  const [impact, setImpact] = useState({ totalSaved: 0, swapCount: 0, level: 1, points: 0 });

  useEffect(() => {
    const fetchProfile = async () => {
      const session = (await supabase.auth.getSession()).data.session;
      setUser(session?.user);
      if (session?.user) {
        // Fetch books posted by user
        const { data: postedBooks } = await supabase.from('books').select('*').eq('owner_id', session.user.id);
        setBooks(postedBooks || []);
        // Fetch liked books
        const { data: likes } = await supabase.from('likes').select('liked_book_id').eq('liker_id', session.user.id);
        if (likes && likes.length > 0) {
          const likedIds = likes.map((l: any) => l.liked_book_id);
          const { data: likedBooksData } = await supabase.from('books').select('*').in('id', likedIds);
          setLikedBooks(likedBooksData || []);
        }
        // TODO: Fetch real impact data from Supabase or calculate
      }
    };
    fetchProfile();
  }, []);

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
          <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold">{user?.email}</h1>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Leaf className="h-4 w-4 text-green-600" />
            <span>{impact.totalSaved.toFixed(1)} kg saved</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
          <div className="text-sm font-medium">Level {impact.level}</div>
        </div>
      </header>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold">{impact.swapCount}</p>
          <p className="text-xs text-muted-foreground">Swaps</p>
        </div>
        <div className="bg-swapx-soft-purple rounded-lg p-3 text-center">
          <p className="text-xl font-bold">{books.length}</p>
          <p className="text-xs text-muted-foreground">Books</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold">{likedBooks.length}</p>
          <p className="text-xs text-muted-foreground">Liked</p>
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
            <span className="bg-swapx-purple text-white text-xs rounded-full px-2 py-0.5">{likedBooks.length}</span>
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
