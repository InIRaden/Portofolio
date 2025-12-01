import { supabase, validateSupabaseConfig } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

// GET - Get active CV
export async function GET() {
  try {
    validateSupabaseConfig();
    
    const { data, error } = await supabase
      .from("cv_files")
      .select("*")
      .eq("is_active", true)
      .order("uploaded_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || null });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST - Upload CV
export async function POST(request) {
  try {
    validateSupabaseConfig();
    
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ success: false, error: "Only PDF allowed" }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File too large. Max 10MB" }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate filename
    const timestamp = Date.now();
    const filename = `cv-${timestamp}.pdf`;

    console.log(`📄 Uploading CV: ${filename}, size: ${buffer.length} bytes`);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("cv")
      .upload(filename, buffer, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ Upload error:", uploadError);
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("cv").getPublicUrl(filename);
    const publicUrl = urlData.publicUrl;

    console.log(`✅ CV uploaded successfully: ${publicUrl}`);

    // Deactivate old CVs
    await supabase.from("cv_files").update({ is_active: false }).neq("id", 0);

    // Insert into DB
    const { data: inserted, error: insertError } = await supabase
      .from("cv_files")
      .insert({
        file_name: filename,
        file_path: publicUrl,
        file_size: buffer.length,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("❌ DB insert error:", insertError);
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: inserted });
  } catch (err) {
    console.error("❌ CV upload error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE - Delete CV
export async function DELETE(request) {
  try {
    validateSupabaseConfig();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "CV ID required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("cv_files")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    // delete from storage
    await supabase.storage.from("cv").remove([data.file_name]);

    // delete from DB
    const { error: deleteError } = await supabase
      .from("cv_files")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "CV deleted successfully" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
