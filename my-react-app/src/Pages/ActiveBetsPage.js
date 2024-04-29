import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Styles/ActiveBetsPage.css';

function ActiveBetsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [latestGameResult, setLatestGameResult] = useState(null);
  
  // Spillerdata fra Game.js sendt via location.state
  const players = location.state ? location.state.players : [];

  // Hent det seneste spilresultat, når komponenten loader
  useEffect(() => {
    const fetchLatestGameResult = async () => {
      try {
        const response = await fetch('/api/latest-game-result');
        const result = await response.json();
        setLatestGameResult(result);
      } catch (error) {
        console.error('Fejl under hentning af det seneste spilresultat:', error);
      }
    };

    fetchLatestGameResult();
  }, []);

  // Funktion til at starte spillet
  const startGame = async () => {
    // Start spillet og fetch det nye spilresultat
    try {
      const response = await fetch('/api/start-game', {
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
        alert('Der var et problem med at starte spillet.');
      }
    } catch (error) {
      console.error('Fejl ved start af spillet:', error);
      alert('Kunne ikke starte spillet.');
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
              <td>{player.currentBet ? `${player.currentBet.betType} - ${player.currentBet.betAmount}` : 'Ingen aktive bets'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {latestGameResult && (
        <div className="latest-game-result">
          <h2>Seneste Spil Resultat:</h2>
          <p>Vinder: {latestGameResult.vinder}</p>
          <p>{latestGameResult.farve === 'Rød' ? `Vinderen af rød var: ${latestGameResult.vinder}` : ''}</p>
        </div>
      )}
    </div>
  );
}

export default ActiveBetsPage;
