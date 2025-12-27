const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  port: Number(process.env.DB_PORT || 1433),
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool
  .connect()
  .then(() => console.log('SQL Server connected'))
  .catch((err) => {
    console.error('SQL Server connection error:', err);
    process.exit(1);
  });

module.exports = { sql, pool, poolConnect };
