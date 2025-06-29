import React from 'react';
import { LogOut, Moon, Sun, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  currentView: 'calendar' | 'stats';
  onViewChange: (view: 'calendar' | 'stats') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              MissionChrono
            </h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <Button
                variant={currentView === 'calendar' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('calendar')}
                className="flex items-center space-x-2"
              >
                <Calendar size={16} />
                <span>Calendrier</span>
              </Button>
              <Button
                variant={currentView === 'stats' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('stats')}
                className="flex items-center space-x-2"
              >
                <BarChart3 size={16} />
                <span>Statistiques</span>
              </Button>
            </div>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <LogOut size={16} />
                <span>Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};