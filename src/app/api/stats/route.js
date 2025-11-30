import db from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Get all stats
export async function GET(request) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM stats ORDER BY display_order ASC'
    );
    
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update stats
export async function PUT(request) {
  try {
    const body = await request.json();
    const { stats } = body;
    
    if (!stats || !Array.isArray(stats)) {
      return NextResponse.json(
        { success: false, error: 'Stats array is required' },
        { status: 400 }
      );
    }
    
    // Update each stat
    for (const stat of stats) {
      await db.query(
        'UPDATE stats SET stat_value = ?, stat_label = ? WHERE stat_key = ?',
        [stat.stat_value, stat.stat_label, stat.stat_key]
      );
    }
    
    return NextResponse.json({ success: true, message: 'Stats updated successfully' });
  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new stat
export async function POST(request) {
  try {
    const body = await request.json();
    const { stat_key, stat_value = 0, stat_label, display_order = 0 } = body;

    if (!stat_key || !stat_label) {
      return NextResponse.json(
        { success: false, error: 'stat_key and stat_label are required' },
        { status: 400 }
      );
    }

    await db.query(
      'INSERT INTO stats (stat_key, stat_value, stat_label, display_order) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE stat_value = VALUES(stat_value), stat_label = VALUES(stat_label), display_order = VALUES(display_order)',
      [stat_key, stat_value, stat_label, display_order]
    );

    return NextResponse.json({ success: true, message: 'Stat created/updated successfully' });
  } catch (error) {
    console.error('Error creating stat:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a stat by key
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Query param key is required' },
        { status: 400 }
      );
    }

    const [result] = await db.query('DELETE FROM stats WHERE stat_key = ?', [key]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Stat not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Stat deleted successfully' });
  } catch (error) {
    console.error('Error deleting stat:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
