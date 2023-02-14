<script lang="ts">
	import Global from '../../shared/Global.js';
	import PolytechLogo from '../../../assets/shapes/PolytechLogo.svg';
	import Logo from './Logo.svelte';
	import Logout from '../../../assets/shapes/Logout.svg';
	import * as Cookie from '../../shared/cookie.js';
	import * as Server from '../../shared/server.js';

	export let active: string;

	const pages = [
		{ text: "Accueil",			link: "#/" },
		{ text: "Statistiques",		link: "#/statistics" },
		{ text: "Demandes",			link: "#/requests" },
		{ text: "Notifications",	link: "#/notifications" },
		{ text: "Compte",			link: "#/account" },
		{ text: "Paramètres",		link: "#/settings" }
	];

	let token = Cookie.get_token();

	if (!token)
		Server.logout();

	let photo_url = Global.server_url + "photo?" + new URLSearchParams({ token });
</script>

<nav class="flex flex-col left-0 top-0 justify-between items-center p-6 h-full gap-8">
	<div class="flex flex-col justify-start items-center gap-3 select-none">
		<a href="#/" class="flex flex-row justify-center items-center gap-3 m-3 mb-5">
			<img src={PolytechLogo} alt="Logo" class="w-7">
			<span id="logo">PoPS2223</span>
		</a>
		{#each pages as page}
			<a href={page.link} class="page-a flex flex-row justify-between items-center rounded-lg {page.text === active ? "active" : ""}">
				<div class="flex flex-row justify-start items-center rounded-lg gap-3">
					<div class="page-logo w-5">
						<Logo page={page.text} color={page.text === active ? "white" : "#8491A5"}/>
						{#if page.text === "Notifications" && Global.nb_notifications > 0 && page.text !== active}
							<div class="notif-red absolute"></div>
						{/if}
					</div>
					<span class="page-text">{page.text}</span>
				</div>
				<div>
					{#if page.text === "Demandes" && Global.request_pending}
						<div class="request-circle"></div>
					{/if}
					{#if page.text === "Notifications" && Global.nb_notifications > 0}
						<div class="notif-circle">{Global.nb_notifications}</div>
					{/if}
				</div>
			</a>
			{#if page.text === "Notifications"}
				<hr class="w-10/12">
			{/if}
		{/each}
	</div>
	<div class="flex flex-row justify-between items-center w-full">
		{#if Global.user}
		<a href="#/account" class="flex flex-row justify-first items-center gap-3">
			<img src={photo_url} alt="profile" class="profile-picture select-none"/>
			<div class="flex flex-col justify-center items-start">
				<span class="name-text">{Global.user.first_name} {Global.user.last_name}</span>
				<span class="email-text">{Global.user.email}</span>
			</div>
		</a>
		<button class="logout-div flex justify-center items-center select-none" on:click={Server.logout}>
			<img src={Logout} alt="logout" class="logout"/>
		</button>
		{/if}
	</div>
</nav>

<style>
	nav
	{
		box-shadow: 0px 0px 40px rgb(193, 195, 206);
		z-index: 999;
		background-color: white;
	}

	#logo
	{
		font-family: 'Nunito-SemiBold';
		font-size: 23px;
		color: #09244B;
	}

	a
	{
		text-decoration: none;
	}

	.page-a
	{
		width: 225px;
		padding: 9px 16px;
	}

	.page-a:hover
	{
		background-color: #e0efff;
	}

	.page-a.active
	{
		background-color: #007AFF;
		color: white;
	}

	.page-logo
	{
		width: 20px;
		fill: red;
	}

	.page-text
	{
		font-family: 'Nunito-SemiBold';
		font-size: 17px;
		color: #526581;
	}

	.page-a.active .page-text
	{
		color: white;
	}

	hr
	{
		border: 1px solid #e7ebf0;
	}

	.notif-red
	{
		width: 8px;
		height: 8px;
		margin-left: 14px;
		margin-bottom: 13px;
		border-radius: 50%;
		background-color: #FF6252;
	}

	.request-circle
	{
		width: 13px;
		height: 13px;
		margin-right: 5px;
		border-radius: 50%;
		background-color: #E2E9EF;
	}

	.page-a:hover .request-circle
	{
		background-color: rgb(211, 226, 255);
	}

	.page-a.active .request-circle
	{
		background-color: rgba(255, 255, 255, 0.3);
	}

	.notif-circle
	{
		width: 23px;
		height: 23px;
		border-radius: 50%;
		background-color: #E2E9EF;
		color: #9AA8BE;
		font-family: 'Nunito-SemiBold';
		font-size: 13px;
		text-align: center;
		line-height: 0px;
	}

	.page-a:hover .notif-circle
	{
		color: rgb(158, 179, 228);
		background-color: rgb(211, 226, 255);
	}

	.page-a.active .notif-circle
	{
		color: white;
		background-color: rgba(255, 255, 255, 0.3);
	}

	.profile-picture
	{
		width: 45px;
		height: 45px;
		border-radius: 50%;
	}

	.name-text
	{
		font-family: 'Nunito-SemiBold';
		font-size: 17px;
		color: #09244B;
	}

	.email-text
	{
		font-family: 'Nunito-SemiBold';
		font-size: 12px;
		color: #8491A5;
	}

	.logout-div
	{
		cursor: pointer;
		width: 45px;
		height: 45px;
		margin-right: -3px;
		border-radius: 50%;
		background-color: white;
	}

	.logout-div:hover
	{
		background-color: #E2E9EF;
	}

	.logout
	{
		width: 22px;
	}
</style>
