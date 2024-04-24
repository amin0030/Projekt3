const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY, tal INTEGER, farve TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

function saveResult(tal, farve) {
  db.serialize(() => {
    const stmt = db.prepare("INSERT INTO games (tal, farve) VALUES (?, ?)");
    stmt.run(tal, farve);
    stmt.finalize();
  });
}

module.exports = {
  saveResult
};
