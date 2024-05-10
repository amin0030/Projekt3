import React, { useState, useEffect } from 'react';

function StatisticsPage() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/game-data');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data.games) {
                    setGames(data.games);
                } else {
                    throw new Error('Data was not returned');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching game data', error);
                setError('Could not fetch game data.');
                setLoading(false);
            }
        };

        fetchGameData();
    }, []);

    if (loading) {
        return <div>Loading data...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Game Statistics</h1>
            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Number</th>
                        <th>Color</th>
                        <th>Winner</th>
                        <th>Bet Amount</th>
                        <th>Bet Type</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game, index) => (
                        <tr key={index}>
                            <td>{game.spiller}</td>
                            <td>{game.tal}</td>
                            <td>{game.farve}</td>
                            <td>{game.vinder || 'No winner'}</td>
                            <td>{game.betAmount}</td>
                            <td>{game.betType}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StatisticsPage;
