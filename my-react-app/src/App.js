import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Game from './Pages/game';
import StatisticsPage from './Pages/StatisticsPage';
import ActiveBetsPage from './Pages/ActiveBetsPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/active-bets" element={<ActiveBetsPage />} />
        <Route path="/StatisticsPage" element={<StatisticsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
