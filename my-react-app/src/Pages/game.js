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
            alert('Please enter a valid name and initial balance for the new player.');
        }
    };

    const placeBet = (index) => {
        const player = players[index];
        const betAmount = parseFloat(player.betAmount);
        if (betAmount > 0 && betAmount <= player.balance && player.betType !== '') {
            const updatedPlayers = players.map((p, i) => {
                if (i === index) {
                    return {
                        ...p,
                        balance: p.balance - betAmount,
                        currentBet: { betType: p.betType, betAmount }
                    };
                }
                return p;
            });
            setPlayers(updatedPlayers);
        } else {
            alert('Please enter a valid bet amount and type.');
        }
    };

    const navigateToActiveBets = () => {
        navigate('/active-bets', { state: { players } });
    };

    return (
        <div className="game-container">
            <div className="left-panel">
                <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Enter new player name"
                    className="player-input"
                />
                <input
                    type="number"
                    value={newPlayerBalance}
                    onChange={(e) => setNewPlayerBalance(e.target.value)}
                    placeholder="Enter initial balance"
                    className="balance-input"
                />
                <button onClick={addPlayer} className="add-player-button">Add Player</button>
                {players.map((player, index) => (
                    <div key={index} className="player-info">
                        <div>{player.name} - Balance: {player.balance.toFixed(2)} DKK</div>
                        <input
                            type="number"
                            value={player.betAmount}
                            onChange={(e) => {
                                let updatedPlayers = [...players];
                                updatedPlayers[index].betAmount = e.target.value;
                                setPlayers(updatedPlayers);
                            }}
                            placeholder="Amount"
                            className="bet-input"
                        />
                        <select
                            value={player.betType}
                            onChange={(e) => {
                                let updatedPlayers = [...players];
                                updatedPlayers[index].betType = e.target.value;
                                setPlayers(updatedPlayers);
                            }}
                            className="bet-select"
                        >
                            <option value="">Select Bet Type</option>
                            <option value="0">0</option>
                            <option value="Red">Red</option>
                            <option value="Black">Black</option>
                            {[...Array(36).keys()].map((number) => (
                                <option key={number + 1} value={number + 1}>{number + 1}</option>
                            ))}
                        </select>
                        <button onClick={() => placeBet(index)} className="place-bet-button">Place Bet</button>
                    </div>
                ))}
                <button onClick={navigateToActiveBets} className="view-active-bets-button">View Active Bets</button>
            </div>
        </div>
    );
}

export default Game;
