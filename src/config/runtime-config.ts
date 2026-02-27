// src/config/runtime-config.ts
const isProduction = window.location.hostname.includes('github.io');
const isDevelopment = window.location.hostname === 'localhost';

export const runtimeConfig = {
  APP_NAME: "Strop Drop",
  APP_DESCRIPTION: "The Drop-Zone Visualiser",
  APP_VERSION: "1.1",
  APP_ORGANIZATION: "2fts",
  ENABLE_ADVANCED_FEATURES: true,
  DEFAULT_LANGUAGE: "en",
  BASE_URL: isProduction ? "/cable-zone" : "",
  CLOUDFLARE_TOKEN: isProduction 
    ? "" // Set this via GitHub Actions
    : import.meta.env.VITE_CLOUDFLARE_TOKEN || "",
} as const;
