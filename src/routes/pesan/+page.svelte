<script>
  const {data} = $props()
  $inspect(data.data)
</script>


<section class="p-7">
  {#each data.data as item}
  <details class="group rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden my-5">

    <summary class="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-50 hover:bg-gray-100 transition-colors">
      <div class="flex items-center gap-3">
        <span class="text-lg font-semibold text-gray-800">{item?.nama}</span>
        <!--<span class="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Arsip</span>-->
      </div>
      <svg class="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>
    <div class="px-5 py-4 space-y-4">

      <!-- Tanggal -->
      <div class="flex items-center gap-1 text-sm text-gray-500">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{new Date(item?.tanggal).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',hour: '2-digit',minute: '2-digit'})}</span>
      </div>

      <!-- Pesan -->
      <p class="text-sm text-gray-600 leading-relaxed">
        {item?.pesan}
      </p>

      <!-- Gambar -->
      {#if item.file_url}
      <img
      loading="lazy"
      src="{item?.file_url}"
      alt="Gambar arsip"
      class="w-full rounded-xl"
      />
      {/if}

  </div>
</details>
{/each}
</section>