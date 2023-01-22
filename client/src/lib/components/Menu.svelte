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
	}
</script>

<nav class="relative flex flex-col left-0 top-0 justify-start items-start #f1f1f1">
	<span class="text-2xl">
    <img src="/img/Logo_Reseau_Polytech.svg" alt="Logo Polytech" style="margin:auto;">
    <p style="color:#007AFF; font-family:'Times New Roman', Times, serif; font-style: oblique;" >PoPS2223</p>
  </span>
	{#each routes as route}
            <a href={route.link} on:click={() => navChange(route.item)} class:active={route.item===activeItem}>
				{route.item}
			</a>
  {/each}
  <span style="font-family:'Times New Roman', Times, serif;">Nom Prénom</span>
</nav>

<style>

span {
  position: relative;
  margin: auto;
}

img {
  max-width: 50px;
}

nav {
  background-color: #f1f1f1;
  height: 100%; /* Full height */
  gap: 8px;
}

a {
  display: block;
  width: 200px;
  color: #000;
  padding: 8px 16px;
  border-radius: 8px;
  text-align: center;
  text-decoration:none;
  font-family:'Times New Roman', Times, serif;
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