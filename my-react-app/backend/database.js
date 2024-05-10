const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the in-memory SQLite database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY,
        tal INTEGER,
        farve TEXT,
        vinder TEXT,
        spiller TEXT,
        betAmount INTEGER,
        betType TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

function saveResult(tal, farve, spiller, betAmount, betType) {
    return new Promise((resolve, reject) => {
        const winner = farve === 'Rød' ? spiller : null;
        const stmt = db.prepare("INSERT INTO games (tal, farve, vinder, spiller, betAmount, betType) VALUES (?, ?, ?, ?, ?, ?)");
        stmt.run(tal, farve, winner, spiller, betAmount, betType, function (error) {
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
        db.get("SELECT * FROM games ORDER BY timestamp DESC LIMIT 1", (error, row) => {
            if (error) {
                console.error("Error fetching data", error);
                reject(error);
            } else {
                resolve(row);
            }
        });
    });
}

function getGameData() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM games ORDER BY timestamp DESC LIMIT 10", (error, rows) => {
            if (error) {
                console.error("Error fetching games data", error);
                reject(error);
            } else {
                resolve(rows);
            }
        });
    });
}

function clearResults() {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM games", function (error) {
            if (error) {
                console.error("Error clearing game results", error);
                reject(error);
            } else {
                console.log(`Cleared game results successfully, ${this.changes} rows affected`);
                resolve(this.changes);
            }
        });
    });
}

module.exports = {
    saveResult,
    getLatestGameResult,
    getGameData,
    clearResults
};
