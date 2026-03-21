import { config } from '../config/env';

export const generateManifest = () => {
  const baseUrl = config.BASE_URL || '/cable-zone/';
  
  return {
    name: "Strop Drop Visualiser",
    short_name: "Strop Drop",
    description: "Calculate and visualize strop drop zones for glider winch launches",
    start_url: baseUrl,
    display: "standalone",
    background_color: "#212121",
    theme_color: "#212121",
    orientation: "portrait-primary",
    scope: baseUrl,
    icons: [
      {
        src: `${baseUrl}icon-180.png`,
        sizes: "180x180",
        type: "image/png",
        purpose: "any"
      },
      {
        src: `${baseUrl}icon-192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: `${baseUrl}icon-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: `${baseUrl}weaklink-icon.svg`,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      }
    ],
    categories: ["productivity", "utilities"],
    screenshots: []
  };
};
