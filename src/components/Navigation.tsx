
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpenText, PlusCircle, Trophy, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
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

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
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
    </nav>
  );
};

export default Navigation;
