<script context="module">
  export function preload (page) {
    const { params } = page;

    return { params };
  }
</script>

<script>
  import Filmstrip from '../../components/filmstrip.svelte';

  export let params;
</script>

<svelte:head>
	<title>Room {params.id}</title>
</svelte:head>

<h1>Room {params.id}</h1>

<div class='content'>
	This is room {params.id}.

  <Filmstrip />
</div>