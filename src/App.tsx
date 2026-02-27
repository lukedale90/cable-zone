// src/App.tsx
import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import HelpPage from "./pages/Help";
import ChangelogPage from "./pages/Changelog";


const App = () => {
  return (
    <Routes>
      <Route path={`/${import.meta.env.VITE_BASE_URL}`} element={<LandingPage />} />
      <Route path={`/${import.meta.env.VITE_BASE_URL}help`} element={<HelpPage />} />
      <Route path={`/${import.meta.env.VITE_BASE_URL}changelog`} element={<ChangelogPage />} />
    </Routes>
  );
};

export default App;