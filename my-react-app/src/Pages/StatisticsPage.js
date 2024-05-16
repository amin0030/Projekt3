import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/StatisticsPage.css';

function StatisticsPage() {
  const [gameData, setGameData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGameData() {
      try {
        const response = await fetch('http://localhost:3000/api/game-data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Fetched Data:", data); // Debugging to see what data is being received

        setGameData(data.games);
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    }

    fetchGameData();
  }, []);

  const goToActiveBets = () => {
    navigate('/active-bets');
  };

  return (
    <div className="statistics-container">
      <h1>Game Statistics</h1>
      <button onClick={goToActiveBets} className="view-active-bets-button">View Active Bets</button>
      {gameData.length > 0 ? (
        <table className="statistics-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Drawn Number</th>
              <th>Color</th>
              <th>Winner</th>
            </tr>
          </thead>
          <tbody>
            {gameData.map((game, index) => (
              <tr key={index}>
                <td>{game.spiller}</td>
                <td>{game.tal}</td>
                <td>{game.farve}</td>
                <td>{game.vinder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No game data available.</p>
      )}
    </div>
  );
}

export default StatisticsPage;
