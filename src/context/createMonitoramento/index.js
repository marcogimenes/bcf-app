import React, { createContext, useState, useContext } from 'react';

const MonitoramentoContext = createContext();

export default function MonitoramentoProvider({ children }) {
  const [contextData, setContext] = useState({
    paciente: {},
    monitoramento: {},
    target: 'start',
    locais: null,
  });

  return (
    <MonitoramentoContext.Provider
      value={{
        contextData,
        setContext,
      }}>
      {children}
    </MonitoramentoContext.Provider>
  );
}

export function useMonitoramento() {
  const context = useContext(MonitoramentoContext);
  if (!context) throw new Error('useCount must be used within a CountProvider');
  const { contextData, setContext } = context;
  return { contextData, setContext };
}
