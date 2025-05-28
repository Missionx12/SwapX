import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Leaf, BookOpenText, Waypoints, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookItem from '@/components/BookItem';
import CarbonImpact from '@/components/CarbonImpact';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [impact, setImpact] = useState({ totalSaved: 0, swapCount: 0, level: 1, points: 0 });

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const user = (await supabase.auth.getSession()).data.session?.user;
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .neq('owner_id', user?.id)
        .order('created_at', { ascending: false });
      if (!error) setBooks(data || []);
      setLoading(false);
    };
    fetchBooks();
    // TODO: Fetch real impact data from Supabase or calculate
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="p-6 pt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold swapx-gradient">SwapX</h1>
            <p className="text-sm text-muted-foreground">Book swapping, reimagined</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/notifications')}>
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-swapx-purple opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-swapx-purple"></span>
            </span>
            2 new
          </Button>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-swapx-purple to-swapx-green/40 p-6 mb-8">
          <div className="max-w-[60%]">
            <h2 className="text-white text-xl font-bold mb-2">Swap books, <br/>save the planet</h2>
            <p className="text-white/90 text-sm mb-4">Every book you swap helps reduce carbon emissions</p>
            <Button className="bg-white text-swapx-purple hover:bg-white/90" size="sm" onClick={() => navigate('/browse')}>
              Start swapping
            </Button>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-20">
            <BookOpenText size={120} className="text-white" />
          </div>
        </div>
      </header>

      {/* Carbon Impact Summary */}
      <section className="px-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Leaf className="h-5 w-5 text-swapx-purple" />
            Your Impact
          </h2>
          <Button variant="ghost" size="sm" className="text-swapx-purple" onClick={() => navigate('/impact')}>
            See all <ChevronRight size={16} />
          </Button>
        </div>
        <CarbonImpact 
          totalSaved={impact.totalSaved}
          swapCount={impact.swapCount}
          level={impact.level}
          points={impact.points}
        />
      </section>

      {/* Books Near You */}
      <section className="px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Waypoints className="h-5 w-5 text-swapx-purple" />
            Books Near You
          </h2>
          <Button variant="ghost" size="sm" className="text-swapx-purple" onClick={() => navigate('/browse')}>
            See all <ChevronRight size={16} />
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-32">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {books.map((book) => (
              <BookItem key={book.id} {...book} />
            ))}
          </div>
        )}
      </section>

      <Navigation />
    </div>
  );
};

export default Index;
