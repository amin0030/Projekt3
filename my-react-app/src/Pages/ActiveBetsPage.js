import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Styles/ActiveBetsPage.css';  // Antagelse af en CSS import

function ActiveBetsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const players = location.state ? location.state.players : [];

    // Funktion til at sende anmodning om at starte spillet
    const startGame = async () => {
        try {
            const response = await fetch('/api/start-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            alert(data.message);  // Viser en besked om at spillet er startet
            navigate('/game');  // Optional: Naviger til spil-siden eller hvor du ønsker efter spillet startes
        } catch (error) {
            console.error('Fejl ved start af spillet:', error);
            alert('Kunne ikke starte spillet.');
        }
    };

    return (
        <div className="active-bets-container">
            <h1>Aktive Bets</h1>
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
            <button onClick={startGame} className="active-bets-button">Start Game</button>
        </div>
    );
}

export default ActiveBetsPage;
