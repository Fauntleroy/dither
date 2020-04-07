<script>
  import { Router } from 'svelte-router-spa';

  import routes from './routes.js';
</script>

<div class="app">
  <Router {routes} />
</div>