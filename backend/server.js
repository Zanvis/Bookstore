const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bookstore'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Routes
app.get('/api/books', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching books' });
      return;
    }
    res.json(results);
  });
});

app.get('/api/books/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM books WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching book' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.json(results[0]);
  });
});

app.post('/api/books', upload.single('coverImage'), (req, res) => {
  const { title, author, description, publishYear } = req.body;
  const coverUrl = req.file ? `/uploads/${req.file.filename}` : null;

  db.query(
    'INSERT INTO books (title, author, description, publish_year, cover_url) VALUES (?, ?, ?, ?, ?)',
    [title, author, description, publishYear, coverUrl],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error adding book' });
        return;
      }
      res.status(201).json({ id: result.insertId, title, author, description, publishYear, coverUrl });
    }
  );
});

app.put('/api/books/:id', upload.single('coverImage'), (req, res) => {
  const { id } = req.params;
  const { title, author, description, publishYear } = req.body;
  let coverUrl = req.body.coverUrl;

  if (req.file) {
    coverUrl = `/uploads/${req.file.filename}`;
    // Delete old cover file if it exists
    if (req.body.coverUrl) {
      const oldFilePath = path.join(__dirname, req.body.coverUrl);
      fs.unlink(oldFilePath, (err) => {
        if (err) console.error('Error deleting old cover file:', err);
      });
    }
  }

  db.query(
    'UPDATE books SET title = ?, author = ?, description = ?, publish_year = ?, cover_url = ? WHERE id = ?',
    [title, author, description, publishYear, coverUrl, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: 'Error updating book' });
        return;
      }
      res.json({ id, title, author, description, publishYear, coverUrl });
    }
  );
});

app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  
  // First, get the book to find the cover URL
  db.query('SELECT cover_url FROM books WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error deleting book' });
      return;
    }
    
    if (results.length > 0 && results[0].cover_url) {
      // Delete the cover file
      const filePath = path.join(__dirname, results[0].cover_url);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting cover file:', err);
      });
    }

    // Then delete the book from the database
    db.query('DELETE FROM books WHERE id = ?', [id], (err) => {
      if (err) {
        res.status(500).json({ error: 'Error deleting book' });
        return;
      }
      res.json({ message: 'Book deleted successfully' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});