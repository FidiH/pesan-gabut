<script>
  const {data} = $props()
  $inspect(data)
</script>


<section>
  {#each data.data as item}
    <p>{item.nama}</p>
    <p>{item.pesan}</p>
    {#if item.file_url}
      <img src="{item.file_url}" alt="">
    {/if}
    <hr>
  {/each}
</section>