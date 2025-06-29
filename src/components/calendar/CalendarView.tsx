import React, { useState, useMemo } from 'react';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Filter } from 'lucide-react';
import { Calendar } from './Calendar';
import { MissionCard } from '../missions/MissionCard';
import { MissionForm } from '../missions/MissionForm';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Mission, CreateMissionData, UpdateMissionData } from '../../models/Mission';
import { useMissions } from '../../hooks/useMissions';

export const CalendarView: React.FC = () => {
  const { missions, loading, createMission, updateMission, deleteMission } = useMissions();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [importanceFilter, setImportanceFilter] = useState<string>('all');

  const filteredMissions = useMemo(() => {
    return missions.filter((mission) => {
      if (statusFilter !== 'all' && mission.status !== statusFilter) return false;
      if (importanceFilter !== 'all' && mission.importance.toString() !== importanceFilter) return false;
      return true;
    });
  }, [missions, statusFilter, importanceFilter]);

  const selectedDateMissions = useMemo(() => {
    return filteredMissions.filter((mission) =>
      isSameDay(new Date(mission.scheduled_date), selectedDate)
    );
  }, [filteredMissions, selectedDate]);

  const handleCreateMission = async (data: CreateMissionData) => {
    try {
      await createMission(data);
      setShowMissionForm(false);
    } catch (error) {
      console.error('Error creating mission:', error);
    }
  };

  const handleUpdateMission = async (data: UpdateMissionData) => {
    try {
      await updateMission(data);
      setEditingMission(null);
    } catch (error) {
      console.error('Error updating mission:', error);
    }
  };

  const handleStatusChange = async (missionId: string, status: Mission['status']) => {
    try {
      await updateMission({ id: missionId, status });
    } catch (error) {
      console.error('Error updating mission status:', error);
    }
  };

  const handleDeleteMission = async (missionId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) {
      try {
        await deleteMission(missionId);
      } catch (error) {
        console.error('Error deleting mission:', error);
      }
    }
  };

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'todo', label: 'À faire' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
  ];

  const importanceOptions = [
    { value: 'all', label: 'Toutes les importances' },
    { value: '1', label: 'Très faible (1)' },
    { value: '2', label: 'Faible (2)' },
    { value: '3', label: 'Moyenne (3)' },
    { value: '4', label: 'Haute (4)' },
    { value: '5', label: 'Critique (5)' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des missions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Calendar
            missions={filteredMissions}
            onDateSelect={setSelectedDate}
            onCreateMission={(date) => {
              setSelectedDate(new Date(date));
              setShowMissionForm(true);
            }}
            selectedDate={selectedDate}
          />
        </div>

        {/* Mission List */}
        <div className="space-y-6">
          {/* Filters */}
          <div className="card p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Filter size={18} className="text-gray-500" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Filtres</h3>
            </div>
            <div className="space-y-3">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
              />
              <Select
                value={importanceFilter}
                onChange={(e) => setImportanceFilter(e.target.value)}
                options={importanceOptions}
              />
            </div>
          </div>

          {/* Selected Date Missions */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </h3>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowMissionForm(true)}
                className="flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Nouvelle mission</span>
              </Button>
            </div>

            <div className="space-y-3">
              {selectedDateMissions.length > 0 ? (
                selectedDateMissions.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    onEdit={setEditingMission}
                    onDelete={handleDeleteMission}
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>Aucune mission pour cette date.</p>
                  <Button
                    variant="ghost"
                    onClick={() => setShowMissionForm(true)}
                    className="mt-2"
                  >
                    Créer une mission
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mission Form Modal */}
      <Modal
        isOpen={showMissionForm || !!editingMission}
        onClose={() => {
          setShowMissionForm(false);
          setEditingMission(null);
        }}
        title={editingMission ? 'Modifier la mission' : 'Nouvelle mission'}
        size="lg"
      >
        <MissionForm
          mission={editingMission || undefined}
          initialDate={format(selectedDate, 'yyyy-MM-dd')}
          onSubmit={editingMission ? handleUpdateMission : handleCreateMission}
          onCancel={() => {
            setShowMissionForm(false);
            setEditingMission(null);
          }}
        />
      </Modal>
    </div>
  );
};