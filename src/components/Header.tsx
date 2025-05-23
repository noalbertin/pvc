import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { FiRefreshCw } from 'react-icons/fi';
import { TbFileTypePdf } from "react-icons/tb";
import { useTranslation } from 'react-i18next'

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
  onGeneratePdf: () => void;
  solution: { path: string[]; distance: number } | null;
}


export default function Header({ onRefresh, isRefreshing, onGeneratePdf, solution }: HeaderProps) {

  const { t } = useTranslation()
  return (
    <div className="sticky top-0 z-10 backdrop-blur-md border-b border-gray-200 dark:border-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-row items-center justify-between gap-3">
          {/* Titre principal */}
          <div className="flex items-start flex-col md:block">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                {t('Header.title')}
              </span>
            </h1>
            <p className="hidden md:block mt-1 text-sm text-gray-500">
              {t('Header.soustitle')}
            </p>
          </div>

          {/* Autres contrôles */}
          <div className="flex items-center gap-2">
            {solution && (
              <button
                onClick={onGeneratePdf}
                className="p-2 rounded-full bg-gray-200 text-center dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title={t('Header.generatePdf')}
                aria-label="Generate PDF"
              >
                <TbFileTypePdf className="h-5 w-5 text-red-500 dark:text-red-400" />
              </button>
            )}

            
            <button
                onClick={onRefresh}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors text-gray-700"
                title={t('refresh')}
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