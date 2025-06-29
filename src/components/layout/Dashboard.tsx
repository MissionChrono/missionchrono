import React, { useState } from 'react';
import { Header } from './Header';
import { CalendarView } from '../calendar/CalendarView';
import { StatsView } from '../stats/StatsView';

export const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<'calendar' | 'stats'>('calendar');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="pt-4 px-4">
        {currentView === 'calendar' ? <CalendarView /> : <StatsView />}
      </main>
    </div>
  );
}; 