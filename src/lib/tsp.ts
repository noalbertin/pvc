export function solveTSP(cities: string[], distances: number[][]) {
  if (cities.length < 2) {
    throw new Error('At least 2 cities required');
  }

  // Nearest neighbor algorithm (greedy approach)
  const visited = new Set<number>();
  const path: string[] = [];
  let totalDistance = 0;

  // Start with the first city
  let currentCity = 0;
  path.push(cities[currentCity]);
  visited.add(currentCity);

  while (visited.size < cities.length) {
    let nearestCity = -1;
    let minDistance = Infinity;

    // Find the nearest unvisited city
    for (let i = 0; i < cities.length; i++) {
      if (!visited.has(i) && distances[currentCity][i] < minDistance) {
        minDistance = distances[currentCity][i];
        nearestCity = i;
      }
    }

    if (nearestCity === -1) {
      throw new Error('No unvisited cities found');
    }

    totalDistance += minDistance;
    currentCity = nearestCity;
    path.push(cities[currentCity]);
    visited.add(currentCity);
  }

  // Return to the starting city
  totalDistance += distances[currentCity][0];
  path.push(cities[0]);

  return {
    path,
    distance: totalDistance,
  };
}