import React, { useMemo } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, Target, TrendingUp, CheckCircle2, Circle, Play } from 'lucide-react';
import { Mission } from '../../models/Mission';
import { useMissions } from '../../hooks/useMissions';

export const StatsView: React.FC = () => {
  const { missions, loading } = useMissions();

  const stats = useMemo(() => {
    const now = new Date();
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

    const thisWeekMissions = missions.filter(mission =>
      isWithinInterval(new Date(mission.scheduled_date), { start: thisWeekStart, end: thisWeekEnd })
    );
    
    const lastWeekMissions = missions.filter(mission =>
      isWithinInterval(new Date(mission.scheduled_date), { start: lastWeekStart, end: lastWeekEnd })
    );

    const totalMissions = missions.length;
    const completedMissions = missions.filter(m => m.status === 'completed').length;
    const inProgressMissions = missions.filter(m => m.status === 'in_progress').length;
    const todoMissions = missions.filter(m => m.status === 'todo').length;

    const totalPlannedHours = missions.reduce((sum, mission) => sum + mission.estimated_duration, 0) / 60;
    const completedHours = missions
      .filter(m => m.status === 'completed')
      .reduce((sum, mission) => sum + mission.estimated_duration, 0) / 60;

    const thisWeekPlannedHours = thisWeekMissions.reduce((sum, mission) => sum + mission.estimated_duration, 0) / 60;
    const thisWeekCompletedHours = thisWeekMissions
      .filter(m => m.status === 'completed')
      .reduce((sum, mission) => sum + mission.estimated_duration, 0) / 60;

    const lastWeekCompletedHours = lastWeekMissions
      .filter(m => m.status === 'completed')
      .reduce((sum, mission) => sum + mission.estimated_duration, 0) / 60;

    const completionRate = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;
    const weeklyProgress = thisWeekPlannedHours > 0 ? (thisWeekCompletedHours / thisWeekPlannedHours) * 100 : 0;

    // Daily stats for this week
    const weekDays = eachDayOfInterval({ start: thisWeekStart, end: thisWeekEnd });
    const dailyStats = weekDays.map(day => {
      const dayMissions = thisWeekMissions.filter(mission =>
        format(new Date(mission.scheduled_date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );
      const completed = dayMissions.filter(m => m.status === 'completed').length;
      const total = dayMissions.length;
      const plannedHours = dayMissions.reduce((sum, mission) => sum + mission.estimated_duration, 0) / 60;
      const completedHours = dayMissions
        .filter(m => m.status === 'completed')
        .reduce((sum, mission) => sum + mission.estimated_duration, 0) / 60;

      return {
        date: day,
        total,
        completed,
        plannedHours,
        completedHours,
        completionRate: total > 0 ? (completed / total) * 100 : 0,
      };
    });

    return {
      totalMissions,
      completedMissions,
      inProgressMissions,
      todoMissions,
      totalPlannedHours,
      completedHours,
      thisWeekPlannedHours,
      thisWeekCompletedHours,
      lastWeekCompletedHours,
      completionRate,
      weeklyProgress,
      dailyStats,
    };
  }, [missions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Statistiques
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Suivez votre progression et analysez vos performances
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Missions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalMissions}</p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
              <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taux de Réalisation</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.completionRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-accent-100 dark:bg-accent-900 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-accent-600 dark:text-accent-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Heures Réalisées</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.completedHours.toFixed(1)}h
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                sur {stats.totalPlannedHours.toFixed(1)}h planifiées
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progression Semaine</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.weeklyProgress.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.thisWeekCompletedHours.toFixed(1)}h / {stats.thisWeekPlannedHours.toFixed(1)}h
              </p>
            </div>
            <div className="p-3 bg-secondary-100 dark:bg-secondary-900 rounded-full">
              <TrendingUp className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Répartition des Missions
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-accent-500" />
                <span className="text-gray-700 dark:text-gray-300">Terminées</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {stats.completedMissions}
                </span>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-accent-500 h-2 rounded-full"
                    style={{ width: `${stats.totalMissions > 0 ? (stats.completedMissions / stats.totalMissions) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Play className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700 dark:text-gray-300">En cours</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {stats.inProgressMissions}
                </span>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${stats.totalMissions > 0 ? (stats.inProgressMissions / stats.totalMissions) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Circle className="w-5 h-5 text-primary-500" />
                <span className="text-gray-700 dark:text-gray-300">À faire</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {stats.todoMissions}
                </span>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${stats.totalMissions > 0 ? (stats.todoMissions / stats.totalMissions) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Progression Hebdomadaire
          </h3>
          <div className="space-y-3">
            {stats.dailyStats.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                    {format(day.date, 'EEE', { locale: fr })}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {day.completed}/{day.total} missions
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {day.completedHours.toFixed(1)}h
                  </span>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${day.completionRate}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-10">
                    {day.completionRate.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};