import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { supabase, validateSupabaseConfig } from '@/lib/supabaseServer';

async function getRouteId(context) {
  const resolvedParams = await context?.params;
  return resolvedParams?.id;
}

function toNumberIfPossible(value) {
  const numeric = Number(value);
  return Number.isNaN(numeric) ? value : numeric;
}

// PUT - Update resume entry
export async function PUT(request, context) {
  let payload;

  try {
    const id = await getRouteId(context);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invalid resume id' },
        { status: 400 }
      );
    }

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
    console.error('Primary DB failed in resume PUT, trying Supabase:', error?.message || error);

    try {
      validateSupabaseConfig();
      const id = await getRouteId(context);

      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Invalid resume id' },
          { status: 400 }
        );
      }

      const { section, content, order_index } = payload || {};

      if (!section || typeof content === 'undefined') {
        return NextResponse.json(
          { success: false, error: 'Section and content are required' },
          { status: 400 }
        );
      }

      const recordId = toNumberIfPossible(id);
      const { data, error: supabaseError } = await supabase
        .from('resume_data')
        .update({
          section,
          content: JSON.stringify(content),
          order_index,
        })
        .eq('id', recordId)
        .select('id, section, content, order_index')
        .maybeSingle();

      if (supabaseError) {
        throw supabaseError;
      }

      if (!data) {
        return NextResponse.json(
          { success: false, error: 'Resume entry not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: data.id,
          section: data.section,
          content,
          order_index: data.order_index,
        }
      });
    } catch (fallbackError) {
      console.error('Supabase fallback failed in resume PUT:', fallbackError?.message || fallbackError);
      return NextResponse.json(
        { success: false, error: fallbackError?.message || 'Failed to update resume entry' },
        { status: 500 }
      );
    }
  }
}

// DELETE - Delete resume entry
export async function DELETE(request, context) {
  try {
    const id = await getRouteId(context);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invalid resume id' },
        { status: 400 }
      );
    }
    
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
    console.error('Primary DB failed in resume DELETE, trying Supabase:', error?.message || error);

    try {
      validateSupabaseConfig();
      const id = await getRouteId(context);

      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Invalid resume id' },
          { status: 400 }
        );
      }

      const recordId = toNumberIfPossible(id);
      const { data, error: supabaseError } = await supabase
        .from('resume_data')
        .delete()
        .eq('id', recordId)
        .select('id');

      if (supabaseError) {
        throw supabaseError;
      }

      if (!data || data.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Resume entry not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Resume entry deleted'
      });
    } catch (fallbackError) {
      console.error('Supabase fallback failed in resume DELETE:', fallbackError?.message || fallbackError);
      return NextResponse.json(
        { success: false, error: fallbackError?.message || 'Failed to delete resume entry' },
        { status: 500 }
      );
    }
  }
}
