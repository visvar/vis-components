<script>
    /**
     * A simple component for tabs similar to browser tabs
     */
    export let options;
    export let value;
</script>

<main>
    <div class="bottom-line"></div>
    <div class="tabs">
        {#each options as option}
            <button
                class:active="{option === value}"
                on:click="{() => (value = option)}"
            >
                {option}
            </button>
        {/each}
    </div>
    <div class="bottom-line"></div>
</main>

<style>
    main {
        margin: 15px -5px;
        display: grid;
        grid-template-columns: 15px max-content auto;
        align-items: flex-end;
        --line-color: #aaa;
    }

    .tabs {
        margin: 0;
        padding: 0;
    }

    .bottom-line {
        margin: 0;
        padding: 0;
        border-bottom: 1px solid var(--line-color);
    }

    button,
    button:focus,
    button:focus-visible {
        margin: 0;
        background: none;
        user-select: none;
        border: none;
        border-bottom: 1px solid var(--line-color);
        border-radius: 4px 4px 0 0;
        padding: 4px 16px;
        cursor: pointer;
        outline: none;
    }

    button.active {
        border: 1px solid var(--line-color);
        border-bottom: none;
        margin: 0 -1px;
    }
</style>
