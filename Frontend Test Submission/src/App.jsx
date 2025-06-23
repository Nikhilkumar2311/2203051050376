import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShortenerPage from "./pages/ShortenerPage.jsx";
import StatsPage from "./pages/StatsPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShortenerPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
