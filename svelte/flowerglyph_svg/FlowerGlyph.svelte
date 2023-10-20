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

    // the flower glyph consists of four bezier curves (two each side, then mirrored)
    // these parameters control those relative to their length and width. in range [0, 1]
    // the flower glyph consists of four bezier curves (two each side, then mirrored)
    // these parameters control those relative to their length and width. in range [0, 1]
    // dw & dh control the roundness of the tip  (second and third curve)
    // de12 and dcp1 control the shape of the body (first and fourth curve)
    export let de12 = 0.7;
    export let dcp1 = 0.7;
    export let dw = 0.2;
    export let dh = 0.7;

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

        vec = normV(vec);

        return vec;
    }

    $: directionVectors = categories.map((_, i) => computeDirectionVector(angle_idx_fn(i)));
    $: max_end_pos = directionVectors.map(dir => [dir[0] * base_radius, dir[1] * base_radius]);
    $: value_end_pos = values.map((value, i) => [max_end_pos[i][0] * radius_fn(value), max_end_pos[i][1] * radius_fn(value)]);

    function normV(v) {
        return mulAV(1.0/vecLength(v), v);
    }

    function addV1V2(v1, v2) {
        return [v1[0] + v2[0], v1[1] + v2[1]];
    }

    function mulAV(a, v) {
        return [a * v[0], a * v[1]];
    }

    function addAV(a, v) {
        return [a + v[0], a + v[1]];
    }

    // creates petal path, assumes start at [0, 0]
    // width: the max width of the petal
    // end_pos: the end position of the petal
    function createPetalPath(end_pos, width) {
        let [x2, y2] = [end_pos[0], end_pos[1]];

        let p = d3.path();

        let dcp1_ = dcp1 * de12;

        let ortho = normV([y2, -x2]);
        let cp1 = mulAV(dcp1_, end_pos);
        let cp2 = addV1V2(mulAV(dcp1_, end_pos), mulAV(width, ortho));
        let cp3 = addV1V2(mulAV(dcp1_, end_pos), mulAV(-width, ortho));
        let e1 = addV1V2(mulAV(de12, end_pos), mulAV(width, ortho));
        let e2 = addV1V2(mulAV(de12, end_pos), mulAV(-width, ortho));
        let cp1e1 = addV1V2(mulAV(de12 + dh * (1-de12), end_pos), mulAV(width, ortho));
        let cp2e1 = addV1V2(end_pos, mulAV(dw * width, ortho));
        let cp1e2 = addV1V2(end_pos, mulAV(dw*-width, ortho));
        let cp2e2 = addV1V2(mulAV(de12 + dh * (1-de12), end_pos), mulAV(-width, ortho));
        let e = end_pos;

        p.moveTo(0, 0);
        p.bezierCurveTo(cp1[0], cp1[1], cp2[0], cp2[1], e1[0], e1[1]);
        p.bezierCurveTo(cp1e1[0], cp1e1[1], cp2e1[0], cp2e1[1], e[0], e[1]);
        p.bezierCurveTo(cp1e2[0], cp1e2[1], cp2e2[0], cp2e2[1], e2[0], e2[1]);
        p.bezierCurveTo(cp3[0], cp3[1], cp1[0], cp1[1], 0, 0);
        //p.closePath();

        return p.toString();
    }
</script>

<g transform="translate({x_pos} {y_pos})">
    {#each categories as category, i}
        <g transform="rotate(0)">
            <circle r=1 fill=black></circle>
            <line x1=0 x2={max_end_pos[i][0]} y1=0 y2={max_end_pos[i][1]} stroke="gray"></line>
            {#if radius_fn(values[i]) > 0}
            <path d={createPetalPath(value_end_pos[i], base_width * width_fn(values[i]))} fill={colors[i]}></path>
            {/if}
            <text x={max_end_pos[i][0] * 1.1} y={max_end_pos[i][1] * 1.2}>{category}</text>
        </g>
    {/each}
</g>
