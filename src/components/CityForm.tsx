import { useState } from 'react';
import { useTranslation } from 'react-i18next'; 

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
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Ajouter des villes</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Entrez le nom de la ville"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <button
            type="button"
            onClick={handleAddCity}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Ajouter
          </button>
        </div>

        {cities.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">Villes sélectionnées</h3>
            <ul className="flex flex-wrap gap-2 mb-4">
              {cities.map((city) => (
                <li key={city} className="inline-flex items-center bg-blue-50 dark:bg-blue-900 px-4 py-2 rounded-full">
                  <span className="text-blue-800 dark:text-blue-300">{city}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCity(city)}
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={cities.length < 2}
          className={`w-full px-6 py-3 rounded-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
            cities.length >= 2
              ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              : 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
          }`}
        >
          Valider les villes
        </button>
      </form>
    </div>

  );
}