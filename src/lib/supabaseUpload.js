import { supabase } from "./supabaseServer";

export async function uploadImageToSupabase(file) {
  try {
    // Convert File → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/\s+/g, "-")}`;

    // Upload to Supabase
    const { error } = await supabase.storage
      .from("rmahesa-images")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw new Error(error.message);

    // Get public URL
    const { data } = supabase.storage
      .from("rmahesa-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  }
}
