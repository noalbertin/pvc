'use client'

import { useContext } from "react"
import { ThemeContext } from "@/context/ThemeContext"
import { LuSun  } from "react-icons/lu"
import { BsFillMoonStarsFill } from "react-icons/bs";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      id="theme-button"
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden transition-colors duration-300"
      aria-label="Changer le thème"
    >
      {theme === "dark" ? (
        <LuSun className="text-blue-400 text-lg" />
      ) : (
        <BsFillMoonStarsFill className="text-blue-400 text-lg" />
      )}
    </button>
  );
};

export default ThemeToggle