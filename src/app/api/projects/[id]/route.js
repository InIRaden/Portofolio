import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { supabase, validateSupabaseConfig } from '@/lib/supabaseServer';

function parseStackValue(rawStack) {
  if (!rawStack) return [];
  if (Array.isArray(rawStack)) return rawStack;

  if (typeof rawStack === 'string') {
    const stackString = rawStack.trim();

    try {
      const parsed = JSON.parse(stackString);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // Handle PostgreSQL array format: {item1,item2}
      const pgArrayMatch = stackString.match(/^\{(.*)\}$/);
      if (pgArrayMatch) {
        return pgArrayMatch[1]
          .split(',')
          .map((item) => item.trim())
          .map((item) => item.replace(/^"(.*)"$/, '$1'))
          .filter((item) => item.length > 0);
      }
      return [stackString];
    }
  }

  if (typeof rawStack === 'object') {
    return [rawStack];
  }

  return [];
}

async function getRouteId(context) {
  const resolvedParams = await context?.params;
  return resolvedParams?.id;
}

function toNumberIfPossible(value) {
  const numeric = Number(value);
  return Number.isNaN(numeric) ? value : numeric;
}

// GET - Get single project by ID
export async function GET(request, context) {
  try {
    const id = await getRouteId(context);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invalid project id' },
        { status: 400 }
      );
    }

    const query = 'SELECT * FROM projects WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    const project = {
      ...rows[0],
      stack: parseStackValue(rows[0].stack)
    };
    
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('Primary DB failed in project GET, trying Supabase:', error?.message || error);

    try {
      validateSupabaseConfig();
      const id = await getRouteId(context);

      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Invalid project id' },
          { status: 400 }
        );
      }

      const projectId = toNumberIfPossible(id);
      const { data, error: supabaseError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();

      if (supabaseError) {
        throw supabaseError;
      }

      if (!data) {
        return NextResponse.json(
          { success: false, error: 'Project not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          ...data,
          stack: parseStackValue(data.stack),
        },
      });
    } catch (fallbackError) {
      console.error('Supabase fallback failed in project GET:', fallbackError?.message || fallbackError);
      return NextResponse.json(
        { success: false, error: fallbackError?.message || 'Failed to fetch project' },
        { status: 500 }
      );
    }
  }
}

// PUT - Update project
export async function PUT(request, context) {
  let body;

  try {
    const id = await getRouteId(context);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invalid project id' },
        { status: 400 }
      );
    }

    body = await request.json();
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
      data: { ...body, id }
    });
    
  } catch (error) {
    console.error('Primary DB failed in project PUT, trying Supabase:', error?.message || error);

    try {
      validateSupabaseConfig();
      const id = await getRouteId(context);

      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Invalid project id' },
          { status: 400 }
        );
      }

      if (!body || typeof body !== 'object') {
        return NextResponse.json(
          { success: false, error: 'Invalid request body' },
          { status: 400 }
        );
      }

      const { title, description, category, image, stack, live_url, github_url } = body;

      if (!title || !description || !category) {
        return NextResponse.json(
          { success: false, error: 'Title, description, and category are required' },
          { status: 400 }
        );
      }

      const payload = {
        title,
        description,
        category,
        image: image || null,
        stack: JSON.stringify(stack || []),
        live_url: live_url || null,
        github_url: github_url || null,
      };

      const projectId = toNumberIfPossible(id);
      const { data, error: supabaseError } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', projectId)
        .select('*')
        .maybeSingle();

      if (supabaseError) {
        throw supabaseError;
      }

      if (!data) {
        return NextResponse.json(
          { success: false, error: 'Project not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          ...data,
          stack: parseStackValue(data.stack),
        },
      });
    } catch (fallbackError) {
      console.error('Supabase fallback failed in project PUT:', fallbackError?.message || fallbackError);
      return NextResponse.json(
        { success: false, error: fallbackError?.message || 'Failed to update project' },
        { status: 500 }
      );
    }
  }
}

// DELETE - Delete project
export async function DELETE(request, context) {
  try {
    const id = await getRouteId(context);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invalid project id' },
        { status: 400 }
      );
    }

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
    console.error('Primary DB failed in project DELETE, trying Supabase:', error?.message || error);

    try {
      validateSupabaseConfig();
      const id = await getRouteId(context);

      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Invalid project id' },
          { status: 400 }
        );
      }

      const projectId = toNumberIfPossible(id);
      const { data, error: supabaseError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .select('id');

      if (supabaseError) {
        throw supabaseError;
      }

      if (!data || data.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Project not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (fallbackError) {
      console.error('Supabase fallback failed in project DELETE:', fallbackError?.message || fallbackError);
      return NextResponse.json(
        { success: false, error: fallbackError?.message || 'Failed to delete project' },
        { status: 500 }
      );
    }
  }
}
