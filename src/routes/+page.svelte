<script>
  import {enhance} from "$app/forms"
  
  const {form} = $props()
  $inspect(form)
</script>

<section>
  <div>
    {form?.error}
  </div>
  <form action="/" method="POST" enctype="multipart/form-data"use:enhance>
    
    <div><input required type="text" name="nama"></div>
    
    <div><textarea name="pesan"></textarea></div>
    
    <div><input accept=".jpg, .png, .jpeg, .webp" type="file" name="file"></div>
    
    <div><button type="submit">Kirim</button></div>
    
  </form>
</section>