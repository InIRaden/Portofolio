import db from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Get all contact info
export async function GET(request) {
  try {
    const [rows] = await db.query('SELECT * FROM contact_info');
    
    // Convert to object format
    const contactInfo = {};
    rows.forEach(row => {
      contactInfo[row.field_name] = row.field_value;
    });
    
    return NextResponse.json({ success: true, data: contactInfo });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Update contact info
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Update each field
    for (const [fieldName, fieldValue] of Object.entries(body)) {
      await db.query(
        'INSERT INTO contact_info (field_name, field_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE field_value = ?',
        [fieldName, fieldValue, fieldValue]
      );
    }
    
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
