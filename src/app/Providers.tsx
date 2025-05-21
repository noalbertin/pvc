
'use client';

import I18nProvider from "@/components/I18nProvider";
import ThemeContextProvider from "@/context/ThemeContext";


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContextProvider>
      <I18nProvider>
        {children}
      </I18nProvider>
    </ThemeContextProvider>
  );
}
