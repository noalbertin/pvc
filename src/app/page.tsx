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


export default function Home() {
  const [cities, setCities] = useState<string[]>([]);
  const [distances, setDistances] = useState<number[][]>([]);
  const [solution, setSolution] = useState<{ path: string[]; distance: number } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);





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
    shortestPathLinks // Bien retourner cette propriété
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-2">
          <div className="space-y-6">
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
            <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Visualisation du Parcours
              </h2>

              {/* Section Résultats */}
              <div className="mb-8">
                <Result solution={solution} />
              </div>

              {/* Section Graphique */}
              <div className="h-96 border-2 border-gray-100 dark:border-slate-700 rounded-lg">
                <Graph
                  nodes={nodes}
                  links={links}
                  shortestPath={solution.path}
                  shortestPathLinks={shortestPathLinks} // Ajoutez cette prop
                />
              </div>
            </div>
          )}
        </div>
        <About />
        <Footer/>
      </div>
    </div>

  );
}