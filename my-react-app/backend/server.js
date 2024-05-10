const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./database');

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:3001'  // Ensure this matches your frontend URL/port
}));

app.use(bodyParser.json());

app.post('/save-data', async (req, res) => {
    const { tal, farve, spiller, betAmount, betType } = req.body;
    try {
        const id = await database.saveResult(tal, farve, spiller, betAmount, betType);
        res.status(200).json({ message: 'Data received and saved in the database', id });
    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).json({ message: 'There was an error processing the data' });
    }
});

app.get('/api/game-data', async (req, res) => {
    try {
        const games = await database.getGameData();  // Use the correct function name
        res.status(200).json({ games: games });
    } catch (error) {
        console.error('Error fetching game data:', error);
        res.status(500).json({ message: 'Could not fetch game data.' });
    }
});

app.post('/api/start-game', async (req, res) => {
    try {
        await database.clearResults();
        const players = req.body.players;
        if (!players || players.length === 0) {
            res.status(400).json({ message: 'No players provided' });
            return;
        }
        const randomIndex = Math.floor(Math.random() * players.length);
        const winner = players[randomIndex].name;
        await database.saveResult(0, 'Rød', winner, 0, 'Generic');
        const newLatestGameResult = await database.getLatestGameResult();
        if (newLatestGameResult) {
            res.status(200).json({ message: 'Game started', gameResult: newLatestGameResult });
        } else {
            res.status(404).json({ message: 'No game result found' });
        }
    } catch (error) {
        console.error('Error starting the game:', error);
        res.status(500).json({ message: 'There was an error starting the game' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
