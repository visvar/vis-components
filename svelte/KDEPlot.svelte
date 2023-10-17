<script>
    import * as Plot from '@observablehq/plot';
    import * as kde from 'fast-kde';
    import { afterUpdate } from 'svelte';

    export let values;
    export let xLabel = 'some value';
    export let width = 800;
    export let height = 50;

    // these control the shape and padding of the curve
    export let bandwidth = 0.05;
    export let bins = 512;
    export let pad = 4;

    let plotContainer;

    $: density1d = kde.density1d(values, { bandwidth, pad, bins });

    afterUpdate(() => {
        plotContainer.textContent = '';
        const plot = Plot.plot({
            width,
            height,
            style: {
                background: 'none',
            },
            grid: true,
            x: { label: xLabel },
            y: { label: 'density' },
            marks: [
                // use bandwidth method to update efficiently without re-binning
                Plot.areaY(density1d.bandwidth(bandwidth), {
                    x: 'x',
                    y: 'y',
                    fill: '#ccc',
                }),
                Plot.ruleY([0]),
            ],
        });
        plotContainer.appendChild(plot);
    });
</script>

<main>
    <div
        bind:this="{plotContainer}"
        width="{width}px"
        height="{height}px"
    ></div>
</main>
