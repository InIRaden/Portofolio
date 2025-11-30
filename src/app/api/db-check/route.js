import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Basic info
    const [verRows] = await db.query('select version()');
    const [dbRows] = await db.query('select current_database() as name');
    const [tabRows] = await db.query(
      'select count(*)::int as count from information_schema.tables where table_schema = ?',
      ['public']
    );

    // Optional: try to count known table
    let projectCount = null;
    try {
      const [prjRows] = await db.query('select count(*)::int as count from projects');
      projectCount = prjRows[0]?.count ?? 0;
    } catch {
      projectCount = null; // table may not exist yet
    }

    return NextResponse.json({
      success: true,
      version: verRows?.[0]?.version ?? null,
      database: dbRows?.[0]?.name ?? null,
      publicTables: tabRows?.[0]?.count ?? 0,
      projectCount,
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
