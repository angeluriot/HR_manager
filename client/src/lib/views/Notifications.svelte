<script lang="ts">
	import Notification from "../components/Notification.svelte";
</script>

<div class="main gap-10 w-full">
	<h1>Notifications</h1>
	<div class="flex flex-col gap-6">
		{#each Array(3) as _}
			<Notification/>
		{/each}
	</div>
</div>

<style>
</style>
