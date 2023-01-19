<script>
    export let type;
    export let state;
    export let days;
    export let start;
    export let end;
    export let comments;

    export let colors = ["#FFFFFF", "#FF00FF", "#00FF00"];
</script>

<div id="card">
    <div id="header">
        <h2 id="title">{type}</h2>
        <div id="state" style="--color : {colors[2]}">{state}</div>
    </div>
    {#if type == "Télétravail"}
        Jours : {#each days as _day}{_day}{/each}
    {/if}
</div>

<style>
    #card{
        background: #FFFFFF;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
        margin: 10px 10px 10px 10px;
        padding: 5px 5px 5px 5px;
        width: 20vw;
        text-align: left;
    }
    #header{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    #state{
        background-color: var(--color);
        box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.25);
        padding: 5px 5px 5px 5px;
        border-radius: 15px;
        font-size: small;
    }
</style>