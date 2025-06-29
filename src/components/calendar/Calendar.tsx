import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Mission } from '../../models/Mission';
import { clsx } from 'clsx';

interface CalendarProps {
  missions: Mission[];
  onDateSelect: (date: Date) => void;
  onCreateMission: (date: string) => void;
  selectedDate?: Date;
}

export const Calendar: React.FC<CalendarProps> = ({
  missions,
  onDateSelect,
  onCreateMission,
  selectedDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const missionsByDate = useMemo(() => {
    const grouped: Record<string, Mission[]> = {};
    missions.forEach((mission) => {
      const dateKey = format(new Date(mission.scheduled_date), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(mission);
    });
    return grouped;
  }, [missions]);

  const getDayMissions = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return missionsByDate[dateKey] || [];
  };

  const getMissionStatusColor = (missions: Mission[]) => {
    if (missions.length === 0) return '';
    
    const hasCompleted = missions.some(m => m.status === 'completed');
    const hasInProgress = missions.some(m => m.status === 'in_progress');
    const hasTodo = missions.some(m => m.status === 'todo');

    if (hasCompleted && !hasInProgress && !hasTodo) return 'bg-accent-500';
    if (hasInProgress) return 'bg-yellow-500';
    if (hasTodo) return 'bg-primary-500';
    return 'bg-gray-500';
  };

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="card p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={previousMonth}>
            <ChevronLeft size={18} />
          </Button>
          <Button variant="ghost" size="sm" onClick={nextMonth}>
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayMissions = getDayMissions(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={clsx(
                'min-h-[120px] p-2 border border-gray-200 dark:border-gray-700 cursor-pointer transition-colors',
                isCurrentMonth 
                  ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' 
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-400',
                isSelected && 'ring-2 ring-primary-500',
                isTodayDate && isCurrentMonth && 'bg-primary-50 dark:bg-primary-900'
              )}
              onClick={() => onDateSelect(day)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={clsx(
                  'text-sm font-medium',
                  isTodayDate && 'text-primary-600 dark:text-primary-400'
                )}>
                  {format(day, 'd')}
                </span>
                {isCurrentMonth && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateMission(format(day, 'yyyy-MM-dd'));
                    }}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:opacity-100"
                  >
                    <Plus size={12} />
                  </Button>
                )}
              </div>

              {/* Mission indicators */}
              <div className="space-y-1">
                {dayMissions.slice(0, 3).map((mission) => (
                  <div
                    key={mission.id}
                    className={clsx(
                      'w-full h-1.5 rounded-full',
                      mission.status === 'completed' && 'bg-accent-500',
                      mission.status === 'in_progress' && 'bg-yellow-500',
                      mission.status === 'todo' && 'bg-primary-500'
                    )}
                  />
                ))}
                {dayMissions.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    +{dayMissions.length - 3} autres
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};