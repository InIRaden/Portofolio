import { uploadImageToSupabase } from "@/lib/supabaseUpload";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const url = await uploadImageToSupabase(file);

    return NextResponse.json({ success: true, url });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
