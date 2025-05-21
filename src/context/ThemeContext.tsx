'use client'

import { createContext, useState, ReactNode, useEffect } from "react";
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
};
export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {}
});
interface ThemeContextProviderProps {
  children: ReactNode;
};

const ThemeContextProvider = ({ children }: ThemeContextProviderProps) => {
  // 1. Initialisation avec vérification du localStorage et de la préférence système
  const [theme, setTheme] = useState<string>(() => {
    // Vérifie d'abord le localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      
      // Sinon, vérifie la préférence système
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light'; // Valeur par défaut
  });

  const [ripple, setRipple] = useState<{
    x: number;
    y: number;
    type: 'expand' | 'contract';
  } | null>(null);

  // 2. Effet pour appliquer le thème au chargement et quand il change
  useEffect(() => {
    const html = document.documentElement;
    
    // Supprime les classes existantes
    html.classList.remove('light', 'dark');
    
    // Ajoute la classe active
    html.classList.add(theme);
    
    // Sauvegarde dans localStorage
    localStorage.setItem('theme', theme);
    
    // Optionnel: Met à jour l'attribut pour les iframes ou autres besoins
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    const themeButton = document.getElementById('theme-button');

    if (themeButton) {
      const rect = themeButton.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      setRipple({ x, y, type: nextTheme === 'dark' ? 'expand' : 'contract' });

      setTimeout(() => {
        setTheme(nextTheme);
      }, 100);
    }
  };

  return (
    <>
      {ripple && (
        <div
          className={`theme-ripple ${ripple.type}`}
          style={{
            top: ripple.y,
            left: ripple.x,
          }}
        />
      )}
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </>
  );
};

export default ThemeContextProvider;