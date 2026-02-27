// src/App.tsx
import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";


const HelpPage = () => <div>This is a new page!</div>;

const App = () => {
  return (
    <Routes>
      <Route path={`/${import.meta.env.VITE_BASE_URL}`} element={<LandingPage />} />
      <Route path={`/${import.meta.env.VITE_BASE_URL}help`} element={<HelpPage />} />
    </Routes>
  );
};

export default App;