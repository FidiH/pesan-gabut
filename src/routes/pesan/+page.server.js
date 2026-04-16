import {getDataPesan} from "$lib/simpanKeSupabase.js"

export async function load({ setHeaders }) {
  const data = await getDataPesan();

  setHeaders({
    "cache-control": "public, max-age=60" // cache 60 detik
  });

  return { data: data ?? [] };
}