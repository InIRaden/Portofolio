import db from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Get all projects
export async function GET() {
  try {
    console.log('🔍 Fetching projects from database...');
    const query = 'SELECT * FROM projects ORDER BY created_at DESC';
    const [rows] = await db.query(query);
    
    console.log(`✅ Found ${rows?.length || 0} projects`);
    
    // Parse stack for each project
    const projects = rows.map(project => {
      let stack = [];
      if (project.stack) {
        if (Array.isArray(project.stack)) {
          stack = project.stack;
        } else if (typeof project.stack === 'string') {
          try {
            stack = JSON.parse(project.stack);
          } catch {
            // Handle PostgreSQL array format: {item1,item2,item3}
            const cleaned = project.stack.replace(/^\{|\}$/g, '').replace(/"/g, '');
            stack = cleaned ? cleaned.split(',').map(s => s.trim()) : [];
          }
        }
      }
      return { ...project, stack };
    });
    
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
    
    if (!title || !description || !category) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and category are required' },
        { status: 400 }
      );
    }
    
    const stackJson = JSON.stringify(stack || []);
    
    const query = `
      INSERT INTO projects (title, description, category, image, stack, live_url, github_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, title, description, category, image, stack, live_url, github_url, created_at
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
    
    // Parse stack back for response
    let parsedStack = stack;
    if (result[0]?.stack) {
      try {
        parsedStack = JSON.parse(result[0].stack);
      } catch {
        parsedStack = stack;
      }
    }
    
    return NextResponse.json({
      success: true,
      data: { ...result[0], stack: parsedStack }
    });
    
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
