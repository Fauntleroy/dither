<script>
  import { Router } from 'svelte-router-spa';

  import routes from './routes.js';
  import { colorPalette } from './store.js';

  
</script>

<div class="app">
  <Router {routes} />
</div>