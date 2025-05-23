'use client'
import { useState, useRef } from 'react';
import CityForm from '../components/CityForm';
import DistanceMatrix from '../components/DistanceMatrix';
import Result from '../components/Result';
import Graph from '../components/Graph';
import { solveTSP } from '@/lib/tsp';
import About from '@/components/About';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next'
import CardExpliquer from '@/components/CardExpliquer';
import { motion, AnimatePresence } from "framer-motion";
import { PdfDocument } from '@/components/PdfReport';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver'; 
import { toPng } from 'html-to-image';
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

  const { nodes, links } = getGraphData(); 


 const handleRefresh = () => {
  setIsRefreshing(true);
  setCities([]);
  setDistances([]);
  setTimeout(() => {
    setIsRefreshing(false);
  }, 1000);
  setSolution(null);
};
// Animations
const cardAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};
const graphRef = useRef<HTMLDivElement>(null);

const handleGeneratePdf = async () => {
  try {
    if (!solution) {
      console.error("Solution is null, cannot generate PDF.");
      return;
    }

    if (graphRef.current) {
      await new Promise(resolve => setTimeout(resolve, 500));

      const dataUrl = await toPng(graphRef.current, {
        quality: 1,
        cacheBust: true,
      });

      const blob = await pdf(
        <PdfDocument 
          solution={solution} 
          graphImage={dataUrl} 
          matrix={distances}
        />
      ).toBlob();

      saveAs(blob, 'resultat.pdf');
    }
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header 
          onRefresh={handleRefresh} 
          isRefreshing={isRefreshing} 
          onGeneratePdf={handleGeneratePdf} 
          solution={solution}
        />

        <main className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Colonne gauche */}
            <motion.div 
              className="space-y-8"
              variants={containerAnimation}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={itemAnimation}>
                <CityForm onSubmit={handleCitiesSubmit} cities={cities} />
              </motion.div>

              <AnimatePresence>
                {solution && (
                  <motion.div
                    variants={itemAnimation}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <DistanceMatrix
                      cities={cities}
                      distances={distances}
                      onSubmit={handleDistancesSubmit}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {cities.length > 0 && (
                  <motion.div
                    variants={itemAnimation}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <CardExpliquer />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Colonne droite */}
            <motion.div 
              className="space-y-8"
              variants={containerAnimation}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence mode="wait">
                {cities.length === 0 ? (
                  <motion.div
                    key="empty-state"
                    {...cardAnimation}
                    className="h-full flex items-center justify-center"
                  >
                    <CardExpliquer />
                  </motion.div>
                ) : !solution ? (
                  <motion.div
                    key="distance-matrix"
                    {...cardAnimation}
                  >
                    <DistanceMatrix
                      cities={cities}
                      distances={distances}
                      onSubmit={handleDistancesSubmit}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="solution"
                    {...cardAnimation}
                    className="flex-1 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-[#0c343d] dark:via-cyan-900/40 dark:to-[#082f49] dark:border-cyan-800/60 rounded-xl shadow border border-cyan-100 dark:border-gray-600 overflow-hidden" >
                    <div className="p-6">
                      <motion.h2 
                        className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {t('Title')}
                      </motion.h2>

                      <motion.div 
                        className="mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Result solution={solution} />
                      </motion.div>

                      <motion.div 
                        className="relative h-[500px] rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="absolute inset-0 p-4" ref={graphRef}>
                          <Graph
                            nodes={nodes}
                            links={links}
                            shortestPath={solution.path} 
                            
                          />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </main>

        <About />
        <Footer />
      </div>
    </div>

  );
}