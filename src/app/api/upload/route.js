import { NextResponse } from "next/server";
import { uploadImageToSupabase } from "@/lib/supabaseUpload";

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const publicUrl = await uploadImageToSupabase(file);

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
