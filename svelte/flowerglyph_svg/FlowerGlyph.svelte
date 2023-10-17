<script>
    import * as d3 from "d3";

    export let x_pos = 0;
    export let y_pos = 0;
    export let base_radius = 15;
    export let base_width = 5;

    export let categories = ["A", "B", "C"];  // The categories (and their labels)
    export let colors = ["red", "blue", "green"];   // colors of categories
    export let values = [10, 20, 5];   // value per category
    export let radius_fn = (value) => Math.max(0, Math.min(1, value / 100)); // maps category value to some value in [0, 1] which represents the petal length relative to the base radius (radius of category[0] = radius_fn(values[0]) * base_radius)
    export let width_fn = (value) => Math.max(1, Math.min(1, value / 100));  // maps category value to some value in [0, 1] which represents the petal width relative to the base width

    $: angle_step_size = 360 / categories.length;
    $: angle_idx_fn = (idx) => idx * angle_step_size;

    function vecLength(vec) {
        return Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
    }

    // compute the direction vector from the origin for a given angle in degrees [0, 360].
    // angle of 0° results in  the vector (1, 0) and 90° is (0, 1)
    function computeDirectionVector(degrees) {
        // convert to radians first
        let rad = degrees * (Math.PI/180);
        let vec = [Math.cos(rad), Math.sin(rad)];

        let l = vecLength(vec);

        vec[0] = vec[0] / l;
        vec[1] = vec[1] / l;

        return vec;
    }

    $: directionVectors = categories.map((_, i) => computeDirectionVector(angle_idx_fn(i)));
    $: max_end_pos = directionVectors.map(dir => [dir[0] * base_radius, dir[1] * base_radius]);
    $: value_end_pos = values.map((value, i) => [max_end_pos[i][0] * radius_fn(value), max_end_pos[i][1] * radius_fn(value)]);

    function createPetalPath(start_pos, end_pos, width) {
        let [x1, y1, x2, y2] = [start_pos[0], start_pos[1], end_pos[0], end_pos[1]];

        let p = d3.path();

        let ortho = [y2, -x2];
        let l = vecLength(ortho);
        ortho[0] = ortho[0] / l;
        ortho[1] = ortho[1] / l;

        p.moveTo(...start_pos);
        p.bezierCurveTo(0.7 * x2, 0.7 * y2, x2 + width * ortho[0], y2 + width * ortho[1], x2, y2);
        p.moveTo(...start_pos);
        p.bezierCurveTo(0.7 * x2, 0.7 * y2, x2 - width * ortho[0], y2 - width * ortho[1], x2, y2);

        p.closePath();

        return p.toString();
    }
</script>

<g transform="translate({x_pos} {y_pos})">
    {#each categories as category, i}
        <g transform="rotate(0)">
            <circle r=1 fill=black></circle>
            <line x1=0 x2={max_end_pos[i][0]} y1=0 y2={max_end_pos[i][1]} stroke="gray"></line>
            {#if radius_fn(values[i]) > 0}
            <path d={createPetalPath([0, 0], value_end_pos[i], base_width * width_fn(values[i]))} fill={colors[i]}></path>
            {/if}
            <g transform="translate({base_radius * 1.33} {base_radius * 1.33})">
                <g transform="rotate({-angle_idx_fn(i)})">
                    <text  x=0 y=0>{category}</text>
                </g>
            </g>
        </g>
    {/each}
</g>
