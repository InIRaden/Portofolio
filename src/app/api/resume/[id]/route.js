import db from '@/lib/db';
import { NextResponse } from 'next/server';

// PUT - Update resume entry
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { section, content, order_index } = await request.json();
    
    const contentJson = JSON.stringify(content);
    
    const [result] = await db.query(
      'UPDATE resume_data SET section = ?, content = ?, order_index = ? WHERE id = ?',
      [section, contentJson, order_index, id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Resume entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: { id, section, content, order_index }
    });
  } catch (error) {
    console.error('Error updating resume entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete resume entry
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const [result] = await db.query('DELETE FROM resume_data WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Resume entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Resume entry deleted'
    });
  } catch (error) {
    console.error('Error deleting resume entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
