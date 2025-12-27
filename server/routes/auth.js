const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool, sql, poolConnect } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const TOKEN_EXPIRY = '7d';

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body || {};
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  await poolConnect;
  try {
    const request = pool.request();
    request.input('username', sql.NVarChar(50), username.trim());
    request.input('email', sql.NVarChar(100), email.trim());
    const existing = await request.query(
      'SELECT id FROM users WHERE username = @username OR email = @email'
    );
    if (existing.recordset.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const insertReq = pool.request();
    insertReq.input('username', sql.NVarChar(50), username.trim());
    insertReq.input('email', sql.NVarChar(100), email.trim());
    insertReq.input('password_hash', sql.NVarChar(200), passwordHash);
    const result = await insertReq.query(
      'INSERT INTO users (username, email, password_hash) OUTPUT INSERTED.id VALUES (@username, @email, @password_hash)'
    );
    const userId = result.recordset[0].id;
    const token = jwt.sign({ id: userId, username, email }, process.env.JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });
    return res.status(201).json({ token, user: { id: userId, username, email } });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  await poolConnect;
  try {
    const request = pool.request();
    request.input('email', sql.NVarChar(100), email.trim());
    const userResult = await request.query(
      'SELECT TOP 1 id, username, email, password_hash FROM users WHERE email = @email'
    );
    if (userResult.recordset.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = userResult.recordset[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );
    return res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
