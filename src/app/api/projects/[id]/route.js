import db from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Get single project by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const query = 'SELECT * FROM projects WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    const parseStack = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === 'object') return val;
      if (typeof val === 'string') {
        const s = val.trim();
        try { return JSON.parse(s); } catch {}
        const m = s.match(/^\{(.*)\}$/);
        if (m) {
          return m[1]
            .split(',')
            .map(x => x.trim())
            .map(x => x.replace(/^"(.*)"$/, '$1'))
            .filter(x => x.length);
        }
        return [s];
      }
      return [];
    };

    const project = {
      ...rows[0],
      stack: parseStack(rows[0].stack)
    };
    
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, description, category, image, stack, live_url, github_url } = body;
    
    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and category are required' },
        { status: 400 }
      );
    }
    
    // Convert stack array to JSON string
    const stackJson = JSON.stringify(stack || []);
    
    const query = `
      UPDATE projects 
      SET title = ?, description = ?, category = ?, image = ?, stack = ?, live_url = ?, github_url = ?
      WHERE id = ?
    `;
    
    const [result] = await db.query(query, [
      title,
      description,
      category,
      image || null,
      stackJson,
      live_url || null,
      github_url || null,
      id
    ]);
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: { id, ...body }
    });
    
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const query = 'DELETE FROM projects WHERE id = ?';
    const [result] = await db.query(query, [id]);
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
