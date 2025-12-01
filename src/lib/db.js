import postgres from 'postgres';

// Build connection string with fallbacks
const connectionString =
	process.env.DATABASE_URL ||
	process.env.POSTGRES_URL ||
	process.env.POSTGRES_CONNECTION_STRING ||
	'';

if (!connectionString) {
	console.error('❌ DATABASE_URL is not set!');
}

// Supabase requires SSL; add timeouts and disable prepared statements for PgBouncer
const sql = postgres(connectionString, {
	ssl: 'require',
	connect_timeout: 10_000, // ms
	idle_timeout: 30,        // seconds
	keep_alive: 1,           // seconds
	max: 10,
	// When using Connection Pooling (PgBouncer), prepared statements must be disabled
	prepare: false,
	onnotice: () => {}, // Suppress notices
	debug: process.env.NODE_ENV === 'development',
});

// Replace MySQL-style placeholders (?) with $1, $2 ...
function convertPlaceholders(text = '', params = []) {
	let i = 0;
	const converted = text.replace(/\?/g, () => `$${++i}`);
	return { text: converted, values: params };
}

// Compatibility wrapper to mimic mysql2 pool.query()
async function query(text, params = []) {
	const trimmed = (text || '').trim();
	const command = trimmed.split(/\s+/)[0].toUpperCase();

	let sqlText = trimmed;
	let values = params;

	if (params && params.length > 0) {
		const conv = convertPlaceholders(trimmed, params);
		sqlText = conv.text;
		values = conv.values;
	}

	// Ensure INSERT returns id to emulate result.insertId
	if (command === 'INSERT' && !/RETURNING\s+\w+/i.test(sqlText)) {
		sqlText = `${sqlText} RETURNING id`;
	}

	// Execute using postgres.js; unsafe allows $1 parameterization
	const res = await sql.unsafe(sqlText, values);

	// postgres.js returns an array-like object with rows; UPDATE/DELETE add count
	if (command === 'SELECT' || /^WITH\b/i.test(trimmed)) {
		return [res];
	}

	if (command === 'INSERT') {
		const insertId = res?.[0]?.id ?? null;
		return [
			{
				insertId,
				rowCount: res?.count ?? (Array.isArray(res) ? res.length : 0)
			}
		];
	}

	if (command === 'UPDATE' || command === 'DELETE') {
		return [
			{
				affectedRows: res?.count ?? 0,
				rowCount: res?.count ?? 0
			}
		];
	}

	return [res];
}

export default { query };