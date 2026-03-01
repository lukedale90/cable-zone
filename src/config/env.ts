// src/config/env.ts

// Detect deployment environment based on hostname
const getDeploymentConfig = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname.includes('2fts-raf.github.io')) {
      return {
        APP_NAME: "RAF Strop Drop",
        BASE_URL: "/strop-drop",
        APP_ORGANIZATION: "2fts RAF",
        // Add any other organization-specific config
      };
    }
    
    if (hostname.includes('lukedale90.github.io')) {
      return {
        APP_NAME: "Strop Drop",
        BASE_URL: "/cable-zone",
        APP_ORGANIZATION: "2fts",
      };
    }
  }
  
  // Fallback for development or unknown environments
  return {
    APP_NAME: "Strop Drop",
    BASE_URL: "",
    APP_ORGANIZATION: "2fts",
  };
};

const deploymentConfig = getDeploymentConfig();

export const config = {
  APP_NAME: import.meta.env.VITE_APP_NAME || deploymentConfig.APP_NAME,
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || "The Drop-Zone Visualiser",
  APP_VERSION: 1.1,
  APP_ORGANIZATION: import.meta.env.VITE_APP_ORGANIZATION || deploymentConfig.APP_ORGANIZATION,
  ENABLE_ADVANCED_FEATURES: import.meta.env.VITE_ENABLE_ADVANCED_FEATURES === 'true' || true,
  DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE || "en",
  BASE_URL: import.meta.env.VITE_BASE_URL || deploymentConfig.BASE_URL,
  CLOUDFLARE_TOKEN: import.meta.env.VITE_CLOUDFLARE_TOKEN || "",
  CROSSWIND_LIMIT: 11,
} as const;
