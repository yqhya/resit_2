const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = 555;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Routes
app.post('/user/register', async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const query = 'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)';
      db.run(query, [name, email, hashedPassword, isAdmin ? 1 : 0], function(err) {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        const newUser = {
          id: this.lastID,
          name,
          email,
          isAdmin: Boolean(isAdmin)
        };

        // Create JWT token
        const token = jwt.sign(
          { id: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin },
          'your-secret-key',
          { expiresIn: '1h' }
        );

        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: newUser
        });
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, isAdmin: Boolean(user.isAdmin) },
        'your-secret-key',
        { expiresIn: '1h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: Boolean(user.isAdmin)
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Books routes
app.get('/books', (req, res) => {
  db.all('SELECT * FROM books', [], (err, books) => {
    if (err) {
      console.error('Error fetching books:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(books);
  });
});

app.post('/books', authenticateToken, isAdmin, (req, res) => {
  const { title, author, description, price, quantity, imageUrl } = req.body;
  const query = 'INSERT INTO books (title, author, description, price, quantity, imageUrl) VALUES (?, ?, ?, ?, ?, ?)';
  
  db.run(query, [title, author, description, price, quantity, imageUrl], function(err) {
    if (err) {
      console.error('Error adding book:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    const newBook = {
      id: this.lastID,
      title,
      author,
      description,
      price,
      quantity,
      imageUrl
    };

    res.status(201).json(newBook);
  });
});

// Orders route
app.post('/order', authenticateToken, (req, res) => {
  const { bookId, quantity } = req.body;
  
  db.get('SELECT * FROM books WHERE id = ?', [bookId], (err, book) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough books in stock' });
    }

    const newQuantity = book.quantity - quantity;
    db.run('UPDATE books SET quantity = ? WHERE id = ?', [newQuantity, bookId], (err) => {
      if (err) {
        console.error('Error updating book quantity:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      book.quantity = newQuantity;
      res.json({ message: 'Order placed successfully', book });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
