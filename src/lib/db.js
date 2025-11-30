import { Pool } from 'pg';

// Read connection string for Supabase Postgres
// Prefer DATABASE_URL; fallback to POSTGRES_URL variants if provided
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_CONNECTION_STRING ||
  '';

// Create a connection pool (Supabase requires SSL)
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

// Replace MySQL-style placeholders (?) with Postgres-style ($1, $2, ...)
function convertPlaceholders(sql = '', params = []) {
  let index = 0;
  const text = sql.replace(/\?/g, () => {
    index += 1;
    return `$${index}`;
  });
  return { text, values: params };
}

// Lightweight compatibility layer to mimic mysql2's pool.query API
async function query(sql, params = []) {
  const trimmed = (sql || '').trim();
  const command = trimmed.split(/\s+/)[0].toUpperCase();

  let text = trimmed;
  let values = params;

  // Only convert placeholders when params are provided
  if (params && params.length > 0) {
    const conv = convertPlaceholders(trimmed, params);
    text = conv.text;
    values = conv.values;
  }

  // Ensure INSERT returns id to emulate result.insertId
  if (command === 'INSERT' && !/RETURNING\s+\w+/i.test(text)) {
    text = `${text} RETURNING id`;
  }

  const res = await pool.query(text, values);

  if (command === 'SELECT' || /^WITH\b/i.test(trimmed)) {
    // mysql2 returns [rows] for selects
    return [res.rows];
  }

  if (command === 'INSERT') {
    const insertId = res.rows?.[0]?.id ?? null;
    return [
      {
        insertId,
        rowCount: res.rowCount
      }
    ];
  }

  if (command === 'UPDATE' || command === 'DELETE') {
    return [
      {
        affectedRows: res.rowCount,
        rowCount: res.rowCount
      }
    ];
  }

  // Default: return rows for any other statement
  return [res.rows];
}

// Test connection on startup
pool
  .query('SELECT 1')
  .then(() => {
    console.log('✅ PostgreSQL connected successfully');
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection failed:', err.message);
  });

export default { query };
