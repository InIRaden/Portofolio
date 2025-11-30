import db from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Get all projects or filter by category
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let query = 'SELECT * FROM projects ORDER BY created_at DESC';
    let params = [];
    
    if (category && category !== 'all projects') {
      query = 'SELECT * FROM projects WHERE category = ? ORDER BY created_at DESC';
      params = [category];
    }
    
    const [rows] = await db.query(query, params);
    
    // Parse stack robustly (handles JSON string, PG array literal, or already-array)
    const parseStack = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === 'object') return val;
      if (typeof val === 'string') {
        const s = val.trim();
        // Try JSON first
        try { return JSON.parse(s); } catch {}
        // Try Postgres array literal: {"HTML","CSS"} or {HTML,CSS}
        const m = s.match(/^\{(.*)\}$/);
        if (m) {
          return m[1]
            .split(',')
            .map(x => x.trim())
            .map(x => x.replace(/^"(.*)"$/, '$1'))
            .filter(x => x.length);
        }
        // Fallback to single-item array
        return [s];
      }
      return [];
    };

    const projects = rows.map(project => ({
      ...project,
      stack: parseStack(project.stack)
    }));
    
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new project
export async function POST(request) {
  try {
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
      INSERT INTO projects (title, description, category, image, stack, live_url, github_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(query, [
      title,
      description,
      category,
      image || null,
      stackJson,
      live_url || null,
      github_url || null
    ]);
    
    return NextResponse.json({
      success: true,
      data: { id: result.insertId, ...body }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
