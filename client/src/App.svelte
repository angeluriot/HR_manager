<script lang="ts">
	import './tailwind.css';
	import './fonts.css';
	import './global.css';
	import Router from 'svelte-spa-router';
	import { routes } from './routes.js';
</script>

<main>
	<Router routes={routes}/>
</main>

<style>
</style>
