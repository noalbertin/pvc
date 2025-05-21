import { useState, useEffect } from 'react';

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
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Matrice des distances</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"></th>
                {cities.map((city) => (
                  <th
                    key={city}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {city}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {cities.map((city, row) => (
                <tr key={city} className={row % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {city}
                  </td>
                  {cities.map((_, col) => (
                    <td key={col} className="px-6 py-4 whitespace-nowrap">
                       <input
                        type="number"
                        min="0"
                        value={matrix[row]?.[col] ?? 0} 
                        onChange={(e) => handleDistanceChange(row, col, e.target.value)}
                        className={`w-20 px-3 py-2 border rounded-md text-center focus:ring-2 focus:outline-none ${
                          row === col
                            ? 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600'
                            : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500'
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
          className="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
        >
          Calculer le parcours optimal
        </button>
      </form>
    </div>

  );
}