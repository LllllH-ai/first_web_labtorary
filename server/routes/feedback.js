const express = require('express');
const { pool, sql, poolConnect } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  const { publisher, message, contactEmail } = req.body || {};
  if (!publisher || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  await poolConnect;
  try {
    const request = pool.request();
    request.input('user_id', sql.Int, req.user ? req.user.id : null);
    request.input('publisher', sql.NVarChar(100), publisher.trim());
    request.input('message', sql.NVarChar(sql.MAX), message);
    request.input('contact_email', sql.NVarChar(100), contactEmail || null);
    await request.query(
      'INSERT INTO feedback (user_id, publisher, message, contact_email) VALUES (@user_id, @publisher, @message, @contact_email)'
    );
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Feedback error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Optional: auth-protected fetch for admins could be added later
router.get('/', authMiddleware, async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request().query(
      'SELECT id, user_id, publisher, message, contact_email, created_at FROM feedback ORDER BY created_at DESC'
    );
    return res.json({ items: result.recordset });
  } catch (err) {
    console.error('List feedback error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
