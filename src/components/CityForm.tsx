import { useState } from 'react';
import { useTranslation } from 'react-i18next'

interface CityFormProps {
  onSubmit: (cities: string[]) => void;
  cities: string[];
  onSelectStart: (city: string) => void; // Nouvelle prop
  selectedStart: string; // Nouvelle prop
}

export default function CityForm({ onSubmit, 
  cities, 
  onSelectStart,
  selectedStart  
}: CityFormProps) 
{
  const [cityInput, setCityInput] = useState('');
  const { t } = useTranslation()

  const handleAddCity = () => {
    if (cityInput.trim() && !cities.includes(cityInput.trim())) {
      const newCities = [...cities, cityInput.trim()];
      onSubmit(newCities); 
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
    <div className="flex-1 bg-gradient-to-br from-green-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-600 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {t('city.title')}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder={t('city.name')}
              className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <button
              type="button"
              onClick={handleAddCity}
              className="w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
               {t('city.bouton')}
            </button>
            
          </div>

          {cities.length > 0 && (
            <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('city.ville')} ({cities.length})
            </h3>
            <ul className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <li 
                  key={city} 
                  className={
                    `inline-flex items-center border px-3 py-1 rounded-lg text-sm cursor-pointer
                    ${city === selectedStart 
                      ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                      : 'bg-blue-50/50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                    }`
                  }
                  onClick={() => onSelectStart(city)}
                >
                  <span>{city}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCity(city);
                    }}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          )}
          {cities.length > 0 && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('city.start')}: <span className="font-medium text-green-600 dark:text-green-400">
                {selectedStart}
              </span>
            </p>
          )}


          

        </form>
      </div>
    </div>

  );
}