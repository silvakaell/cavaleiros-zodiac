// LanguageContext.jsx
// Context que distribui o idioma atual e a função para trocá-lo.

import { createContext, useContext, useState } from "react";

export const LanguageContext = createContext({ lang: "pt", setLang: () => {} });

// Hook de conveniência
export function useLanguage() {
  return useContext(LanguageContext);
}

// Provider — envolve o App
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("pt");
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
