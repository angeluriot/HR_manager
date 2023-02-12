<script lang="ts">
	import './tailwind.css';
	import './fonts.css';
	import './global.css';
	import Router from 'svelte-spa-router';
	import { routes } from './routes.js';
</script>

<main class="flex flex-row justify-start items-center">
	<Router routes={routes}/>
</main>

<style>
</style>
