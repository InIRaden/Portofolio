import db from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Get all resume data
export async function GET(request) {
  try {
    const [rows] = await db.query(
      'SELECT id, section, content, order_index FROM resume_data ORDER BY section ASC, order_index ASC'
    );

    // Group by section
    const grouped = rows.reduce((acc, row) => {
      const { section, content } = row;
      if (!acc[section]) {
        acc[section] = [];
      }

      // Try parse JSON, fallback to string
      let parsed = content;
      try {
        parsed = JSON.parse(content);
      } catch {
        // keep as string for descriptions
      }

      acc[section].push(parsed);
      return acc;
    }, {});

    return NextResponse.json({ success: true, data: grouped });
  } catch (error) {
    console.error('Error fetching resume data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create resume entry
export async function POST(request) {
  try {
    const { section, content, order_index } = await request.json();
    
    const contentJson = JSON.stringify(content);
    
    const [result] = await db.query(
      'INSERT INTO resume_data (section, content, order_index) VALUES ($1, $2, $3)',
      [section, contentJson, order_index || 0]
    );
    
    return NextResponse.json({
      success: true,
      data: { id: result.insertId, section, content, order_index }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating resume entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
