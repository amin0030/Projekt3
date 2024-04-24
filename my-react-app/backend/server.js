const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Endepunkt for at modtage data fra GUI'en
app.post('/save-data', (req, res) => {
  try {
    const newData = req.body;
    console.log('Modtaget data fra GUI:', newData);

    // Gem dataene i databasen
    database.saveData(newData);

    res.status(200).send('Data modtaget og gemt i databasen');
  } catch (error) {
    console.error('Fejl under behandling af data:', error);
    res.status(500).send('Der opstod en fejl under behandling af data');
  }
});

// Endepunkt for at modtage data fra PSoC'en
app.post('/receive-data', (req, res) => {
  try {
    const data = req.body;
    console.log('Modtaget data fra PSoC:', data);

    // Håndter de specifikke data fra PSoC'en
    const tal = data.tal;
    const farve = data.farve;

    // Gem dataene i databasen eller udfør andre operationer
    database.saveResult(tal, farve);

    res.status(200).send('Data modtaget og gemt i databasen');
  } catch (error) {
    console.error('Fejl under behandling af data fra PSoC:', error);
    res.status(500).send('Der opstod en fejl under behandling af data fra PSoC');
  }
});

app.listen(port, () => {
  console.log(`Serveren kører på http://localhost:${port}`);
});
