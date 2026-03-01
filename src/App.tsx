// src/App.tsx
import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import HelpPage from "./pages/Help";
import ChangelogPage from "./pages/Changelog";
import { config } from './config/env';


const App = () => {
  return (
    <Routes>
      <Route path={`/${config.BASE_URL}`} element={<LandingPage />} />
      <Route path={`/${config.BASE_URL}help`} element={<HelpPage />} />
      <Route path={`/${config.BASE_URL}changelog`} element={<ChangelogPage />} />
    </Routes>
  );
};

export default App;