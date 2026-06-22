import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ClubDetail from './pages/ClubDetail';

// HashRouter keeps deep links (e.g. a club page) working on GitHub Pages, which
// serves static files and has no SPA fallback for history-mode URLs.
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/club/:id" element={<ClubDetail />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
