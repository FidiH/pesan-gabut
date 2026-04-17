<script>
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  
  import BG from "$lib/assets/Bg.mp4";
  import STIKER1 from "$lib/assets/stiker1.webp";
  
  const COOLDOWN_MS = 2 * 60 * 1000;
  const STORAGE_KEY = "last_submit";

  let sisaWaktu = $state(0);
  let loading = $state(false);
  let pesan = $state(null); // { tipe: "sukses" | "error", teks: string }
  let previewUrl = $state(null);
  let interval = null;

  let formRef = $state(null);
  let fileInput = $state(null);

  onMount(() => {
    cekCooldown();
    return () => clearInterval(interval);
  });

  function cekCooldown() {
    const lastSubmit = localStorage.getItem(STORAGE_KEY);
    if (!lastSubmit) return;

    const selisih = Date.now() - parseInt(lastSubmit);
    const sisa = COOLDOWN_MS - selisih;

    if (sisa > 0) {
      sisaWaktu = Math.ceil(sisa / 1000);
      mulaiTimer();
    }
  }

  function mulaiTimer() {
    clearInterval(interval);
    interval = setInterval(() => {
      sisaWaktu -= 1;
      if (sisaWaktu <= 0) {
        sisaWaktu = 0;
        clearInterval(interval);
      }
    }, 1000);
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      previewUrl = null;
      return;
    }
    previewUrl = URL.createObjectURL(file);
  }
  
  function hapusFile(){
    fileInput = null;
    previewUrl = null;
  }

  function resetForm() {
    formRef?.reset();
    previewUrl = null;
  }

  const submitEnhance = () => {
    loading = true;
    pesan = null;

    return async ({ result, update }) => {
      loading = false;
      console.log(result)
      if (result.type === "failure" || result.type === "error") {
        pesan = {
          tipe: "error",
          teks: result.data?.pesan ?? "Terjadi kesalahan, coba lagi.",
        };
        localStorage.removeItem(STORAGE_KEY);
        sisaWaktu = 0;
        clearInterval(interval);
      }

      if (result.type === "success") {
        pesan = { tipe: "sukses", teks: "Pesan berhasil dikirim!" };
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
        sisaWaktu = COOLDOWN_MS / 1000;
        mulaiTimer();
        resetForm();
      }

      await update({ reset: false });
    };
  };
</script>

<section class="h-screen w-screen">
  
  <div id="bgVideo" class="fixed -z-50 flex justify-center items-center">
    <video class="scale-125 fixed top-0 left-0 w-screen h-screen" src="{BG}" muted autoplay loop></video>
    <div class="absolute top-0 left-0 bg-gradient-to-b from-gray-500/50 to-gray-700/10 z-50 w-screen h-screen"></div>
  </div>
  
  {#if pesan}
  <div class="p-4">
    <p class="p-2 text-sm rounded-xl bg-gradient-to-tr from-orange-400/80 to-amber-200/70 border border-amber-300 text-white">{pesan?.teks}</p>
  </div>
  {/if}

  <form
    class="p-7"
    bind:this={formRef}
    action="/"
    method="POST"
    enctype="multipart/form-data"
    use:enhance={submitEnhance}
  >
    <div>
      <!--<label for="nama">Nama</label>-->
      <input 
        class="inputStyle" 
        id="nama" 
        placeholder="ex: Pidoy_kece"
        required 
        minlength="5"
        type="text" 
        name="nama" 
        disabled={loading || sisaWaktu > 0} />
    </div>

    <div>
      <!--<label for="pesan">Pesan</label>-->
      <textarea 
        class="inputStyle h-28"
        id="pesan" 
        name="pesan" 
        minlength="10"
        placeholder="ex: P, infokan"
        disabled={loading || sisaWaktu > 0}></textarea>
    </div>

    <div>
      <label for="file" class="px-2 py-1 bg-sky-400/90 rounded-lg text-white font-bold my-5 w-fit block">{previewUrl ? "Ganti" : "Gambar"}</label>
      <input
        hidden="true"
        id="file"
        bind:this={fileInput}
        accept=".jpg, .png, .jpeg, .webp"
        type="file"
        name="file"
        disabled={loading || sisaWaktu > 0}
        onchange={handleFileChange}
      />
      {#if previewUrl}
        <div class="relative pb-50">
          <button 
            disabled={loading || sisaWaktu > 0}
            onclick="{hapusFile}"
            type="button" 
            class="absolute -top-3 -right-3 rounded-full z-50 bg-gray-100 rotate-45 flex justify-center items-center text-2xl w-7 h-7 text-red-500">+</button>
         <img class="rounded-xl drop-shadow-lg" src={previewUrl} alt="preview" />
        </div>
      {/if}
    </div>

    <div class="fixed left-0 w-screen bg-gradient-to-b from-gray-50/10 to-gray-400/80 bottom-0 p-7 flex justify-center rounded-t-3xl items-center h-24">
      <button class="bg-sky-400/80 py-1 px-3 font-bold
       rounded-xl shadow text-white block" type="submit" disabled={loading || sisaWaktu > 0}>
        {#if loading}
          Mengirim...
        {:else if sisaWaktu > 0}
          <!--Tunggu {sisaWaktu} detik-->
          uh..... <img class="inline" width="50px" src="{STIKER1}" alt="">
        {:else}
          Kirim
        {/if}
      </button>
    </div>
  </form>
</section>


<style>
  @reference "tailwindcss";
  
  .inputStyle{
    @apply w-full px-2 py-1 bg-gray-50/40 text-gray-50 font-bold rounded-lg mt-7 outline-0;
    filter: drop-shadow(5px 5px 0 #0909097a);
  }
</style>