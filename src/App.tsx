import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ClubDetail from './pages/ClubDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/club/:id" element={<ClubDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
