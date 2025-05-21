import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { FiRefreshCw } from 'react-icons/fi';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function Header({ onRefresh, isRefreshing }: HeaderProps) {
  return (
    <div className="sticky top-0 z-10 backdrop-blur-md border-b border-gray-200 dark:border-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-row items-center justify-between gap-3">
          {/* Titre principal */}
          <div className="flex items-start flex-col md:block">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Problème du Voyageur de Commerce
              </span>
            </h1>
            <p className="hidden md:block mt-1 text-sm text-gray-500">
              Optimisation de parcours entre villes
            </p>
          </div>

          {/* Autres contrôles */}
          <div className="flex items-center gap-2">
            <button
                onClick={onRefresh}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors text-gray-700"
                title="Actualiser"
                aria-label="Refresh"
            >
              <FiRefreshCw className={`h-5 w-5 text-blue-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
