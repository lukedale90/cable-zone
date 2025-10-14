import React, { useState, type ReactNode } from "react";
import { ParametersContext } from "./ParametersContext";

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
  safetyBuffer: number;
  releaseHeight: number;
  surfaceWind: { speed: number; direction: number };
  twoThousandFtWind: { speed: number; direction: number };
  customLaunchProfile: number[];
  theroreticalMaxHeight: number;
  crossWindComponent: number;
  headWindComponent: number;
  RWYHeading: number;
}

export interface ParametersContextType {
  parameters: Parameters;
  setParameters: React.Dispatch<React.SetStateAction<Parameters>>;
  resetStropParameters: () => void;
}

const defaultParameters = {
  viewLocation: { lat: 53.0425, lng: -0.496 }, // Default location
  winchLocation: { lat: 53.040309945932215, lng: -0.5006074905395509 },
  launchPoint: { lat: 53.0443, lng: -0.485 },
  surfaceWind: { speed: 18, direction: 280 },
  twoThousandFtWind: { speed: 30, direction: 310 },
  releaseHeight: 1700,
  cableLength: 1100,
  safetyBuffer: 25, //as percentage
  cableWeight: 0.5, //not used
  customLaunchProfile: [],
  theroreticalMaxHeight: 1800,
  crossWindComponent: 0,
  headWindComponent: 0,
  RWYHeading: 247,
};

const defaultStrop = {
  stropLength: 3,
  stropDiameter: 0.03,
  stropWeight: 1.5,
};

export const ParametersProvider: React.FC<ParametersProviderProps> = ({
  children,
}) => {
  const [parameters, setParameters] = useState<Parameters>({
    ...defaultParameters,
    ...defaultStrop,
  });

  const resetStropParameters = () => {
    setParameters((prev) => ({ ...prev, ...defaultStrop }));
  };

  return (
    <ParametersContext.Provider
      value={{ parameters, setParameters, resetStropParameters }}>
      {children}
    </ParametersContext.Provider>
  );
};
