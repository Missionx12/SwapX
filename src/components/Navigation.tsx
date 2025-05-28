import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpenText, PlusCircle, Trophy, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  
  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Browse', icon: BookOpenText, path: '/browse' },
    { name: 'Add', icon: PlusCircle, path: '/add' },
    { name: 'Impact', icon: Trophy, path: '/impact' },
    { name: 'Profile', icon: UserCircle, path: '/profile' },
  ];

  const handleNavigation = (path: string) => {
    // Only navigate if we're going to a different path
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const session = (await supabase.auth.getSession()).data.session;
      setUser(session?.user);
    };
    fetchUser();
    // Optionally, subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => fetchUser());
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-between items-center px-6 py-2 z-50">
      <div className="flex justify-around items-center px-4 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all",
                isActive ? "text-swapx-purple" : "text-gray-500"
              )}
            >
              <item.icon size={isActive ? 24 : 20} className={cn(
                "transition-all",
                isActive ? "animate-float" : ""
              )} />
              <span className="text-xs font-medium mt-1">{item.name}</span>
            </button>
          );
        })}
      </div>
      {user && (
        <span className="text-xs text-gray-500 ml-2 truncate">{user.email}</span>
      )}
    </nav>
  );
};

export default Navigation;
