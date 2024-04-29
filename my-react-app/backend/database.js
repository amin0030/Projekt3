const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY, 
    tal INTEGER, 
    farve TEXT, 
    vinder TEXT, 
    spiller TEXT,
    betAmount INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  const stmt = db.prepare("INSERT INTO games (tal, farve, vinder, spiller, betAmount) VALUES (?, ?, ?, ?, ?)");
  for (let i = 0; i < 10; i++) {
    // Vælg farve og bestem vinderen baseret på farven.
    const farve = i % 2 === 0 ? 'Rød' : 'Sort';
    const vinder = farve === 'Rød' ? 'Spiller1' : null;
    const spiller = `Spiller${i % 3 + 1}`;
    const betAmount = farve === 'Rød' ? Math.floor(Math.random() * 1000) : 0;
    stmt.run(i, farve, vinder, spiller, betAmount);
  }
  stmt.finalize();
});

function saveResult(tal, farve, spiller, betAmount) {
  const vinder = farve === 'Rød' ? 'Spiller1' : null;
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO games (tal, farve, vinder, spiller, betAmount) VALUES (?, ?, ?, ?, ?)");
    stmt.run(tal, farve, vinder, spiller, betAmount, function(error) {
      if (error) {
        console.error("Error inserting data", error);
        reject(error);
      } else {
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        resolve(this.lastID);
      }
    });
    stmt.finalize();
  });
}

function getLatestGameResult() {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM games WHERE farve = 'Rød' AND vinder IS NOT NULL ORDER BY timestamp DESC LIMIT 1", (error, row) => {
      if (error) {
        console.error("Error fetching data", error);
        reject(error);
      } else {
        resolve(row);
      }
    });
  });
}

module.exports = {
  saveResult,
  getLatestGameResult
};
