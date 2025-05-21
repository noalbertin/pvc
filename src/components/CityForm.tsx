import { useState } from 'react';

interface CityFormProps {
  onSubmit: (cities: string[]) => void;
  cities: string[]; 
}

export default function CityForm({ onSubmit, cities }: CityFormProps) {
  const [cityInput, setCityInput] = useState('');

  const handleAddCity = () => {
    if (cityInput.trim() && !cities.includes(cityInput.trim())) {
      const newCities = [...cities, cityInput.trim()];
      onSubmit(newCities); // Mettez à jour le parent directement
      setCityInput('');
    }
  };

  const handleRemoveCity = (cityToRemove: string) => {
    const newCities = cities.filter(city => city !== cityToRemove);
    onSubmit(newCities); // Mettez à jour le parent
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cities.length >= 2) {
      onSubmit(cities);
    } else {
      alert('Veuillez ajouter au moins 2 villes');
    }
  };

  return (
   <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Gestion des Villes
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Nom de la ville"
              className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <button
              type="button"
              onClick={handleAddCity}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Ajouter
            </button>
          </div>

          {cities.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Villes sélectionnées ({cities.length})
              </h3>
              <ul className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <li key={city} className="inline-flex items-center bg-blue-50/50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 px-3 py-1 rounded-lg text-sm">
                    <span className="text-blue-700 dark:text-blue-300">{city}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCity(city)}
                      className="ml-2 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={cities.length < 2}
            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              cities.length >= 2
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            Valider les villes
          </button>
        </form>
      </div>
    </div>

  );
}