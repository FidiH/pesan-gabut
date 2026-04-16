<script>
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";

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

  function resetForm() {
    formRef?.reset();
    previewUrl = null;
  }

  const submitEnhance = () => {
    loading = true;
    pesan = null;

    return async ({ result, update }) => {
      loading = false;

      if (result.type === "failure" || result.type === "error") {
        pesan = {
          tipe: "error",
          teks: result.data?.error ?? "Terjadi kesalahan, coba lagi.",
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

<section>
  {#if pesan}
    <p>{pesan.teks}</p>
  {/if}

  <form
    bind:this={formRef}
    action="/"
    method="POST"
    enctype="multipart/form-data"
    use:enhance={submitEnhance}
  >
    <div>
      <label for="nama">Nama</label>
      <input id="nama" required type="text" name="nama" disabled={loading || sisaWaktu > 0} />
    </div>

    <div>
      <label for="pesan">Pesan</label>
      <textarea id="pesan" name="pesan" disabled={loading || sisaWaktu > 0}></textarea>
    </div>

    <div>
      <label for="file">File Gambar</label>
      <input
        id="file"
        bind:this={fileInput}
        accept=".jpg, .png, .jpeg, .webp"
        type="file"
        name="file"
        disabled={loading || sisaWaktu > 0}
        onchange={handleFileChange}
      />
      {#if previewUrl}
        <img src={previewUrl} alt="preview" />
      {/if}
    </div>

    <div>
      <button type="submit" disabled={loading || sisaWaktu > 0}>
        {#if loading}
          Mengirim...
        {:else if sisaWaktu > 0}
          <!--Tunggu {sisaWaktu} detik-->
          uh.....
        {:else}
          Kirim
        {/if}
      </button>
    </div>
  </form>
</section>