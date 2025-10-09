import { createContext, useContext } from 'react';
import { ParametersContextType } from './ParametersProvider';

export const ParametersContext = createContext<ParametersContextType | undefined>(undefined);
export const useParameters = (): ParametersContextType => {
  const context = useContext(ParametersContext);

  if (!context) {
    throw new Error('useParameters must be used within a ParametersProvider');
  }
  return context;
};
