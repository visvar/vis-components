<script>
    /**
     * A simple component for selecting one or multiple values
     */
    export let options = [];
    export let values = new Set();
    export let label = '';
</script>

<main>
    <span>{label}</span>
    {#each options as option}
        <button
            class:active="{values.has(option)}"
            on:click="{() => {
                values.has(option) ? values.delete(option) : values.add(option);
                values = new Set([...values]);
            }}"
        >
            {option}
        </button>
    {/each}
</main>

<style>
    main {
        margin: 5px auto;
        align-items: flex-end;
    }

    button,
    button:focus,
    button:focus-visible {
        margin: 3px 4px;
        user-select: none;
        cursor: pointer;
        outline: none;
        opacity: 0.5;
    }

    button.active {
        opacity: 1;
    }
</style>
