import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { supabase, validateSupabaseConfig } from '@/lib/supabaseServer';

function parseStackValue(rawStack) {
  let stack = [];

  if (!rawStack) {
    return stack;
  }

  if (Array.isArray(rawStack)) {
    return rawStack;
  }

  if (typeof rawStack === 'string') {
    try {
      return JSON.parse(rawStack);
    } catch {
      // Handle PostgreSQL array format: {item1,item2,item3}
      const cleaned = rawStack.replace(/^\{|\}$/g, '').replace(/"/g, '');
      return cleaned ? cleaned.split(',').map((s) => s.trim()) : [];
    }
  }

  return stack;
}

// GET - Get all projects
export async function GET() {
  try {
    console.log('🔍 Fetching projects from database...');
    const query = 'SELECT * FROM projects ORDER BY created_at DESC';
    const [rows] = await db.query(query);
    
    console.log(`✅ Found ${rows?.length || 0} projects`);
    
    // Parse stack for each project
    const projects = rows.map((project) => {
      const stack = parseStackValue(project.stack);
      return { ...project, stack };
    });
    
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('❌ Primary DB query failed, trying Supabase fallback:', error?.message || error);

    try {
      validateSupabaseConfig();

      const { data, error: supabaseError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      const projects = (data || []).map((project) => ({
        ...project,
        stack: parseStackValue(project.stack),
      }));

      console.log(`✅ Supabase fallback success, found ${projects.length} projects`);
      return NextResponse.json({ success: true, data: projects });
    } catch (fallbackError) {
      console.error('❌ Supabase fallback failed:', fallbackError?.message || fallbackError);

      const missingConfig =
        !process.env.DATABASE_URL &&
        !process.env.POSTGRES_URL &&
        !process.env.POSTGRES_CONNECTION_STRING &&
        (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY);

      return NextResponse.json(
        {
          success: false,
          error: missingConfig
            ? 'Database configuration is missing. Set DATABASE_URL or SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.'
            : fallbackError?.message || 'Failed to fetch projects',
        },
        { status: missingConfig ? 503 : 500 }
      );
    }
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
