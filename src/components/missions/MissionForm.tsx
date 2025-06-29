import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Mission, CreateMissionData, UpdateMissionData } from '../../models/Mission';
import { format } from 'date-fns';

interface MissionFormProps {
  mission?: Mission;
  initialDate?: string;
  onSubmit: (data: CreateMissionData | UpdateMissionData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const MissionForm: React.FC<MissionFormProps> = ({
  mission,
  initialDate,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: mission?.title || '',
    description: mission?.description || '',
    estimated_duration: mission?.estimated_duration || 30,
    importance: mission?.importance || 1,
    status: mission?.status || 'todo',
    scheduled_date: mission?.scheduled_date || initialDate || format(new Date(), 'yyyy-MM-dd'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mission) {
      onSubmit({ ...formData, id: mission.id } as UpdateMissionData);
    } else {
      onSubmit(formData as CreateMissionData);
    }
  };

  const importanceOptions = [
    { value: 1, label: '1 - Très faible' },
    { value: 2, label: '2 - Faible' },
    { value: 3, label: '3 - Moyenne' },
    { value: 4, label: '4 - Haute' },
    { value: 5, label: '5 - Critique' },
  ];

  const statusOptions = [
    { value: 'todo', label: 'À faire' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
  ];

  const durationOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 heure' },
    { value: 90, label: '1h30' },
    { value: 120, label: '2 heures' },
    { value: 180, label: '3 heures' },
    { value: 240, label: '4 heures' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Titre de la mission"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Nom de votre mission..."
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description (optionelle)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Détails de la mission..."
          rows={3}
          className="input-field resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Durée estimée"
          value={formData.estimated_duration}
          onChange={(e) => setFormData({ ...formData, estimated_duration: Number(e.target.value) })}
          options={durationOptions}
        />

        <Select
          label="Importance"
          value={formData.importance}
          onChange={(e) => setFormData({ ...formData, importance: Number(e.target.value) })}
          options={importanceOptions}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date prévue"
          type="date"
          value={formData.scheduled_date}
          onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
          required
        />

        <Select
          label="Statut"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Mission['status'] })}
          options={statusOptions}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel} type="button">
          Annuler
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : (mission ? 'Mettre à jour' : 'Créer la mission')}
        </Button>
      </div>
    </form>
  );
};