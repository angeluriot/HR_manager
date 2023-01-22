<script lang="ts">
	import './tailwind.css';
	import './fonts.css';
	import './global.css';
	import Router from 'svelte-spa-router';
	import { routes } from './routes.js';
	import Menu from './lib/components/Menu.svelte';
</script>

<main class="absolute flex-row">
	<Menu/>
	<Router routes={routes}/>
</main>

<style>
</style>
