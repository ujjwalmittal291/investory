import './App.css';
import Dashboard from './modules/Dashboard/Dashboard';
import Holding from './modules/Holding/Holding';
import Watchlist from './modules/WatchList/watchlist';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/holding" element={<Holding />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
