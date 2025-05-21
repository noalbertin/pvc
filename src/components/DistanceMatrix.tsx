import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'

interface DistanceMatrixProps {
  cities: string[];
  distances: number[][];
  onSubmit: (distances: number[][]) => void;
}

export default function DistanceMatrix({ cities, distances, onSubmit }: DistanceMatrixProps) {
  const [matrix, setMatrix] = useState<number[][]>(() => 
    cities.length > 0 
      ? distances 
      : []
  );
  const { t } = useTranslation()

 useEffect(() => {
    if (cities.length > 0) {
      const newMatrix = Array(cities.length).fill(0)
        .map((_, i) => 
          Array(cities.length).fill(0)
            .map((_, j) => distances[i]?.[j] || 0)
        );
      setMatrix(newMatrix);
    } else {
      setMatrix([]);
    }
  }, [cities, distances]);

   const handleDistanceChange = (row: number, col: number, value: string) => {
    const newMatrix = matrix.map(row => [...row]); // Copie profonde
    const numValue = Math.max(0, parseInt(value) || 0);
    
    newMatrix[row][col] = numValue;
    
    if (row !== col) {
      newMatrix[col][row] = numValue;
    }
    
    setMatrix(newMatrix);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(matrix);
  };

  return (
   <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
           {t('distanceMatrix.title')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
                  {cities.map((city) => (
                    <th
                      key={city}
                      className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate max-w-[100px]"
                    >
                      {city}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {cities.map((city, row) => (
                  <tr key={city}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                      {city}
                    </td>
                    {cities.map((_, col) => (
                      <td key={col} className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          value={matrix[row]?.[col] ?? 0}
                          onChange={(e) => handleDistanceChange(row, col, e.target.value)}
                          className={`w-16 px-2 py-1 text-sm border rounded text-center focus:ring-1 focus:outline-none ${
                            row === col
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500'
                          }`}
                          disabled={row === col}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {t('distanceMatrix.calcul')}
          </button>
        </form>
      </div>
    </div>

  );
}