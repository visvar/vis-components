<script>
    /**
     * Simple example for how to use Observable Plot for static visualizations
     * in Svelte. As Plot is static, it has to be re-created anytime the
     * component updates. But you can make computations reactive ushc that only
     * the preprocessing for the data that has changed is executed.
     */
    import * as Plot from '@observablehq/plot';
    import { afterUpdate } from 'svelte';

    export let data;
    export let width = 800;
    export let height = 100;

    let plotContainer;

    afterUpdate(() => {
        plotContainer.textContent = '';
        const plot = Plot.plot({
            width,
            height,
            marks: [Plot.barY(data, { x: 'x', y: 'y' })],
        });

        plotContainer.appendChild(plot);
    });
</script>

<main style="width: {width}px">
    <div
        bind:this="{plotContainer}"
        width="{width}px"
        height="{height}px"
    ></div>
</main>
