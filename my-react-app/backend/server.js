const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/save-data', async (req, res) => {
  const { tal, farve, spiller, betAmount } = req.body;
  try {
    const id = await database.saveResult(tal, farve, spiller, betAmount);
    res.status(200).json({ message: 'Data modtaget og gemt i databasen', id });
  } catch (error) {
    console.error('Fejl under behandling af data:', error);
    res.status(500).json({ message: 'Der opstod en fejl under behandling af data' });
  }
});

app.get('/api/active-bets', async (req, res) => {
  try {
    const bets = await database.getActiveBets();
    res.status(200).json(bets);
  } catch (error) {
    console.error('Fejl under hentning af aktive bets:', error);
    res.status(500).json({ message: 'Der opstod en fejl under hentning af aktive bets' });
  }
});

app.post('/api/start-game', async (req, res) => {
  try {
    const latestGameResult = await database.getLatestGameResult();
    if (latestGameResult) {
      // Hvis der er et seneste spilresultat for rød, betyder det, at nogen har vundet
      res.status(200).json({ message: 'Spillet er allerede startet', gameResult: latestGameResult });
    } else {
      // Ellers starter vi spillet
      await database.setWinnerForRed();
      const newLatestGameResult = await database.getLatestGameResult();
      res.status(200).json({ message: 'Spillet er startet', gameResult: newLatestGameResult });
    }
  } catch (error) {
    console.error('Fejl under start af spillet:', error);
    res.status(500).json({ message: 'Der opstod en fejl under start af spillet' });
  }
});

app.listen(port, () => {
  console.log(`Serveren kører på http://localhost:${port}`);
});
