const express = require('express');
const { pool, sql, poolConnect } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  const { subject, body, tags } = req.body || {};
  if (!subject || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  await poolConnect;
  try {
    const request = pool.request();
    request.input('user_id', sql.Int, req.user ? req.user.id : null);
    request.input('subject', sql.NVarChar(255), subject.trim());
    request.input('body', sql.NVarChar(sql.MAX), body);
    const tagsString = Array.isArray(tags) ? JSON.stringify(tags) : tags || null;
    request.input('tags', sql.NVarChar(sql.MAX), tagsString);
    await request.query(
      'INSERT INTO messages (user_id, subject, body, tags) VALUES (@user_id, @subject, @body, @tags)'
    );
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Create message error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request().query(
      'SELECT id, user_id, subject, body, tags, created_at FROM messages ORDER BY created_at DESC'
    );
    const items = result.recordset.map((row) => ({
      ...row,
      tags: parseTags(row.tags),
    }));
    return res.json({ items });
  } catch (err) {
    console.error('List messages error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

function parseTags(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (_) {
    return raw;
  }
}

module.exports = router;
