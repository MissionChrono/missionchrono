import React, { useState } from 'react';
import { AuthForm } from './AuthForm';
import { Calendar, Target, Clock } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Section de présentation */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-xl">
                <Calendar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  MissionChrono
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Votre calendrier personnel de missions
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Gérez vos missions avec précision</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">Planifiez votre temps efficacement</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-purple-500" />
                <span className="text-gray-700 dark:text-gray-300">Visualisez votre planning en un coup d'œil</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Commencez dès aujourd'hui
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Rejoignez des milliers d'utilisateurs qui organisent leur vie avec MissionChrono. 
              Simple, efficace, sécurisé.
            </p>
          </div>
        </div>

        {/* Formulaire d'authentification */}
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                MissionChrono
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Votre calendrier personnel de missions
            </p>
          </div>
          
          <AuthForm mode={mode} onToggleMode={toggleMode} />
        </div>
      </div>
    </div>
  );
};