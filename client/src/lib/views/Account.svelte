<script lang="ts">
	// A remplacer par le contenu de la BDD
	let name = "Nom";
	let firstname = "Prénom";
	let birthDate = "jj/mm/aa";
	let department = "service";
	let position = "poste";									
	let mail = "exemple@entreprise.fr";
	let password = "password"				// A changer, sécurité.
	let profilePic = "/img/user.png";
	let docs = ["doc1.pdf", "doc2.pdf", "doc3.docx"];
	let activeDoc = "";

	const changePassword = () => {
		// charger page changement de mot de passe (même que pour mot de passe oublié au login)
	}

	const changeDoc = (doc:string) => {
		activeDoc = "/img/" + doc;
		if(activeDoc !=""){
			document.getElementById("docDisplay").style.display = "block";
		}
	}

</script>

<div class="flex flex-row gap-6 w-full">
	<div class = "card gap-4 !w-2/5 h-[90%]">
		<img src={profilePic} alt="Avatar" class = "rounded-xl w-32 h-32">
		<div>
			<h1> {name} {firstname}</h1>
			<p> Date de naissance : {birthDate}</p>
		</div>
		<div>
			<h2 class = "text-lg font-semibold">Service : {department}</h2>
			<p> Poste : {position}</p>
			<p> mail : <a href={mail}>{mail}</a> </p>
		</div>
		
		<div>
			<label for="pass">Mot de passe</label>
			<input type="password" name="password" id="pass" minlength="8" required value = {password}>
			<button class = "!h-[30px] w-[100] my-3 !rounded-[25px] !py-0 bg-[#007AFF]"
					on:click={() => changePassword()} >modifier
			</button>
		</div>

		<select class = "w-[300px] h-[35px] py-[2px] px-2 border-[2px] border-[#007AFF] rounded-[4px]">
			<option value="">-- mes documents --</option>
			{#each docs as doc}
				<option value={doc} on:click={() => changeDoc(doc)}>{doc}</option>
			{/each}
		</select>
	</div>

	<div class = "card !w-[600px] h-[90%] hidden" id="docDisplay">
		<embed src={activeDoc} class = "w-full h-full" />
	</div>
</div>

<style>
input{
	@apply rounded-md bg-[#dcdada79] border-[1px] border-[#61a3eb];
}
label{
	@apply my-[4px] text-left;
}
button{
	@apply border-0 w-[200px] h-[40px] cursor-pointer rounded-md py-2 px-3 font-bold text-white shadow-[1px_2px_3px_rgba(0,0,0,0.2)];
}
.card{
	@apply p-1 bg-[#dcdada79] rounded-md shadow-[0px_2px_4px_rgba(6,88,239,0.42)];
}

</style>
