const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./database');
const { receiveMessage, sendMessage } = require('./i2ccommunication'); // Correct path

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:3001' // Ensure this matches your frontend URL/port
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
        const games = await database.getGameData();
        res.status(200).json({ games: games });
    } catch (error) {
        console.error('Error fetching game data:', error);
        res.status(500).json({ message: 'Could not fetch game data.' });
    }
});

app.post('/api/start-game', async (req, res) => {
    try {
        // Trigger the PSoC to send the number
        sendMessage();
        
        // Receive the number from the PSoC device
        const randomNumber = receiveMessage(); // Receive the number directly from your PSoC device
        
        const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
        
        let color = 'Green'; // Default color for '0'
        if (redNumbers.includes(randomNumber)) {
            color = 'Red';
        } else if (blackNumbers.includes(randomNumber)) {
            color = 'Black';
        }

        const { players } = req.body;
        if (!players || players.length === 0) {
            return res.status(400).json({ message: 'No players provided' });
        }

        let winners = [];
        for (const player of players) {
            const betMatch = player.currentBet.betType.toLowerCase();
            const colorMatch = (color.toLowerCase() === betMatch);
            const numberMatch = (parseInt(betMatch) === randomNumber);
            
            if (colorMatch || numberMatch) {
                winners.push(player.name);
                await database.saveResult(randomNumber, color, player.name, player.currentBet.betAmount, player.currentBet.betType, 'Winner');
            } else {
                await database.saveResult(randomNumber, color, player.name, player.currentBet.betAmount, player.currentBet.betType, 'No winner');
            }
        }

        res.status(200).json({ 
            message: 'Game started', 
            gameResult: {
                drawnNumber: randomNumber,
                color: color,
                winners: winners.length > 0 ? winners : ['No winners']
            }
        });
    } catch (error) {
        console.error('Error starting the game:', error);
        res.status(500).json({ message: 'There was an error starting the game' });
    }
});

app.get('/api/latest-game-result', async (req, res) => {
    try {
        const result = await database.getLatestGameResult();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching the latest game result:', error);
        res.status(500).json({ message: 'Could not fetch the latest game result.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
