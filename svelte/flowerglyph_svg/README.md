# Flowerglyph as SVG 

A simple flowerglpyh svelte component that can be used as svg element.

Example usage:
````svelte
<svg width=200 height=200>
    <FlowerGlyphs 
        x_pos=100
        y_pos=100
        categories={["A", "B", "C"]}
        values={[10, 40, 65]}
        colors={["blue", "red", "green"]}
        radius_fn={value => Math.max(0, Math.min(1, value / 70))}
        width_fn={value => Math.max(0.1, Math.min(1, value / 70))}
        base_radius=70 
        base_width=30
    </FlowerGlyphs>
</svg>
````

Which then looks like this:

![image](flower_glyph.png)

Each petal consists of four bezier curves.
The shape of those can be controlled with additional parameters:

````js
// the flower glyph consists of four bezier curves (two each side, then mirrored)
// these parameters control those relative to their length and width. in range [0, 1]
// dw & dh control the roundness of the tip  (second and third curve)
// de12 and dcp1 control the shape of the body (first and fourth curve)
export let de12 = 0.7;
export let dcp1 = 0.7;
export let dw = 0.2;
export let dh = 0.7;
````
