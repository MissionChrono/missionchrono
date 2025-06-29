export type MissionStatus = 'todo' | 'in_progress' | 'completed';

export interface Mission {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  estimated_duration: number; // en minutes
  importance: number; // 1-5 scale
  status: MissionStatus;
  scheduled_date: string; // ISO date string
  scheduled_time?: string; // HH:MM format, optionnel
  priority?: number; // pour l'ordre d'affichage
  tags?: string[]; // tableau de tags
  category_id?: string; // référence vers une catégorie
  created_at: string;
  updated_at: string;
}

export interface CreateMissionData {
  title: string;
  description?: string;
  estimated_duration: number;
  importance: number;
  status?: MissionStatus;
  scheduled_date: string;
  scheduled_time?: string;
  priority?: number;
  tags?: string[];
  category_id?: string;
}

export interface UpdateMissionData extends Partial<CreateMissionData> {
  id: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string; // hex color
  icon?: string; // nom de l'icône
  created_at: string;
}

export interface UserStats {
  total_missions: number;
  completed_missions: number;
  pending_missions: number;
  total_duration: number; // en minutes
  avg_importance: number;
}