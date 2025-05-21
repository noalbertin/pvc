export function solveTSP(cities: string[], distances: number[][]) {
  const n = cities.length;
  if (n < 2) {
    throw new Error("At least 2 cities required");
  }

  const size = 1 << n;
  const dp: number[][] = Array.from({ length: size }, () => Array(n).fill(Infinity));
  const parent: number[][] = Array.from({ length: size }, () => Array(n).fill(-1));

  // Correct initialization: start at city 0 with cost 0
  dp[1 << 0][0] = 0;

  // Base case: paths from city 0 to other cities
  for (let j = 1; j < n; j++) {
    const mask = (1 << 0) | (1 << j);
    dp[mask][j] = distances[0][j];
    parent[mask][j] = 0;
  }

  // Process subsets in increasing order of size
  for (let subset = 0; subset < size; subset++) {
    if ((subset & (1 << 0)) === 0) continue; // Must include starting city

    for (let last = 0; last < n; last++) {
      if ((subset & (1 << last)) === 0) continue;

      const prevSubset = subset ^ (1 << last);
      if (prevSubset === 0) continue;

      for (let k = 0; k < n; k++) {
        if ((prevSubset & (1 << k)) === 0) continue;

        const newDist = dp[prevSubset][k] + distances[k][last];
        if (newDist < dp[subset][last]) {
          dp[subset][last] = newDist;
          parent[subset][last] = k;
        }
      }
    }
  }

  // Find optimal return path
  let minDistance = Infinity;
  let lastCity = -1;
  const fullSet = (1 << n) - 1;

  for (let j = 1; j < n; j++) {
    const tourDist = dp[fullSet][j] + distances[j][0];
    if (tourDist < minDistance) {
      minDistance = tourDist;
      lastCity = j;
    }
  }

  // Reconstruct path
  const pathIndices: number[] = [];
  let current = lastCity;
  let subset = fullSet;

  while (current !== -1) {
    pathIndices.push(current);
    const prev = parent[subset][current];
    subset ^= (1 << current);
    current = prev;
  }

  pathIndices.reverse();
  const path = pathIndices.map(i => cities[i]);
  path.push(cities[0]); // Complete the cycle

  return {
    path,
    distance: minDistance,
  };
}