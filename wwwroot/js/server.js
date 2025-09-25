// server.js
// Node.js + Express + SQLite pentru autentificare simplă
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./users.db');

app.use(cors());
app.use(bodyParser.json());

// Creează tabela și userul admin dacă nu există
const initSql = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);
INSERT OR IGNORE INTO users (email, password, role) VALUES ('admin', 'admin', 'admin');
`;
db.exec(initSql);

// Endpoint de login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) return res.status(500).json({ error: 'Eroare server' });
        if (!row) return res.status(401).json({ error: 'Login sau parolă greșite' });
        res.json({ success: true, user: { email: row.email, role: row.role } });
    });
});

app.listen(3000, () => {
    console.log('Serverul rulează pe http://localhost:3000');
});
