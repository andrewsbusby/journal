const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

let users = [];
let journalEntries = [];

// Register Endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'User registered' });
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware to verify token
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Get Journal Entries
app.get('/api/journal', authenticateJWT, (req, res) => {
  res.json(journalEntries);
});

// Add Journal Entry
app.post('/api/journal', authenticateJWT, (req, res) => {
  const entry = req.body;
  journalEntries.push(entry);
  res.status(201).json({ message: 'Entry added' });
});

// Remove Journal Entry
app.delete('/api/journal/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  journalEntries = journalEntries.filter(entry => entry.id !== id);
  res.json({ message: 'Entry removed' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));