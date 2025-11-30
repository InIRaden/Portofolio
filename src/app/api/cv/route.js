import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// GET - Get active CV
export async function GET(request) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM cv_files WHERE is_active = TRUE ORDER BY uploaded_at DESC LIMIT 1'
    );
    
    return NextResponse.json({
      success: true,
      data: rows[0] || null
    });
  } catch (error) {
    console.error('Error fetching CV:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Upload CV
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const timestamp = Date.now();
    const filename = `cv-${timestamp}.pdf`;
    
    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cv');
    await mkdir(uploadDir, { recursive: true });
    
    // Save file
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    
    const publicUrl = `/uploads/cv/${filename}`;
    
    // Deactivate old CVs
    await db.query('UPDATE cv_files SET is_active = FALSE');
    
    // Insert new CV
    const [result] = await db.query(
      'INSERT INTO cv_files (file_name, file_path, file_size, is_active) VALUES (?, ?, ?, TRUE)',
      [filename, publicUrl, buffer.length]
    );
    
    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        file_name: filename,
        file_path: publicUrl,
        file_size: buffer.length
      }
    });
    
  } catch (error) {
    console.error('Error uploading CV:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete CV
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'CV ID required' },
        { status: 400 }
      );
    }
    
    const [result] = await db.query('DELETE FROM cv_files WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'CV not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'CV deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting CV:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
