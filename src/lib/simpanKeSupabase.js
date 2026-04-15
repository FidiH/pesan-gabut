import { SUPABASE_URL, SUPABASE_ANON_KEY } from "$env/static/private";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function simpanKeSupabase(data) {
  console.log("TANGGAL VALUE:", data.tanggal);
  console.log("TANGGAL TYPE:", typeof data.tanggal);
  try {
    const { error } = await supabase.from("pesan").insert({
      tanggal: new Date(data.tanggal).toISOString(),
      nama: data.nama,
      pesan: data.pesan,
      file_url: data.fileUrl,
    });

    if (error) {
      console.log("SUPABASE ERROR:", error.message);
      return {sukses: false, error};
    }

    return {sukses: true};;
  } catch (e) {
    console.log("ERROR:", e);
    return false;
  }
}

export async function getDataPesan() {
  try {
    const { data, error } = await supabase
      .from("pesan")
      .select("*")
      .order("tanggal", { ascending: false });

    if (error) {
      return {sukses: false, error};
    }

    return data;
    
  } catch (e) {
    return {error: `ERROR: ${e}`};
  }
}