import React from 'react';
import { Clock, Flag, Edit, Trash2 } from 'lucide-react';
import { Mission } from '../../models/Mission';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

interface MissionCardProps {
  mission: Mission;
  onEdit: (mission: Mission) => void;
  onDelete: (missionId: string) => void;
  onStatusChange: (missionId: string, status: Mission['status']) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: Mission['status']) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in_progress':
        return 'En cours';
      default:
        return 'À faire';
    }
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 4) return 'text-red-500';
    if (importance >= 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className={clsx(
      'mission-card',
      mission.status === 'completed' && 'opacity-75'
    )}>
      <div className="flex items-start justify-between mb-3">
        <h3 className={clsx(
          'font-semibold text-gray-900 dark:text-gray-100',
          mission.status === 'completed' && 'line-through'
        )}>
          {mission.title}
        </h3>
        <div className="flex items-center space-x-2">
          <Flag 
            size={16} 
            className={getImportanceColor(mission.importance)}
            fill="currentColor"
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {mission.importance}/5
          </span>
        </div>
      </div>

      {mission.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {mission.description}
        </p>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <Clock size={14} />
            <span>{mission.estimated_duration} min</span>
          </div>
          <span className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium',
            getStatusColor(mission.status)
          )}>
            {getStatusLabel(mission.status)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {mission.status !== 'completed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStatusChange(
                mission.id,
                mission.status === 'todo' ? 'in_progress' : 'completed'
              )}
              className="text-accent-600 hover:text-accent-700"
            >
              {mission.status === 'todo' ? 'Commencer' : 'Terminer'}
            </Button>
          )}
          {mission.status === 'completed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStatusChange(mission.id, 'todo')}
              className="text-gray-600 hover:text-gray-700"
            >
              Rouvrir
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(mission)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <Edit size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(mission.id)}
            className="p-1 text-red-400 hover:text-red-600"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};