import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    console.log('🔍 DB Check: Starting database connection test...');
    console.log('📌 DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    // Basic info
    const [verRows] = await db.query('select version()');
    const [dbRows] = await db.query('select current_database() as name');
    const [tabRows] = await db.query(
      'select count(*)::int as count from information_schema.tables where table_schema = $1',
      ['public']
    );

    // Optional: try to count known table
    let projectCount = null;
    let projectSample = null;
    try {
      const [prjRows] = await db.query('select count(*)::int as count from projects');
      projectCount = prjRows[0]?.count ?? 0;
      
      // Get sample project
      const [sample] = await db.query('select id, title from projects limit 1');
      projectSample = sample?.[0] || null;
    } catch (err) {
      console.error('❌ Error querying projects:', err.message);
      projectCount = `Error: ${err.message}`;
    }

    console.log('✅ DB Check: Success!');
    console.log('📊 Projects:', projectCount);

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV || 'unknown',
      hasEnvVar: !!process.env.DATABASE_URL,
      version: verRows?.[0]?.version ?? null,
      database: dbRows?.[0]?.name ?? null,
      publicTables: tabRows?.[0]?.count ?? 0,
      projectCount,
      projectSample,
    });
  } catch (e) {
    console.error('❌ DB Check failed:', e);
    return NextResponse.json({ 
      success: false, 
      error: String(e),
      hasEnvVar: !!process.env.DATABASE_URL,
      environment: process.env.NODE_ENV || 'unknown',
    }, { status: 500 });
  }
}
