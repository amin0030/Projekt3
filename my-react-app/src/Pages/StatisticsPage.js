import React, { useState, useEffect } from 'react';

function StatisticsPage() {
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        // Antag at '/api/game-data' er det rigtige endpoint
        const response = await fetch('/api/game-data');
        if (!response.ok) {
          throw new Error('Netværksrespons var ikke ok');
        }
        const data = await response.json();
        setPlayers(data.players);
        setWinner(data.winner);
        setLoading(false);
      } catch (error) {
        console.error('Fejl under hentning af spildata', error);
        setError('Kunne ikke hente spildata.');
        setLoading(false);
      }
    };

    fetchGameData();
  }, []);

  if (loading) {
    return <div>Henter data...</div>;
  }

  if (error) {
    return <div>Fejl: {error}</div>;
  }

  const renderWinner = (playerName) => {
    return winner && playerName === winner.name ? <strong> (Vinder!)</strong> : null;
  };

  return (
    <div>
      <h1>Spil Statistik</h1>
      <table>
        <thead>
          <tr>
            <th>Spiller</th>
            <th>Bets</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>{player.name}{renderWinner(player.name)}</td>
              <td>{player.bets.map((bet, betIndex) => (
                <div key={betIndex}>{bet.betType} - ${bet.betAmount.toFixed(2)}</div>
              ))}</td>
              <td>${player.balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StatisticsPage;
