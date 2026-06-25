import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ClubDetail from './pages/ClubDetail';
import ActivityDetail from './pages/ActivityDetail';

// HashRouter keeps deep links (e.g. a club page) working on GitHub Pages, which
// serves static files and has no SPA fallback for history-mode URLs.
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/club/:id" element={<ClubDetail />} />
        <Route path="/activity/:id" element={<ActivityDetail />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
