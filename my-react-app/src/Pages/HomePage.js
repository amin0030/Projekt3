import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Home.css'

function HomePage() {
  const navigate = useNavigate();

  const goToStats = () => {
    navigate('/StatisticsPage');
  };

  return (
    <div className="home-container">
      <h1>Velkommen til Russisk Roulette</h1>
      <Link to="/game" className="navigate-button start-game-button">Start Spillet</Link>
      <button onClick={goToStats} className="navigate-button view-stats-button">Vis Statistik</button>
    </div>
  );
}

export default HomePage;
