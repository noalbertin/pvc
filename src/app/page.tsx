'use client'
import { useState } from 'react';
import CityForm from '../components/CityForm';
import DistanceMatrix from '../components/DistanceMatrix';
import Result from '../components/Result';
import Graph from '../components/Graph';
import { solveTSP } from '@/lib/tsp';
import About from '@/components/About';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next'


export default function Home() {
  const [cities, setCities] = useState<string[]>([]);
  const [distances, setDistances] = useState<number[][]>([]);
  const [solution, setSolution] = useState<{ path: string[]; distance: number } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { t } = useTranslation()

  const handleCitiesSubmit = (newCities: string[]) => {
    setCities(newCities);
    // Initialize distance matrix with zeros
    setDistances(new Array(newCities.length).fill(0).map(() => new Array(newCities.length).fill(0)));
    setSolution(null);
  };

  const handleDistancesSubmit = (newDistances: number[][]) => {
    setDistances(newDistances);
    // Calculate solution
    const solution = solveTSP(cities, newDistances);
    setSolution(solution);
  };

const getGraphData = () => {
  if (!cities.length || !solution) return { nodes: [], links: [], shortestPathLinks: [] };

  const nodes = cities.map((city) => ({
    id: city,
    name: city,
  }));

  // Crée tous les liens possibles
 const allLinks = [];
  for (let i = 0; i < cities.length; i++) {
    for (let j = i + 1; j < cities.length; j++) {
      allLinks.push({
        source: cities[i],
        target: cities[j],
        distance: distances[i][j],
      });
    }
  }


  // Crée les liens du chemin optimal
  const shortestPathLinks = [];
  for (let i = 0; i < solution.path.length - 1; i++) {
    const source = solution.path[i];
    const target = solution.path[i + 1];
    shortestPathLinks.push({
      source,
      target,
      distance: distances[cities.indexOf(source)][cities.indexOf(target)]
    });
  }

  return { 
    nodes, 
    links: allLinks,
    shortestPathLinks
  };
};

  const { nodes, links, shortestPathLinks } = getGraphData(); 


 const handleRefresh = () => {
  setIsRefreshing(true);
  setCities([]);
  setDistances([]);
  setTimeout(() => {
    setIsRefreshing(false);
  }, 1000);
  setSolution(null);
};

  

  return (
   <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        
        <main className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <CityForm onSubmit={handleCitiesSubmit} cities={cities} />

              {cities.length > 0 && (
                <DistanceMatrix
                  cities={cities}
                  distances={distances}
                  onSubmit={handleDistancesSubmit}
                />
              )}
            </div>

            {solution && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                    {t('Title')}
                  </h2>

                  <div className="mb-6">
                    <Result solution={solution} />
                  </div>

                  <div className="relative h-[500px] rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                    <div className="absolute inset-0 p-4">
                      <Graph
                        nodes={nodes}
                        links={links}
                        shortestPath={solution.path}
                        shortestPathLinks={shortestPathLinks}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <About />
        <Footer />
      </div>
    </div>

  );
}