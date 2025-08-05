// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import VehicleMakePage from './pages/VehicleMakePage';
import VehicleModelPage from './pages/VehicleModelPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<VehicleMakePage />} />
            <Route path="/makes" element={<VehicleMakePage />} />
            <Route path="/models" element={<VehicleModelPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
