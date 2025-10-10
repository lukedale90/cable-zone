import React, { useState, type ReactNode } from 'react';
import { ParametersContext } from './ParametersContext';

export interface ParametersProviderProps {
  children: ReactNode;
}

export interface Parameters {
  viewLocation: { lat: number; lng: number };
  winchLocation: { lat: number; lng: number };
  launchPoint: { lat: number; lng: number };
  cableLength: number;
  stropWeight: number;
  stropLength: number;
  stropDiameter: number;
  cableWeight: number;
  releaseHeight: number;
  surfaceWind: { speed: number; direction: number };
  twoThousandFtWind: { speed: number; direction: number };
}

export interface ParametersContextType {
  parameters: Parameters;
  setParameters: React.Dispatch<React.SetStateAction<Parameters>>;
}

export const ParametersProvider: React.FC<ParametersProviderProps> = ({ children }) => {
  const [parameters, setParameters] = useState<Parameters>({
    viewLocation: { lat: 53.0425, lng: -0.496 }, // Default location
    winchLocation: { lat: 53.040309945932215, lng: -0.5006074905395509 },
    launchPoint: { lat: 53.0443, lng: -0.485 },
    cableLength: 1100, // in meters
    stropWeight: 1.5, // in kilograms
    stropLength: 3, // in meters
    stropDiameter: 0.005, // in meters
    cableWeight: 50, // in kilograms
    releaseHeight: 2000, // in feet
    surfaceWind: { speed: 18, direction: 280 }, // speed in knots, direction in degrees
    twoThousandFtWind: { speed: 30, direction: 310 }, // speed in knots, direction in degrees
  });

  return (
    <ParametersContext.Provider value={{ parameters, setParameters }}>
      {children}
    </ParametersContext.Provider>
  );
};
