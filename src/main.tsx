import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.tsx'
import { config } from './config/env';

document.title = config.APP_NAME || "Default Title";

// Inject Cloudflare token dynamically
const cloudflareScript = document.querySelector(
  'script[data-cf-beacon]'
) as HTMLScriptElement;
if (cloudflareScript) {
  cloudflareScript.setAttribute(
    "data-cf-beacon",
    JSON.stringify({
      token: config.CLOUDFLARE_TOKEN || "default-token",
    })
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </StrictMode>,
)
