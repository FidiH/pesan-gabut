<script>
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  
  //=== cooldown user ===\\
  // state waktu
  const COOLDOWN_MS = 2 * 60 * 1000; // 2 menit
  const STORAGE_KEY = "last_submit";

  let sisaWaktu = $state(0);
  let interval = null;
  
  // mount di client
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
  
  //=== logic ketika user submit ==\\
  const submitEnhance = () => {
    // simpan waktu saat ini
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    sisaWaktu = COOLDOWN_MS / 1000;
    mulaiTimer();
  
    return async ({ result, update }) => {
      if (result.type === "failure" || result.type === "error") {
        // cancel cooldown
        localStorage.removeItem(STORAGE_KEY);
        sisaWaktu = 0;
        clearInterval(interval);
      }
  
      await update();
    };
  };
  
  //=== balasan dari server ==\
  const {form} =$props()
  $inspect(form)
  
  //=== preview img ==\\
  let previewUrl = $state(null)
  
  function tanganiFile(e){
    const file = e.target.files[0];
    
    // Revoke URL lama untuk mencegah memory leak
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      previewUrl = URL.createObjectURL(file);
    }
    
  }
  
</script>

<section class="p-7">
  {#if form?.sukses || form}
    <p class="text-red-400">{form?.pesan}</p>
  {/if}
  <form
    action="/"
    method="POST"
    enctype="multipart/form-data"
    use:enhance={submitEnhance}
  >
    <!--input nama-->
    <div>
      <input required type="text" name="nama" />
    </div>
    
    <!--input pesan-->
    <div>
      <textarea name="pesan"></textarea>
    </div>
    
    <!--input file-->
    <div>
      <input accept=".jpg, .png, .jpeg, .webp" type="file" name="file"  onchange={tanganiFile}/>
    </div>
  
    <!--preview img-->
    {#if previewUrl}
    <div>
      <img src={previewUrl} alt="preview">
    </div>
    {/if}
    
    <div>
      <button type="submit" disabled={sisaWaktu > 0}>
        {#if sisaWaktu > 0}
          Tunggu {sisaWaktu} detik
        {:else}
          Kirim
        {/if}
      </button>
    </div>
    
  </form>
  
</section>

<style>
</style>