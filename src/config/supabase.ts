import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced validation and error handling
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is not defined in environment variables');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is not defined in environment variables');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid VITE_SUPABASE_URL format: ${supabaseUrl}`);
}

// Add error handling and logging for debugging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);
console.log('Supabase Key length:', supabaseAnonKey.length);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    },
    fetch: (url, options = {}) => {
      // Custom fetch with enhanced error handling for Netlify
      const enhancedOptions = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          ...options.headers,
        },
        mode: 'cors' as RequestMode,
        credentials: 'omit' as RequestCredentials,
      };

      console.log('Supabase fetch request:', { url, options: enhancedOptions });

      return fetch(url, enhancedOptions)
        .then(response => {
          console.log('Supabase fetch response:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          return response;
        })
        .catch(error => {
          console.error('Supabase fetch error:', error);
          
          // Enhanced error messages for common Netlify issues
          if (error.message.includes('Failed to fetch')) {
            throw new Error('Connexion impossible à Supabase. Vérifiez votre connexion internet et les variables d\'environnement.');
          }
          
          if (error.message.includes('CORS')) {
            throw new Error('Erreur CORS. Vérifiez la configuration des domaines autorisés dans Supabase.');
          }
          
          throw error;
        });
    }
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});

export type Database = {
  public: {
    Tables: {
      missions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          estimated_duration: number;
          importance: number;
          status: 'todo' | 'in_progress' | 'completed';
          scheduled_date: string;
          scheduled_time: string | null;
          priority: number | null;
          tags: string[] | null;
          category_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          estimated_duration: number;
          importance: number;
          status?: 'todo' | 'in_progress' | 'completed';
          scheduled_date: string;
          scheduled_time?: string | null;
          priority?: number | null;
          tags?: string[] | null;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          estimated_duration?: number;
          importance?: number;
          status?: 'todo' | 'in_progress' | 'completed';
          scheduled_date?: string;
          scheduled_time?: string | null;
          priority?: number | null;
          tags?: string[] | null;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          icon?: string | null;
          created_at?: string;
        };
      };
    };
    Functions: {
      get_user_stats: {
        Args: {
          user_uuid: string;
        };
        Returns: {
          total_missions: number;
          completed_missions: number;
          pending_missions: number;
          total_duration: number;
          avg_importance: number;
        }[];
      };
    };
  };
};