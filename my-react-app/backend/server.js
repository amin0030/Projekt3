const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./database');
const i2cComm = require('./i2ccommunication.js');
const {sendMessage, receiveMessage} = require('./i2ccommunication');

const app = express();
const port = 3001;

app.use(cors({
    origin: 'http://10.192.97.237:3000' // Ensure this matches your frontend URL/port
}));

app.use(bodyParser.json());

app.post('/api/start-game', async (req, res) => {
	try { 
		sendMessage(); //  somthing

		const randomNumber = receiveMessage();
		let color = 'Green'; // Default for 0
		if (randomNumber !== 0){
			color = randomNumber % 2 === 0 ? 'Black' : 'Red';
		}

		const { players } = req.body;
		if(!players || players.length === 0){
			return res.status(400).json({ message: 'No Players Provided'});
		}
		
		let winners = [];
		players.forEach(player  => {
			const betMatch = player.currentBet.betType.toLowerCase();
			const colorMatch = (color.toLowerCase() === betMatch);
			const numberMatch = (parseInt(betMatch) === randomNumber);

			if(colorMatch || numberMatch){
				winners.push(player.name);
				database.saveResult(randomNumber, color, player.name, player.currentBet.betAmount, player.currentBet.betType, 'Winner');
			} else {
				database.saveResult(randomNumber, color, player.name, player.currentBet.betAmount, player.currentBet.betType, 'No winner');
			}
		});

		res.status(200).json({
			message: 'Game  Started',
			gameResult: {
				drawnNumber: randomNumber,
				color: color,
				winners: winners.length > 0 ? winners : ['No Winners']
			}
		});
	} catch (error) {
		console.error( 'Error Starting the game:', error);
		res.status(500).json({ message: 'There was an error starting the game'});
	}
});

app.post('/save-data', async (req,res) => {
	const{ tal, farve, spiller, betAmount, betType} = req.body;
	try {
		const id = await database.saveResult(tal, farve, spiller, betAmount, betType);
		res.status(200).json({message: 'data received and saved in the database', id});
	} catch(error){
		console.error('Error processing data', error);
		res.status(500).json({ message: 'There was an error'});
	}
});

app.get('/api/game-data', async(req,res) => {
	try {
		const games = await database.getGameData();
		res.status(200).json({games: games});
	} catch (error){
		console.error('error fetching game data', error);
		res.status(500).json({message: 'Could not fetch game data.'});
	}
});

app.get('api/latest-game-result', async(req,res) => {
	try {
		const result = await database.getLatestGameResult();
		res.status(200).json(result);
	} catch (error){
		console.error('Error fetching the latest game result', error);
		res.status(500).json({ message: 'Could not fetch the latest game result.'});
	}
});
app.listen(port, () => {
    console.log(`Server running on http://10.192.97.237`);
});
