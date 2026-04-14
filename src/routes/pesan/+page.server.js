import {getDataPesan} from "$lib/simpanKeSupabase.js"

export async function load(){
  const data = await getDataPesan()
  
  if(!data) return {sukses: false}
  
  return {data}
}