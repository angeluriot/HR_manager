<script lang="ts">
    import { link } from "svelte-spa-router";


	let routes =  [{link:"/#/", item:"Accueil"},
				  {link:"/#/statistics", item:"Statistiques"},
				  {link:"/#/requests", item:"Demandes"},
				  {link:"#/notifications", item:"Notifications"},
				  {link:"/#/account", item:"Compte"},
				  {link:"/#/settings", item:"Paramètres"}];

	let activeItem = "Accueil";

	const navChange = (item:string) => {
		activeItem = item;
		console.log(activeItem);
	}
</script>

<nav class="fixed flex flex-col left-0 top-0 justify-start items-start">
	<span class="text-2xl">PoPS2223</span>
	{#each routes as route}
            <a href={route.link} on:click={() => navChange(route.item)} class:active={route.item===activeItem}>
				{route.item}
			</a>
    {/each}
</nav>

<style>

nav {
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 200px;
  background-color: #f1f1f1;
  height: 100%; /* Full height */
  position: fixed; /* Make it stick, even on scroll */
  overflow: auto; /* Enable scrolling if the sidenav has too much content */
}

a {
  display: block;
  width: 200px;
  color: #000;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
}

/* Change the link color on hover */
a:hover {
  background-color: #555;
  color: white;
}

.active {
  background-color: #007AFF;
  color: white;
}
</style>