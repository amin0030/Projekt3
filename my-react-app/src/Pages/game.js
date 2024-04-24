import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/game.css';

function Game() {
    const [players, setPlayers] = useState([]);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerBalance, setNewPlayerBalance] = useState('');

    const navigate = useNavigate();

    const addPlayer = () => {
        if (newPlayerName.trim() && newPlayerBalance && !isNaN(newPlayerBalance)) {
            const newPlayer = {
                name: newPlayerName.trim(),
                balance: parseFloat(newPlayerBalance),
                bets: [],
                currentBet: null,
                betAmount: '',
                betType: ''
            };
            setPlayers([...players, newPlayer]);
            setNewPlayerName('');
            setNewPlayerBalance('');
        } else {
            alert('Indtast venligst et gyldigt navn og startsaldo for den nye spiller.');
        }
    };

    const placeBet = (index) => {
        const player = players[index];
        const betAmount = parseFloat(player.betAmount);
        if (betAmount > 0 && betAmount <= player.balance && player.betType) {
            const updatedPlayers = players.map((p, i) => {
                if (i === index) {
                    return { ...p, balance: p.balance - betAmount, currentBet: { betType: p.betType, betAmount: betAmount } };
                }
                return p;
            });
            setPlayers(updatedPlayers);
        } else {
            alert('Indtast venligst et gyldigt Bet og type.');
        }
    };

    const navigateToActiveBets = () => {
        navigate('/active-bets', { state: { players: players } });
    };

    return (
        <div className="game-container">
            <div className="left-panel">
                <div className="game-started">Spillet er Started</div>
                <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Indtast nyt spillernavn"
                    className="player-input"
                />
                <input
                    type="number"
                    value={newPlayerBalance}
                    onChange={(e) => setNewPlayerBalance(e.target.value)}
                    placeholder="Indtast startsaldo"
                    className="balance-input"
                />
                <button onClick={addPlayer} className="add-player-button">Tilføj Player</button>
                {players.map((player, index) => (
                    <div key={index}>
                        <div>{player.name} - Saldo: {player.balance.toFixed(2)}</div>
                        <input
                            type="number"
                            value={player.betAmount}
                            onChange={(e) => {
                                let updatedPlayers = [...players];
                                updatedPlayers[index].betAmount = e.target.value;
                                setPlayers(updatedPlayers);
                            }}
                            placeholder="Bet Amount"
                        />
                        <select
                            value={player.betType}
                            onChange={(e) => {
                                let updatedPlayers = [...players];
                                updatedPlayers[index].betType = e.target.value;
                                setPlayers(updatedPlayers);
                            }}
                        >
                            <option value="">Vælg Bet Type</option>
                            <option value="Red">Rød</option>
                            <option value="Black">Sort</option>
                            {[...Array(36)].map((_, i) => (
                                <option key={i} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <button onClick={() => placeBet(index)}>Tilføj Bet</button>
                    </div>
                ))}
                <button onClick={navigateToActiveBets} className="view-active-bets-button"> Se Aktive Bets</button>
            </div>
        </div>
    );
}

export default Game;

