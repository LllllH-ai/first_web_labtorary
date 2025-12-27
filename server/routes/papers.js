const express = require('express');
const { pool, sql, poolConnect } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { title, paperType, publisher, abstract, fileUrl, status } = req.body || {};
  if (!title || !paperType || !publisher) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  await poolConnect;
  try {
    const request = pool.request();
    request.input('user_id', sql.Int, req.user.id);
    request.input('title', sql.NVarChar(255), title.trim());
    request.input('paper_type', sql.NVarChar(100), paperType.trim());
    request.input('publisher', sql.NVarChar(100), publisher.trim());
    request.input('abstract', sql.NVarChar(sql.MAX), abstract || null);
    request.input('file_url', sql.NVarChar(500), fileUrl || null);
    request.input('status', sql.NVarChar(50), status || 'submitted');
    const result = await request.query(
      `INSERT INTO papers (user_id, title, paper_type, publisher, abstract, file_url, status)
       OUTPUT INSERTED.id
       VALUES (@user_id, @title, @paper_type, @publisher, @abstract, @file_url, @status)`
    );
    return res.status(201).json({ id: result.recordset[0].id });
  } catch (err) {
    console.error('Create paper error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  await poolConnect;
  try {
    const onlyMine = String(req.query.mine || '').toLowerCase() === 'true';
    const request = pool.request();
    if (onlyMine) {
      request.input('user_id', sql.Int, req.user.id);
      const result = await request.query(
        'SELECT id, title, paper_type, publisher, abstract, file_url, status, submitted_at FROM papers WHERE user_id = @user_id ORDER BY submitted_at DESC'
      );
      return res.json({ items: result.recordset });
    }
    const result = await request.query(
      'SELECT id, title, paper_type, publisher, abstract, file_url, status, submitted_at FROM papers ORDER BY submitted_at DESC'
    );
    return res.json({ items: result.recordset });
  } catch (err) {
    console.error('List papers error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
