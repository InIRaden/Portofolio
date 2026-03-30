import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { supabase, validateSupabaseConfig } from '@/lib/supabaseServer';

function parseResumeContent(content) {
  if (typeof content !== 'string') return content;

  try {
    return JSON.parse(content);
  } catch {
    return content;
  }
}

function groupResumeRows(rows = []) {
  return rows.reduce((acc, row) => {
    const section = row.section;
    if (!acc[section]) {
      acc[section] = [];
    }

    acc[section].push(parseResumeContent(row.content));
    return acc;
  }, {});
}

// GET - Get all resume data
export async function GET(request) {
  try {
    const [rows] = await db.query(
      'SELECT id, section, content, order_index FROM resume_data ORDER BY section ASC, order_index ASC'
    );

    const grouped = groupResumeRows(rows);

    return NextResponse.json({ success: true, data: grouped });
  } catch (error) {
    console.error('Primary DB failed in resume GET, trying Supabase:', error?.message || error);

    try {
      validateSupabaseConfig();

      const { data, error: supabaseError } = await supabase
        .from('resume_data')
        .select('id, section, content, order_index')
        .order('section', { ascending: true })
        .order('order_index', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      return NextResponse.json({
        success: true,
        data: groupResumeRows(data || []),
      });
    } catch (fallbackError) {
      console.error('Supabase fallback failed in resume GET:', fallbackError?.message || fallbackError);
      return NextResponse.json(
        { success: false, error: fallbackError?.message || 'Failed to fetch resume data' },
        { status: 500 }
      );
    }
  }
}

// POST - Create resume entry
export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
    const { section, content, order_index } = payload;

    if (!section || typeof content === 'undefined') {
      return NextResponse.json(
        { success: false, error: 'Section and content are required' },
        { status: 400 }
      );
    }
    
    const contentJson = JSON.stringify(content);
    
    const [result] = await db.query(
      'INSERT INTO resume_data (section, content, order_index) VALUES ($1, $2, $3)',
      [section, contentJson, order_index || 0]
    );
    
    return NextResponse.json({
      success: true,
      data: { id: result.insertId, section, content, order_index: order_index || 0 }
    }, { status: 201 });
  } catch (error) {
    console.error('Primary DB failed in resume POST, trying Supabase:', error?.message || error);

    try {
      validateSupabaseConfig();

      const { section, content, order_index } = payload || {};

      if (!section || typeof content === 'undefined') {
        return NextResponse.json(
          { success: false, error: 'Section and content are required' },
          { status: 400 }
        );
      }

      const { data, error: supabaseError } = await supabase
        .from('resume_data')
        .insert({
          section,
          content: JSON.stringify(content),
          order_index: order_index || 0,
        })
        .select('id, section, content, order_index')
        .maybeSingle();

      if (supabaseError) {
        throw supabaseError;
      }

      return NextResponse.json(
        {
          success: true,
          data: {
            id: data?.id,
            section,
            content,
            order_index: data?.order_index ?? order_index ?? 0,
          },
        },
        { status: 201 }
      );
    } catch (fallbackError) {
      console.error('Supabase fallback failed in resume POST:', fallbackError?.message || fallbackError);
      return NextResponse.json(
        { success: false, error: fallbackError?.message || 'Failed to create resume entry' },
        { status: 500 }
      );
    }
  }
}
