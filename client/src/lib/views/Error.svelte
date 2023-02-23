<script lang="ts">
	import { onMount } from "svelte";

	let unique = {};

	function restart()
	{
		unique = {}
	}

	onMount(() =>
	{
		window.location.href = "#/";
	});
</script>

{#key unique}
	<div class="main gap-10">
		<h1>404</h1>
	</div>
{/key}

<style>
	h1
	{
		font-family: "Nunito-Bold";
		font-size: 35px;
		color: #09244B;
	}
</style>
