import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Styles/ActiveBetsPage.css';

function ActiveBetsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [latestGameResult, setLatestGameResult] = useState(null);
  
  // Spillerdata fra Game.js sendt via location.state
  const players = location.state ? location.state.players : [];

  // Fetch the latest game result when the component loads
  useEffect(() => {
    const fetchLatestGameResult = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/latest-game-result');
        if (!response.ok) {
          throw new Error('Failed to fetch the latest game result');
        }
        const result = await response.json();
        setLatestGameResult(result);
      } catch (error) {
        console.error('Error fetching the latest game result:', error);
      }
    };

    fetchLatestGameResult();
  }, []);

  // Function to start the game
  const startGame = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/start-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ players: players })
      });
      const result = await response.json();
      if (result.gameResult) {
        setLatestGameResult(result.gameResult);
      } else {
        alert('There was a problem starting the game.');
      }
    } catch (error) {
      console.error('Error starting the game:', error);
      alert('Could not start the game.');
    }
  };

  return (
    <div className="active-bets-container">
      <h1>Aktive Bets</h1>
      <button onClick={startGame} className="start-game-button">Start spil</button>
      <table className="active-bets-table">
        <thead>
          <tr>
            <th>Spiller</th>
            <th>Bet</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>{player.name}</td>
              <td>{player.currentBet ? `${player.currentBet.betType} - ${player.currentBet.betAmount}` : 'No active bets'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {latestGameResult && (
        <div className="latest-game-result">
          <h2>Latest Game Result:</h2>
          <p>Winner: {latestGameResult.vinder}</p>
        </div>
      )}
    </div>
  );
}

export default ActiveBetsPage;
