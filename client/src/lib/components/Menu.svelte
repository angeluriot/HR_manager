<script lang="ts">
	import Global from '../shared/Global.js';
</script>

<nav class="fixed flex flex-col left-0 top-0 justify-start items-start">
	<span class="text-2xl">PoPS2223</span>
	<a href="#/">Accueil</a>
	<a href="#/statistics">Statistiques</a>
	<a href="#/requests">Demandes</a>
	<a href="#/notifications">Notifications</a>
	<a href="#/account">Compte</a>
	<a href="#/settings">Paramètres</a>
	{#if Global.user}
		<span>{Global.user.first_name} {Global.user.last_name}</span>
	{/if}
</nav>

<style>
	nav {
		width: 300px;
		height: 100%;
	}
</style>
