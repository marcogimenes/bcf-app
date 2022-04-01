import React, { createContext, useState, useContext } from 'react';

const IntegracaoContext = createContext();

export default function IntegracaoProvider({ children }) {
  const [contextData, setContext] = useState({
    base: null,
    unidades: [],
    setores: [],
    postos: [],
    unidadeSelected: null,
    setorSelected: null,
    postoSelected: null,
  });

  return (
    <IntegracaoContext.Provider
      value={{
        contextData,
        setContext,
      }}>
      {children}
    </IntegracaoContext.Provider>
  );
}

export function useIntegracao() {
  const context = useContext(IntegracaoContext);
  if (!context) throw new Error('useIntegracao must be used within a IntegrcaoProvider');
  return context;
}
