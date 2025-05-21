import React from "react";
import { useTranslation } from 'react-i18next'

interface ResultProps {
  solution: {
    path: string[];
    distance: number;
  };
}

export default function Result({ solution }: ResultProps) {
  const { t } = useTranslation()
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('result.title')}</h3>
          <div className="flex items-center flex-wrap gap-1">
            {solution.path.map((city, index) => (
              <React.Fragment key={index}>
                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-md text-sm">
                  {city}
                </span>
                {index < solution.path.length - 1 && (
                  <svg
                    className="h-4 w-4 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-green-600 rounded-lg px-4 py-3 min-w-[140px]">
          <h3 className="text-xs font-medium text-white">{t('result.total')}</h3>
          <p className="text-lg font-semibold text-blue-300">
            {solution.distance} <span className="text-sm font-normal text-white">{t('result.unite')}</span>
          </p>
        </div>
      </div>
    </div>

  );
}