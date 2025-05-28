const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware-ek
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// GET '/' kiszolgálja a taxi.html-t
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'taxi.html'));
});

// 🔗 Adatbázis + tábla létrehozása
const db = new sqlite3.Database('taxi.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS taxi (
      fuvar_id INTEGER,
      indulasi_hely TEXT,
      cel TEXT,
      tavolsag REAL,
      viteldij REAL,
      taxi_id TEXT
    )
  `);
});

// POST: adatok mentése az adatbázisba
app.post('/taxi', (req, res) => {
  const { fuvar_id, indulasi_hely, cel, tavolsag, viteldij, taxi_id } = req.body;

  const stmt = db.prepare(`INSERT INTO taxi VALUES (?, ?, ?, ?, ?, ?)`);
  stmt.run(fuvar_id, indulasi_hely, cel, tavolsag, viteldij, taxi_id, (err) => {
    if (err) {
      console.error('Hiba az adat mentésekor:', err);
      res.status(500).send('Adatbázis hiba.');
    } else {
      res.status(200).send('Sikeres mentés.');
    }
  });
});

// GET: az összes felhasználó lekérése (ellenőrzéshez)
app.get('/taxi', (req, res) => {
  db.all('SELECT * FROM taxi', (err, rows) => {
    if (err) {
      res.status(500).send('Adatbázis lekérdezési hiba.');
    } else {
      res.json(rows);
    }
  });
});

// Szerver indítása
app.listen(port, () => {
  console.log(`Szerver fut: http://localhost:${port}`);
});