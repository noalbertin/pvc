import React from "react";
interface ResultProps {
  solution: {
    path: string[];
    distance: number;
  };
}

export default function Result({ solution }: ResultProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-blue-50 dark:bg-slate-800 p-4 rounded-lg">
        <div>
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-1">Parcours optimal</h3>
          <div className="flex items-center space-x-2 flex-wrap">
            {solution.path.map((city, index) => (
              <React.Fragment key={index}>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">
                  {city}
                </span>
                {index < solution.path.length - 1 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-400 dark:text-blue-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg min-w-[120px] text-center">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Distance totale</h3>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            {solution.distance} <span className="text-sm font-normal">unités</span>
          </p>
        </div>
      </div>
    </div>

  );
}