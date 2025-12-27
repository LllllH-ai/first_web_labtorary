require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { poolConnect } = require('./db');

const authRoutes = require('./routes/auth');
const paperRoutes = require('./routes/papers');
const feedbackRoutes = require('./routes/feedback');
const messageRoutes = require('./routes/messages');

const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await poolConnect;
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/messages', messageRoutes);

app.use((err, _req, res, _next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
