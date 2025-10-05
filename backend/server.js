const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json())

const dbPath = path.join(__dirname, 'db', 'database.sqlite');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    exercise TEXT NOT NULL,
    weight REAL NOT NULL,
    reps INTEGER NOT NULL,
    sets INTEGER NOT NULL
  );
`);

app.get('/api/health', (_req, res) => res.json({ ok:true }));

app.get('/api/workouts', (_req, res) => {
  const rows = db.prepare('SELECT * FROM workouts ORDER BY date DESC, id DESC').all();
  res.json(rows);
});

app.post('/api/workouts', (req, res) => {
  const { date, exercise, weight, reps, sets } = req.body || {};
  if (!date || !exercise || weight == null || reps == null || sets == null) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const stmt = db.prepare(`
    INSERT INTO workouts (date, exercise, weight, reps, sets)
    VALUES (@date, @exercise, @weight, @reps, @sets)
  `);

  const info = stmt.run({
    date,
    exercise: String(exercise).trim(),
    weight: Number(weight),
    reps: Number(reps),
    sets: Number(sets)
  });

  const created = db.prepare('SELECT * FROM workouts WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(created);
});

app.delete('/api/workouts/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
  const info = db.prepare('DELETE FROM workouts WHERE id = ?').run(id);
  res.json({ deleted: info.changes });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
