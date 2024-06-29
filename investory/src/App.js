import './App.css';
import Holding from './modules/Holding/Holding';
import { Watchlist } from './modules/WatchList/watchlist';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/" element={<Holding />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
