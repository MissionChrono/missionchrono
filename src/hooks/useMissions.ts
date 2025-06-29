import { useState, useEffect } from 'react';
import { Mission, CreateMissionData, UpdateMissionData } from '../models/Mission';
import { supabase } from '../config/supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMissions();
    }
  }, [user]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('user_id', user?.id)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setMissions(data || []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des missions');
      console.error('Error fetching missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMission = async (missionData: CreateMissionData) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('missions')
        .insert({
          ...missionData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setMissions((prev) => [...prev, data]);
      toast.success('Mission créée avec succès !');
      return data;
    } catch (error: any) {
      toast.error('Erreur lors de la création de la mission');
      console.error('Error creating mission:', error);
      throw error;
    }
  };

  const updateMission = async (missionData: UpdateMissionData) => {
    try {
      const { data, error } = await supabase
        .from('missions')
        .update({
          ...missionData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', missionData.id)
        .select()
        .single();

      if (error) throw error;

      setMissions((prev) =>
        prev.map((mission) => (mission.id === data.id ? data : mission))
      );
      toast.success('Mission mise à jour !');
      return data;
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour de la mission');
      console.error('Error updating mission:', error);
      throw error;
    }
  };

  const deleteMission = async (missionId: string) => {
    try {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', missionId);

      if (error) throw error;

      setMissions((prev) => prev.filter((mission) => mission.id !== missionId));
      toast.success('Mission supprimée !');
    } catch (error: any) {
      toast.error('Erreur lors de la suppression de la mission');
      console.error('Error deleting mission:', error);
      throw error;
    }
  };

  return {
    missions,
    loading,
    createMission,
    updateMission,
    deleteMission,
    refetch: fetchMissions,
  };
};