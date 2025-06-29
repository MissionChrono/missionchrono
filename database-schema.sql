-- Structure de base de données pour MissionChrono
-- À exécuter dans l'éditeur SQL de Supabase

-- Table des missions
CREATE TABLE IF NOT EXISTS missions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_duration INTEGER NOT NULL CHECK (estimated_duration > 0), -- en minutes
    importance INTEGER NOT NULL CHECK (importance >= 1 AND importance <= 5),
    status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME, -- optionnel, pour les missions avec heure précise
    priority INTEGER DEFAULT 0, -- pour l'ordre d'affichage
    tags TEXT[], -- tableau de tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_missions_user_id ON missions(user_id);
CREATE INDEX IF NOT EXISTS idx_missions_scheduled_date ON missions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_missions_importance ON missions(importance);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour missions
CREATE TRIGGER update_missions_updated_at 
    BEFORE UPDATE ON missions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Sécurité par utilisateur
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

-- Politique : un utilisateur ne peut voir que ses propres missions
CREATE POLICY "Users can view own missions" ON missions
    FOR SELECT USING (auth.uid() = user_id);

-- Politique : un utilisateur ne peut créer que ses propres missions
CREATE POLICY "Users can insert own missions" ON missions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique : un utilisateur ne peut modifier que ses propres missions
CREATE POLICY "Users can update own missions" ON missions
    FOR UPDATE USING (auth.uid() = user_id);

-- Politique : un utilisateur ne peut supprimer que ses propres missions
CREATE POLICY "Users can delete own missions" ON missions
    FOR DELETE USING (auth.uid() = user_id);

-- Table des catégories (optionnel)
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6', -- couleur hex
    icon VARCHAR(50), -- nom de l'icône
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour catégories
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);

-- RLS pour catégories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own categories" ON categories
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" ON categories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON categories
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON categories
    FOR DELETE USING (auth.uid() = user_id);

-- Ajouter une colonne category_id à missions (optionnel)
ALTER TABLE missions ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Fonction pour obtenir les statistiques d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
    total_missions BIGINT,
    completed_missions BIGINT,
    pending_missions BIGINT,
    total_duration INTEGER,
    avg_importance NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_missions,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_missions,
        COUNT(*) FILTER (WHERE status IN ('todo', 'in_progress')) as pending_missions,
        COALESCE(SUM(estimated_duration), 0) as total_duration,
        COALESCE(AVG(importance), 0) as avg_importance
    FROM missions 
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Données de test (optionnel)
INSERT INTO categories (user_id, name, color, icon) VALUES 
    (auth.uid(), 'Travail', '#EF4444', 'briefcase'),
    (auth.uid(), 'Personnel', '#10B981', 'user'),
    (auth.uid(), 'Santé', '#F59E0B', 'heart'),
    (auth.uid(), 'Apprentissage', '#8B5CF6', 'book')
ON CONFLICT DO NOTHING; 