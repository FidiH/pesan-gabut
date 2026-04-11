import {fail} from "@sveltejs/kit"

export const actions = {
  default: async ({request}) => {
    
    const data = await request.formData()
    
    // simpan data di variabel
    const nama = data.get("nama")?.trim()
    const pesan = data.get("pesan")?.trim()
    const file = data.get("file")
    
    // validasi nama
    if(!nama){
      return fail(400, {error: "kasih nama lah, samaran juga gpp"})
    }
    
    // validasi minimal ada pesan atau file
    const adaPesan = pesan && pesan.length > 0
    const adaFile = file && file.size > 0
    if(!adaPesan && !adaFile){
      return fail(400, {error: "masa iya setor nama doang, lu kira absen apa?"})
    }
    
    // objek data
    
    // upload cloundary jika ada file
    let fileUrl = ""
    if(adaFile){
      fileUrl = await cloundaryApi(file)
      if(fileUrl) return fail(500, "gagal nyimpen gambar, cek internetmu, jika normal bearti storage gw udah penuh :v")
    }
    
    // format data 
    const formatData = {
      tanggal: new Date().toISOString(),
      nama,
      pesan: pesan ?? "",
      fileUrl
    }
    
    // simpan ke google sheet
    const googleSheet = await KirimGoogleSheet(formatData)
    
    // respon jika ggagal
    if(KirimGoogleSheet) return fail(500, {error: "aduh, eror sih, kayaknya fidi lagi turu deh..."})
    
    // jika kode di atas lancar kirim respon
    return {sukses: true}
  }
}